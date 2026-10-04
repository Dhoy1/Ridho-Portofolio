# Ridho Fisabilillah - Personal Portfolio

A modern, multi-page personal portfolio website built with HTML5, CSS3, and Vanilla JavaScript.

## Features
- **Multi-page Architecture**: Separate HTML files for each section (Home, About, Portfolio, Skills, Experience, Contact).
- **Responsive Design**: Fully responsive layout that adapts to desktop, tablet, and mobile devices using Flexbox and CSS Grid.
- **Dark Theme**: Modern dark navy and purple aesthetic with subtle hover effects.
- **No Frameworks**: Built purely with Vanilla CSS and JS without relying on CSS frameworks like Tailwind or Bootstrap.

## Project Structure
```
ridho-portfolio/
├── index.html        # Home / Landing Page
├── about.html        # About Me & Education
├── portfolio.html    # Projects showcase
├── skills.html       # Technical & Soft skills
├── experience.html   # Experience timeline
├── contact.html      # Contact info & form
├── css/
│   ├── style.css     # Global layout, typography, colors
│   ├── components.css# Reusable UI components (buttons, cards, timeline, etc.)
│   └── responsive.css# Media queries for mobile/tablet optimization
├── js/
│   └── script.js     # Mobile navigation toggle & active link handling
└── assets/           
    ├── images/       # Project screenshots, profile picture
    ├── icons/        # Additional SVG icons
    └── cv/           # Resume / CV files
```

## How to Run
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. You can navigate through the pages normally, no server or build process is required.

## Customization
- **Colors**: You can modify the primary colors in `css/style.css` under the `:root` variables.
- **Profile Image**: Replace the `div.profile-img` with an actual `<img>` tag and point the `src` to your image in `assets/images/`.

## Author
Ridho Fisabilillah
Information Systems Student - Universitas Darma Persada
