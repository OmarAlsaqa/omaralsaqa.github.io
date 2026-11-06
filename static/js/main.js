/* Main JS for Omar Alsaqa's Research Portfolio */

(function () {
  // Global URL Search Params initialized once at the top
  const urlParams = new URLSearchParams(window.location.search);

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getSavedTheme() {
    return localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
    if (typeof window.updateMeshTheme === 'function') {
      window.updateMeshTheme();
    }
    // Sync Giscus iframe theme if present
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      giscusFrame.contentWindow.postMessage({
        giscus: {
          setConfig: {
            theme: theme === 'light' ? 'light' : 'dark_dimmed'
          }
        }
      }, 'https://giscus.app');
    }
  }

  // Check URL param ?theme=light|dark for instant preview
  const urlTheme = urlParams.get('theme');
  if (urlTheme === 'light' || urlTheme === 'dark') {
    applyTheme(urlTheme);
  } else {
    applyTheme(getSavedTheme());
  }

  // Check URL param ?scroll=Y for instant scroll position
  const urlScroll = urlParams.get('scroll');
  if (urlScroll) {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        window.scrollTo(0, parseInt(urlScroll, 10));
      });
    } else {
      window.scrollTo(0, parseInt(urlScroll, 10));
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Dynamic Header: Smooth with page at top, floating capsule when scrolled
  const headerInner = document.getElementById('header-inner');
  if (headerInner) {
    function handleScroll() {
      if (window.scrollY > 35) {
        headerInner.classList.add('is-scrolled');
      } else {
        headerInner.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
  }

  // BibTeX Toggle & Copy
  window.toggleBibtex = function (id) {
    const el = document.getElementById('bibtex-' + id);
    if (!el) return;
    const isHidden = el.style.display === 'none' || !el.style.display;
    el.style.display = isHidden ? 'block' : 'none';
  };

  window.copyBibtex = function (id, btn) {
    const el = document.getElementById('bibtex-code-' + id);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text.trim()).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = 'Copied';
      btn.classList.add('btn-success');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('btn-success');
      }, 2000);
    });
  };

  // Copy Email to Clipboard
  window.copyEmail = function (email, btn) {
    navigator.clipboard.writeText(email).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = 'Copied';
      btn.classList.add('btn-success');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('btn-success');
      }, 2000);
    });
  };

  // Interactive Publication Tag Filter (Broad Categories: Vision, GNN, NLP, RL)
  window.filterPublications = function (tag, btn) {
    const entries = document.querySelectorAll('.pub-editorial-entry[data-tags], .academic-entry[data-tags]');
    const buttons = document.querySelectorAll('.tag-filter-btn');
    buttons.forEach(b => b.classList.remove('active'));

    const normalizedTag = (tag || 'all').trim().toLowerCase();

    // Helper to test if a tag belongs to a category
    function matchesCategory(tagVal, category) {
      const v = (tagVal || '').trim().toLowerCase();
      const cat = (category || '').trim().toLowerCase();
      if (v === cat) return true;
      if (cat === 'all') return true;
      if (cat === 'gnn' && (v === 'gnn' || v.includes('graph'))) return true;
      if (cat === 'vision' && (v === 'vision' || v.includes('vision') || v.includes('image'))) return true;
      if (cat === 'rl' && (v === 'rl' || v.includes('reinforcement') || v.includes('bandit'))) return true;
      if (cat === 'nlp' && (v === 'nlp' || v.includes('language') || v.includes('multimodal') || v.includes('speech'))) return true;
      return v.includes(cat) || cat.includes(v);
    }

    // Determine canonical category name for the requested tag
    let canonicalCat = 'all';
    if (normalizedTag !== 'all') {
      if (normalizedTag === 'gnn' || normalizedTag.includes('graph')) {
        canonicalCat = 'gnn';
      } else if (normalizedTag === 'vision' || normalizedTag.includes('vision') || normalizedTag.includes('image')) {
        canonicalCat = 'vision';
      } else if (normalizedTag === 'rl' || normalizedTag.includes('reinforcement') || normalizedTag.includes('bandit')) {
        canonicalCat = 'rl';
      } else if (normalizedTag === 'nlp' || normalizedTag.includes('language') || normalizedTag.includes('multimodal')) {
        canonicalCat = 'nlp';
      } else {
        canonicalCat = normalizedTag;
      }
    }

    // Highlight active button
    if (btn && btn.classList.contains('tag-filter-btn')) {
      btn.classList.add('active');
    } else {
      const match = Array.from(buttons).find(b => {
        const bTag = (b.getAttribute('data-tag') || '').trim().toLowerCase();
        return bTag === canonicalCat || matchesCategory(bTag, canonicalCat);
      });
      if (match) {
        match.classList.add('active');
      } else {
        const allBtn = document.querySelector('.tag-filter-btn[data-tag="all"]');
        if (allBtn) allBtn.classList.add('active');
      }
    }

    // Filter publication entries
    entries.forEach(entry => {
      if (canonicalCat === 'all') {
        entry.style.display = '';
        return;
      }
      const raw = entry.getAttribute('data-tags') || '';
      const tagsList = raw.split(',').map(t => t.trim().toLowerCase());
      const hasMatch = tagsList.some(t => matchesCategory(t, canonicalCat));

      if (hasMatch) {
        entry.style.display = '';
      } else {
        entry.style.display = 'none';
      }
    });
  };

  // Anti-Scraping Dynamic Contact & CV Request Modal
  function getDecodedEmail() {
    try {
      const u = atob('by5hbHNhcWE='); // o.alsaqa
      const d = atob('Z21haWwuY29t'); // gmail.com
      return u + '@' + d;
    } catch (e) {
      return '';
    }
  }

  function getDecodedPhone() {
    try {
      return atob('KzEgNDE2LTM5OS0wNjMy'); // +1 416-399-0632
    } catch (e) {
      return '';
    }
  }

  function getDecodedPhoneDigits() {
    try {
      return atob('MTQxNjM5OTA2MzI='); // 14163990632
    } catch (e) {
      return '';
    }
  }

  window.openContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    if (typeof renderMathInElement === 'function') {
      renderMathInElement(modal, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '\\[', right: '\\]', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false
      });
    }

    const email = getDecodedEmail();
    const emailTarget = document.getElementById('modal-email-target');
    const subEmailLink = document.getElementById('modal-sub-email-link');

    if (emailTarget) {
      emailTarget.textContent = email;
    }
    if (subEmailLink) {
      subEmailLink.href = 'mailto:' + email;
    }

    const phone = getDecodedPhone();
    const phoneDigits = getDecodedPhoneDigits();
    const phoneTarget = document.getElementById('modal-phone-target');
    const smsLink = document.getElementById('modal-sms-link');
    const whatsappLink = document.getElementById('modal-whatsapp-link');

    if (phoneTarget) {
      phoneTarget.textContent = phone;
    }
    if (smsLink) {
      smsLink.href = 'sms:+' + phoneDigits;
    }
    if (whatsappLink) {
      whatsappLink.href = 'https://wa.me/' + phoneDigits;
    }

    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.copyObfuscatedEmail = function (btn) {
    const email = getDecodedEmail();
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      if (!btn) return;
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      const origTitle = btn.getAttribute('title') || 'Copy email address';

      if (copyIcon && checkIcon) {
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
      }
      btn.setAttribute('title', 'Copied!');
      btn.classList.add('btn-success');

      setTimeout(() => {
        if (copyIcon && checkIcon) {
          copyIcon.style.display = 'block';
          checkIcon.style.display = 'none';
        }
        btn.setAttribute('title', origTitle);
        btn.classList.remove('btn-success');
      }, 2000);
    });
  };

  window.copyObfuscatedPhone = function (btn) {
    const phone = getDecodedPhone();
    if (!phone) return;
    navigator.clipboard.writeText(phone).then(() => {
      if (!btn) return;
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      const origTitle = btn.getAttribute('title') || 'Copy phone number';

      if (copyIcon && checkIcon) {
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
      }
      btn.setAttribute('title', 'Copied!');
      btn.classList.add('btn-success');

      setTimeout(() => {
        if (copyIcon && checkIcon) {
          copyIcon.style.display = 'block';
          checkIcon.style.display = 'none';
        }
        btn.setAttribute('title', origTitle);
        btn.classList.remove('btn-success');
      }, 2000);
    });
  };

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('contact-modal');
      if (modal && modal.classList.contains('is-visible')) {
        window.closeContactModal();
      }
    }
  });

  // Interactive Name Swap (Tap-to-toggle for mobile/touch)
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.name-swap').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('is-toggled');
      });
    });
  });

  // Auto-open contact modal if query param ?modal=contact is present
  if (urlParams.get('modal') === 'contact') {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        if (typeof window.openContactModal === 'function') window.openContactModal();
      });
    } else {
      if (typeof window.openContactModal === 'function') window.openContactModal();
    }
  }

  // Auto-apply tag filter if query param ?tag=... is in URL
  const requestedTag = urlParams.get('tag');
  if (requestedTag) {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        filterPublications(requestedTag);
      });
    } else {
      filterPublications(requestedTag);
    }
  }

  // ==========================================================================
  // Blog Utilities: Code Copy Button, Alert Callouts, Table Wrapper & ToC
  // ==========================================================================
  function initCodeCopyButtons() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(block => {
      if (block.querySelector('.code-copy-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.innerHTML = `
        <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <svg class="check-icon" style="display:none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span class="btn-text">Copy</span>
      `;

      btn.addEventListener('click', () => {
        let codeEl = block.querySelector('code');
        let textToCopy = '';
        if (codeEl) {
          const clone = codeEl.cloneNode(true);
          const lineNumbers = clone.querySelectorAll('.ln, .lnt');
          lineNumbers.forEach(ln => ln.remove());
          textToCopy = clone.innerText || clone.textContent;
        } else {
          textToCopy = block.innerText || block.textContent;
        }

        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
          btn.classList.add('copied');
          const copyIcon = btn.querySelector('.copy-icon');
          const checkIcon = btn.querySelector('.check-icon');
          const textSpan = btn.querySelector('.btn-text');
          if (copyIcon && checkIcon && textSpan) {
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'inline-block';
            textSpan.textContent = 'Copied!';
          }

          setTimeout(() => {
            btn.classList.remove('copied');
            if (copyIcon && checkIcon && textSpan) {
              copyIcon.style.display = 'inline-block';
              checkIcon.style.display = 'none';
              textSpan.textContent = 'Copy';
            }
          }, 2000);
        });
      });

      block.appendChild(btn);
    });
  }

  function initAlertCallouts() {
    const blockquotes = document.querySelectorAll('.markdown-content blockquote');
    blockquotes.forEach(bq => {
      // Don't re-process if already processed
      if (bq.classList.contains('alert-callout')) return;

      const firstP = bq.querySelector('p');
      if (!firstP) return;

      const html = firstP.innerHTML.trim();
      const match = html.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>|\s*\n|\s*)([\s\S]*)$/i);
      if (!match) return;

      const type = match[1].toLowerCase();
      const content = match[2];

      bq.classList.add('alert-callout', `alert-${type}`);

      const titles = {
        note: 'Note',
        tip: 'Tip',
        important: 'Important',
        warning: 'Warning',
        caution: 'Caution'
      };

      const icons = {
        note: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        tip: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
        important: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        caution: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      };

      const header = document.createElement('div');
      header.className = 'alert-callout-header';
      header.innerHTML = `${icons[type] || icons.note}<span>${titles[type] || 'Note'}</span>`;

      firstP.innerHTML = content;
      bq.insertBefore(header, firstP);
      if (!firstP.textContent.trim()) {
        firstP.remove();
      }
    });
  }

  function initTableWrappers() {
    const markdownTables = document.querySelectorAll('.markdown-content table');
    markdownTables.forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }

  function initTocScrollSpy() {
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    if (tocLinks.length === 0) return;

    const headings = Array.from(document.querySelectorAll('.markdown-content h2, .markdown-content h3'));
    if (headings.length === 0) return;

    function updateActiveToc() {
      const scrollPos = window.scrollY + 120;
      let currentHeading = headings[0];

      for (let i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop <= scrollPos) {
          currentHeading = headings[i];
        } else {
          break;
        }
      }

      if (currentHeading && currentHeading.id) {
        tocLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + currentHeading.id) {
            if (!link.classList.contains('active')) {
              link.classList.add('active');
              const sidebar = document.querySelector('.post-toc-sidebar');
              if (sidebar && sidebar.scrollHeight > sidebar.clientHeight) {
                const linkRect = link.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
                  link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
              }
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
    }

    window.addEventListener('scroll', updateActiveToc, { passive: true });
    updateActiveToc();

    // Smooth scroll with offset when clicking ToC links
    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const yOffset = -90; // offset for floating capsule header
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  function runBlogEnhancements() {
    initCodeCopyButtons();
    initAlertCallouts();
    initTableWrappers();
    initTocScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBlogEnhancements);
  } else {
    runBlogEnhancements();
  }
})();
