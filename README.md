# Rahul Nalte — UI/UX Designer Portfolio

A premium, recruiter-focused portfolio website built with **vanilla HTML5, CSS3, and JavaScript** — no frameworks, no dependencies.

## 🌐 Live Preview
Open `index.html` in any modern browser or serve locally.

## 🛠 Tech Stack
- HTML5 (semantic, accessible)
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript ES6+
- Google Fonts (Inter)

## 📁 Folder Structure
```
portfolio/
├── index.html
├── css/
│   ├── style.css        # Design tokens, components, layouts
│   ├── animations.css   # Keyframes, scroll reveal
│   └── responsive.css   # Breakpoints (mobile-first)
├── js/
│   ├── cursor.js        # Custom cursor + magnetic buttons
│   ├── animations.js    # Scroll reveal, counters, tilt, tabs
│   ├── scroll.js        # Smooth scroll, parallax, scroll bar
│   └── main.js          # Loader, nav, carousel, form
├── assets/
│   ├── images/          # Add real project screenshots here
│   └── Rahul-Nalte-Resume.pdf
└── README.md
```

## 🚀 Getting Started

### Local Development
```bash
# Option 1 — Python simple server
python3 -m http.server 8000

# Option 2 — Node live-server
npx live-server

# Option 3 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## 🔧 Customisation

### Replace Placeholder Content
| What | Where |
|------|--------|
| Profile photo | `.about__photo` div in `index.html` |
| Project images | `.project-card__img-placeholder` divs |
| Email address | `#contactForm` and `contact__links` in `index.html` |
| Social URLs | All `href` attributes on social links |
| Resume PDF | `assets/Rahul-Nalte-Resume.pdf` |
| Testimonials | `.testimonial-card` blocks in `index.html` |

### Connect EmailJS (Contact Form)
1. Sign up at [emailjs.com](https://emailjs.com)
2. Replace the `setTimeout` simulation in `js/main.js → Contact Form` section with:
```js
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY')
  .then(() => { /* show success */ })
  .catch(() => { /* show error */ });
```
3. Add EmailJS CDN before closing `</body>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

## 🌍 Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```

### Netlify
Drag & drop the project folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
```bash
# Push to GitHub, then enable Pages in Settings → Pages → Deploy from main branch
```

## ♿ Accessibility
- WCAG AA compliant
- Keyboard navigable (Tab, Arrow keys for tabs/carousel)
- ARIA labels throughout
- Reduced motion support via `@media (prefers-reduced-motion: reduce)`
- Semantic HTML5 landmarks

## 🔍 SEO
- Complete Open Graph & Twitter Card meta tags
- JSON-LD structured data (Person schema)
- Canonical URL
- `robots.txt` & `sitemap.xml` included

## 📄 License
Personal use only. Designed for Rahul Nalte's portfolio.

---
Made with ❤️ by Rahul Nalte
