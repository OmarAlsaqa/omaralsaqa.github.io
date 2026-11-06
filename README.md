# Omar Alsaqa's Personal Website

[![Deploy Hugo site to GitHub Pages](https://github.com/OmarAlsaqa/omaralsaqa.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/OmarAlsaqa/omaralsaqa.github.io/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/badge/Website-omaralsaqa.github.io-blue?style=flat&logo=google-chrome)](https://omaralsaqa.github.io/)

Personal academic portfolio, research blog, and publications of **Omar Alsaqa** (Machine Learning Researcher focusing on Geometry-Aware Deep Learning and Graph Neural Networks).

Live site: **[https://omaralsaqa.github.io/](https://omaralsaqa.github.io/)**

---

## ⚡ Tech Stack

- **Static Site Generator:** [Hugo](https://gohugo.io/) (Build time ~20 ms)
- **Math Rendering:** [KaTeX](https://katex.org/)
- **Typography:** Space Grotesk, Inter, JetBrains Mono
- **Hosting & CI/CD:** GitHub Pages via GitHub Actions
- **Comments & Discussion:** [Giscus](https://giscus.app/) (Powered by GitHub Discussions)

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)

### Run Development Server
```bash
# Clone the repository
git clone https://github.com/OmarAlsaqa/omaralsaqa.github.io.git
cd omaralsaqa.github.io

# Start Hugo development server with live reload
npx hugo-bin server -p 1313 --bind 0.0.0.0 --buildDrafts
```
Open [http://localhost:1313](http://localhost:1313) in your browser.

### Production Build
```bash
npx hugo-bin --minify
```
Build output is generated in `./public/`.

---

## 📂 Project Structure

```text
├── content/              # Content pages (About, News, Blog Posts, Publications)
├── data/                 # Structured YAML data (publications.yaml, news.yaml)
├── layouts/              # Hugo HTML templates & components
│   ├── _default/         # Base layout (baseof.html) and taxonomies
│   ├── news/             # News timeline templates
│   ├── posts/            # Blog list and single post templates
│   └── publications/     # Publications editorial & filter layout
├── static/               # Static assets directly served at web root
│   ├── css/              # Main stylesheet (style.css)
│   ├── js/               # Theme toggle, filters, Giscus sync (main.js)
│   └── img/              # Profile avatar and images
└── hugo.toml             # Site configuration and metadata
```

---

## 📄 License
Content &copy; Omar Alsaqa. Source code licensed under the [MIT License](LICENSE).
