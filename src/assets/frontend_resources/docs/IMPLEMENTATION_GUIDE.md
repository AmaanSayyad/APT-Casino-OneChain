# OneArcade Implementation Guide

## Quick Start

This guide provides step-by-step instructions for implementing the OneArcade brand redesign. Follow these steps to update your frontend from APT-Casino to OneArcade.

---

## Prerequisites

- Access to project source code
- Text editor (VS Code recommended)
- Basic knowledge of HTML/CSS
- Git for version control (recommended)

---

## Step 1: Backup Current Version

Before making any changes, create a backup:

```bash
# Create a backup branch
git checkout -b backup-apt-casino

# Commit current state
git add .
git commit -m "Backup: APT-Casino version before OneArcade rebrand"

# Create working branch
git checkout -b onearcade-rebrand
```

---

## Step 2: Update CSS Variables

### 2.1 Locate Root CSS File

Find your main CSS file (usually `styles.css`, `main.css`, or `globals.css`)

### 2.2 Replace Color Variables

**Find and replace these color variables:**

```css
/* OLD COLORS - REMOVE */
--primary-color: #9D4EDD;      /* Purple */
--secondary-color: #FF006E;    /* Pink */
--accent-color: #FB5607;       /* Orange/Red */
```

**Replace with:**

```css
/* NEW COLORS - OneArcade */
--primary-color: #0066FF;      /* Primary Blue */
--secondary-color: #00A3FF;    /* Secondary Blue */
--accent-color: #4DA6FF;       /* Accent Blue */
--dark-color: #001F3F;         /* Dark Navy */
--light-color: #E6F2FF;        /* Light Blue White */
```

### 2.3 Add Gradient Variables

Add these new gradient variables:

```css
/* Gradients */
--gradient-primary: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%);
--gradient-secondary: linear-gradient(135deg, #0066FF 0%, #00A3FF 100%);
--gradient-dark: linear-gradient(180deg, #001F3F 0%, #0066FF 100%);
```

### 2.4 Use Complete Stylesheet (Optional)

Alternatively, you can use the complete `onearcade-styles.css` file provided:

```bash
# Copy the complete stylesheet
cp frontend_resources/css/onearcade-styles.css src/styles/onearcade-styles.css
```

Then import it in your main file:

```css
@import './onearcade-styles.css';
```

---

## Step 3: Replace Logo Files

### 3.1 Locate Current Logo Files

Find your current logo files (usually in `/public`, `/assets`, or `/images` folder)

### 3.2 Replace Logo Images

**Copy new logo files:**

```bash
# Navigation/Header logo
cp frontend_resources/logos/onearcade-logo-horizontal.png public/logo.png

# Or use SVG version
cp frontend_resources/logos/onearcade-logo-horizontal.svg public/logo.svg

# Favicon
cp frontend_resources/logos/onearcade-icon-512.png public/favicon.png

# Convert to .ico if needed
# Use online tool: https://www.favicon-generator.org/
```

### 3.3 Update Logo References in HTML

**Find and update logo image sources:**

```html
<!-- OLD -->
<img src="/logo.png" alt="APT-Casino" />

<!-- NEW -->
<img src="/logo.png" alt="OneArcade" />
```

### 3.4 Update Favicon

**In your HTML `<head>` section:**

```html
<!-- Update favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png">
```

---

## Step 4: Global Text Replacement

### 4.1 Use Find & Replace

**In VS Code:**
1. Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
2. Enable "Match Case" and "Match Whole Word"
3. Search for: `APT-Casino` or `APT Casino`
4. Replace with: `OneArcade`
5. Review each match before replacing
6. Click "Replace All" or replace individually

**Important:** 
- ⚠️ DO NOT replace variable names or file names
- ⚠️ Only replace user-facing text
- ⚠️ DO NOT change "One Chain Network" mentions

### 4.2 Specific Text Updates

#### Navigation Bar
```html
<!-- OLD -->
<div class="navbar-logo">APT-Casino</div>

<!-- NEW -->
<div class="navbar-logo">OneArcade</div>
```

#### Page Title
```html
<!-- OLD -->
<title>APT Casino - Decentralized Gaming</title>

<!-- NEW -->
<title>OneArcade - One Chain Gaming Platform</title>
```

#### Meta Tags
```html
<!-- Update meta description -->
<meta name="description" content="OneArcade is the next-generation decentralized gaming and entertainment platform built on One Chain Network." />

<!-- Update Open Graph tags -->
<meta property="og:title" content="OneArcade - One Chain Gaming Platform" />
<meta property="og:description" content="Experience transparent, fair, and secure on-chain gaming where you truly own your assets." />
```

#### Footer Copyright
```html
<!-- OLD -->
<p>&copy; 2025 APT-Casino. All rights reserved.</p>

<!-- NEW -->
<p>&copy; 2025 OneArcade. All rights reserved.</p>
```

#### Footer Description
```html
<!-- OLD -->
<p>APT-Casino is your ultimate destination for One Chain Network gaming...</p>

<!-- NEW -->
<p>OneArcade is the next-generation decentralized gaming and entertainment platform built on One Chain Network. Experience transparent, fair, and secure on-chain gaming where you truly own your assets.</p>
```

---

## Step 5: Update Component Styles

### 5.1 Button Components

**Update button classes:**

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 24px;
  padding: 12px 32px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 30px rgba(0, 163, 255, 0.6);
  transform: translateY(-2px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #00A3FF;
  border-radius: 24px;
  padding: 12px 32px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #0066FF;
  border-color: #0066FF;
}
```

### 5.2 Card Components

**Update card styles:**

```css
/* Feature Card */
.feature-card {
  background: rgba(0, 31, 63, 0.6);
  border: 2px solid #0066FF;
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(0, 31, 63, 0.8);
  box-shadow: 0 0 20px rgba(0, 163, 255, 0.3);
  transform: translateY(-4px);
}

/* Game Card */
.game-card {
  background: rgba(0, 31, 63, 0.6);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #0066FF, #00A3FF) 1;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 0 30px rgba(0, 163, 255, 0.6);
}
```

### 5.3 Tags/Badges

**Update tag colors:**

```css
/* Game Tags */
.tag-popular {
  background: #0066FF;  /* Primary Blue */
}

.tag-hot {
  background: #00A3FF;  /* Secondary Blue */
}

.tag-featured {
  background: #4DA6FF;  /* Accent Blue */
}

.tag {
  color: #FFFFFF;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
```

### 5.4 Links

**Update link styles:**

```css
a {
  color: #00A3FF;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #4DA6FF;
}
```

---

## Step 6: Update Hero Section

### 6.1 Hero Background

```css
.hero {
  background: linear-gradient(180deg, #001F3F 0%, #0066FF 100%);
  padding: 48px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Add animated background effect */
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
```

### 6.2 Hero Title

```css
.hero-title {
  font-size: 64px;
  font-weight: bold;
  background: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Step 7: Update Icons

### 7.1 Copy Icon Files

```bash
# Copy all icon files to your project
cp frontend_resources/icons/*.png public/icons/
```

### 7.2 Update Icon References

**In your HTML/JSX:**

```html
<!-- Wallet Icon -->
<img src="/icons/icon-wallet.png" alt="Wallet" />

<!-- Tokens Icon -->
<img src="/icons/icon-tokens.png" alt="Tokens" />

<!-- Gamepad Icon -->
<img src="/icons/icon-gamepad.png" alt="Gaming" />

<!-- Trophy Icon -->
<img src="/icons/icon-trophy.png" alt="Rewards" />
```

---

## Step 8: Test Responsive Design

### 8.1 Test Breakpoints

Test your changes at different screen sizes:

- Desktop: 1920px, 1440px, 1024px
- Tablet: 768px
- Mobile: 480px, 375px, 320px

### 8.2 Browser Testing

Test in multiple browsers:
- Chrome
- Firefox
- Safari
- Edge

---

## Step 9: Update Open Graph Image

### 9.1 Create OG Image

Create a 1200×630px image with:
- OneArcade logo
- Blue gradient background
- Brief tagline

### 9.2 Update Meta Tags

```html
<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/og-image.png" />
```

---

## Step 10: Final Verification

### Verification Checklist

#### Visual Checks
- [ ] All logos display OneArcade blue logo
- [ ] Color scheme changed from purple/pink to blue
- [ ] All buttons use blue gradient or blue border
- [ ] Game card tags use blue colors
- [ ] Links and hover effects are blue

#### Text Checks
- [ ] Navigation bar shows "OneArcade"
- [ ] Page title includes "OneArcade"
- [ ] Hero section updated
- [ ] Footer copyright shows "© 2025 OneArcade"
- [ ] Footer description updated
- [ ] All "One Chain Network" mentions unchanged ✓

#### Technical Checks
- [ ] Favicon updated
- [ ] Open Graph image updated
- [ ] CSS variables modified
- [ ] Image files replaced
- [ ] Responsive design works
- [ ] All links functional
- [ ] No console errors

---

## Troubleshooting

### Issue: Colors Not Updating

**Solution:** Clear browser cache and hard refresh
- Chrome/Firefox: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or use incognito/private mode

### Issue: Logo Not Displaying

**Solution:** Check file paths
```bash
# Verify file exists
ls -la public/logo.png

# Check HTML src attribute matches file location
```

### Issue: Gradient Not Working

**Solution:** Add vendor prefixes
```css
.hero-title {
  background: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Fallback for unsupported browsers */
  color: #0066FF;
}
```

### Issue: Mobile Layout Broken

**Solution:** Check responsive CSS
```css
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px; /* Smaller on mobile */
  }
}
```

---

## Performance Optimization

### Optimize Images

```bash
# Use image optimization tools
# For PNG: pngquant, TinyPNG
# For SVG: SVGO

# Example with ImageMagick
convert logo.png -quality 85 logo-optimized.png
```

### Lazy Load Images

```html
<img src="/logo.png" alt="OneArcade" loading="lazy" />
```

### Minify CSS

```bash
# Use CSS minifier
# Online: https://cssminifier.com/
# Or use build tools (webpack, vite, etc.)
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All changes tested locally
- [ ] Responsive design verified
- [ ] Browser compatibility checked
- [ ] Performance optimized
- [ ] Git commits clean and descriptive

### Deployment Steps

```bash
# Commit changes
git add .
git commit -m "Rebrand: Update from APT-Casino to OneArcade"

# Push to repository
git push origin onearcade-rebrand

# Create pull request or merge to main
# Deploy to production
```

---

## Rollback Plan

If issues occur after deployment:

```bash
# Revert to backup
git checkout backup-apt-casino

# Or revert specific commit
git revert <commit-hash>

# Redeploy previous version
```

---

## Additional Resources

### Design Files
- `DESIGN_SPECIFICATIONS.md` - Complete design specs
- `onearcade-styles.css` - Complete CSS stylesheet
- Logo files in `/logos` folder
- Icon files in `/icons` folder

### Color Reference
- Primary Blue: `#0066FF`
- Secondary Blue: `#00A3FF`
- Accent Blue: `#4DA6FF`
- Dark Navy: `#001F3F`
- Light Blue White: `#E6F2FF`

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

---

## Support

For questions or issues during implementation:

1. Review `DESIGN_SPECIFICATIONS.md` for detailed specs
2. Check this guide's troubleshooting section
3. Contact design team for additional support

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 19, 2025 | Initial implementation guide |

---

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Author:** OneArcade Design Team
