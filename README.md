# lost0x01 Portfolio Site

A modern, cybersecurity-focused portfolio built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Fast Performance** - Built with Vite for lightning-fast development and builds
- **Modern Stack** - React 18, Tailwind CSS 3, Vite 5
- **Terminal Aesthetic** - Neon green cybersecurity theme
- **GitHub Pages Ready** - Deploy directly to GitHub Pages

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📂 Project Structure

```
├── src/
│   ├── App.jsx          # Main portfolio component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles and Tailwind imports
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── .gitignore           # Git exclusions
```

## 🌐 Deployment

This project is configured to deploy to GitHub Pages using the `gh-pages` package.

### Deploy Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

Your site will be live at: `https://lost0x01.github.io`

## 🎨 Customization

### Colors
The site uses a neon green cybersecurity theme. To customize colors, edit `tailwind.config.js`:

```js
theme: {
  colors: {
    // Your custom colors here
  }
}
```

### Content
Edit `src/App.jsx` to update:
- Personal information
- Project descriptions
- Links and social media
- Skills and technologies

## 📝 Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 📜 License

This project is open source and available under the MIT License.

## 🔗 Links

- [GitHub Profile](https://github.com/lost0x01)
- [Personal Website](https://lost0x01.github.io)

---

**Built with 💚 for cybersecurity and AI enthusiasts**
