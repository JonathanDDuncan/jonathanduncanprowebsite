# jonathanduncan.pro

Professional portfolio and blog for Jonathan Duncan — Freelance Software & AI Engineer.

**Live site:** [jonathanduncan.pro](https://jonathanduncan.pro)

## About

This is the source for my personal website, built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). It showcases my services, project case studies, client testimonials, and technical blog.

## Tech Stack

- **Framework:** MkDocs Material (Python)
- **Styling:** Custom CSS with design tokens, dark/light mode, glass morphism
- **Plugins:** Blog, Social Cards, SEO, Search
- **Hosting:** GitHub Pages with custom domain
- **CI/CD:** GitHub Actions

## Project Structure

```
mkdocs.yml              # Site configuration
docs/
├── index.md            # Homepage (hero section)
├── services.md         # Services & pricing
├── about.md            # About page
├── contact.md          # Contact page
├── faq.md              # FAQ
├── testimonials.md     # Client testimonials
├── portfolio/          # Project case studies
├── blog/posts/         # Blog articles
├── stylesheets/        # Custom CSS
├── javascripts/        # Client-side JS
└── assets/             # Images, favicon
overrides/
└── main.html           # Template overrides
```

## Local Development

**Requirements:** Python 3.11+

```bash
pip install mkdocs-material[imaging]
mkdocs serve
```

Visit `http://localhost:8000` to preview.

### Docker

```bash
docker build -t mkdocs .
docker run -p 8000:8000 -v $(pwd):/docs mkdocs
```

## Deployment

Deployed via GitHub Pages. Push to `main` to trigger the build pipeline.

## License

All content and code in this repository is proprietary. All rights reserved.
