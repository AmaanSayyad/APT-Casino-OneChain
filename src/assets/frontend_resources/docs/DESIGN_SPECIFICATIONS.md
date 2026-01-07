# OneArcade Design Specifications

## Project Overview

This document provides complete design specifications for the **OneArcade** brand redesign. OneArcade is a next-generation decentralized gaming and entertainment platform built on One Chain Network.

**Previous Brand:** APT-Casino  
**New Brand:** OneArcade  
**Design Theme:** Tech-focused blockchain aesthetic (replacing casino entertainment style)  
**Primary Color:** Blue (#0066FF) - replacing purple/pink

---

## Brand Identity

### Brand Name
**OneArcade**

### Brand Positioning
Next-generation decentralized gaming and entertainment platform built on One Chain Network. Experience transparent, fair, and secure on-chain gaming where you truly own your assets.

### Design Philosophy
1. **Tech-Focused** - Blue color scheme reflects blockchain and technology attributes
2. **Professional** - Modern design avoiding overly entertainment-focused casino aesthetics
3. **Brand Consistency** - Visual unity with One Chain Network's blue spiral logo
4. **Trustworthy** - Blue represents trust, security, and professionalism

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Primary Blue | `#0066FF` | rgb(0, 102, 255) | Buttons, Logo, Main Titles |
| Secondary Blue | `#00A3FF` | rgb(0, 163, 255) | Links, Secondary Buttons, Accents |
| Accent Blue | `#4DA6FF` | rgb(77, 166, 255) | Hover Effects, Highlights, Tags |
| Dark Navy | `#001F3F` | rgb(0, 31, 63) | Dark Backgrounds, Text |
| Light Blue White | `#E6F2FF` | rgb(230, 242, 255) | Light Backgrounds, Cards |

### Gradients

| Gradient Name | CSS Value | Usage |
|---------------|-----------|-------|
| Primary Gradient | `linear-gradient(90deg, #0066FF 0%, #00A3FF 100%)` | Buttons, Titles |
| Secondary Gradient | `linear-gradient(135deg, #0066FF 0%, #00A3FF 100%)` | Cards, Backgrounds |
| Dark Gradient | `linear-gradient(180deg, #001F3F 0%, #0066FF 100%)` | Hero Section, Dark Areas |

### Text Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Text | `#FFFFFF` | Main text on dark backgrounds |
| Secondary Text | `#E0E0E0` | Subtitles, descriptions |
| Muted Text | `#A0A0A0` | Labels, metadata |
| Dark Text | `#001F3F` | Text on light backgrounds |

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero Title | 64px | Bold (700) | 1.2 |
| Section Title | 48px | Bold (700) | 1.3 |
| Card Title | 24px | Bold (700) | 1.4 |
| Body Text | 16px | Regular (400) | 1.6 |
| Small Text | 14px | Regular (400) | 1.5 |
| Button Text | 16px | Semi-Bold (600) | 1 |

### Responsive Font Sizes

| Breakpoint | Hero Title | Section Title |
|------------|------------|---------------|
| Desktop (>1024px) | 64px | 48px |
| Tablet (768-1024px) | 48px | 40px |
| Mobile (<768px) | 36px | 32px |
| Small Mobile (<480px) | 28px | 28px |

---

## Logo Specifications

### Logo Variations

1. **Horizontal Logo** - Primary version for navigation and headers
   - File: `onearcade-logo-horizontal.svg` / `.png`
   - Dimensions: 300×60px (scalable)
   - Usage: Navigation bar, page headers

2. **Icon Only** - For favicons and app icons
   - File: `onearcade-icon.svg` / `.png`
   - Dimensions: 512×512px (scalable)
   - Usage: Favicon, app icon, social media profile

3. **White Logo** - For dark backgrounds
   - File: `onearcade-logo-white.svg`
   - Usage: Footer, dark sections

### Logo Design Elements

**Icon:**
- Blue spiral pattern inspired by OneChain logo
- Circular shape with dynamic swirl
- Color: #0066FF (Primary Blue)
- White spiral layers with varying opacity

**Text:**
- "One" in blue (#0066FF)
- "Arcade" in white (#FFFFFF)
- Bold, modern sans-serif font
- Horizontal alignment with icon

### Minimum Sizes

| Version | Minimum Width | Minimum Height |
|---------|---------------|----------------|
| Horizontal Logo | 150px | 30px |
| Icon Only | 32px | 32px |

### Clear Space
Maintain clear space around logo equal to the height of the icon on all sides.

---

## Component Specifications

### Buttons

#### Primary Button
```css
Background: linear-gradient(90deg, #0066FF 0%, #00A3FF 100%)
Color: #FFFFFF
Border: none
Border Radius: 24px
Padding: 12px 32px
Font Size: 16px
Font Weight: 600
Box Shadow: 0 4px 12px rgba(0, 102, 255, 0.3)
```

**Hover State:**
```css
Box Shadow: 0 0 30px rgba(0, 163, 255, 0.6)
Transform: translateY(-2px)
```

#### Secondary Button
```css
Background: transparent
Color: #FFFFFF
Border: 2px solid #00A3FF
Border Radius: 24px
Padding: 12px 32px
Font Size: 16px
Font Weight: 600
```

**Hover State:**
```css
Background: #0066FF
Border Color: #0066FF
Box Shadow: 0 0 20px rgba(0, 163, 255, 0.3)
```

### Cards

#### Feature Card
```css
Background: rgba(0, 31, 63, 0.6)
Border: 2px solid #0066FF
Border Radius: 16px
Padding: 32px
Backdrop Filter: blur(10px)
```

**Hover State:**
```css
Background: rgba(0, 31, 63, 0.8)
Box Shadow: 0 0 20px rgba(0, 163, 255, 0.3)
Transform: translateY(-4px)
```

#### Game Card
```css
Background: rgba(0, 31, 63, 0.6)
Border: 2px solid transparent
Border Image: linear-gradient(135deg, #0066FF, #00A3FF) 1
Border Radius: 16px
Box Shadow: 0 0 20px rgba(0, 102, 255, 0.3)
```

**Hover State:**
```css
Transform: translateY(-8px)
Box Shadow: 0 0 30px rgba(0, 163, 255, 0.6)
```

### Tags/Badges

```css
Background: #0066FF (POPULAR)
Background: #00A3FF (HOT)
Background: #4DA6FF (FEATURED)
Color: #FFFFFF
Padding: 4px 12px
Border Radius: 9999px (full)
Font Size: 12px
Font Weight: bold
Text Transform: uppercase
```

---

## Layout Specifications

### Navigation Bar

**Height:** 80px  
**Background:** #1A1A1A  
**Border Bottom:** 1px solid rgba(0, 102, 255, 0.2)  
**Padding:** 16px 32px  
**Position:** Sticky top

**Elements:**
- Logo (left): 40px height
- Menu items (center): 16px font, 500 weight
- Action buttons (right): Primary + Secondary buttons

### Hero Section

**Padding:** 48px 32px  
**Background:** linear-gradient(180deg, #001F3F 0%, #0066FF 100%)  
**Text Align:** Center

**Elements:**
- Title: 64px, bold, blue gradient text
- Subtitle: 20px, #E0E0E0
- Buttons: Primary + Secondary, 24px gap
- Stats bar: 4 items, 32px values, 14px labels

### Content Sections

**Max Width:** 1400px  
**Padding:** 48px 32px  
**Margin:** 0 auto

### Footer

**Background:** #1A1A1A  
**Border Top:** 1px solid rgba(0, 102, 255, 0.2)  
**Padding:** 48px 32px

**Layout:**
- 4 columns: Brand (2fr) + 3 navigation columns (1fr each)
- Logo: 40px height
- Social icons: 40×40px circles
- Copyright bar: 14px font, #A0A0A0

---

## Spacing System

| Size | Value | Usage |
|------|-------|-------|
| XS | 8px | Tight spacing, small gaps |
| SM | 16px | Default spacing between elements |
| MD | 24px | Section spacing |
| LG | 32px | Large gaps, card padding |
| XL | 48px | Section padding |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 8px | Tags, small elements |
| Medium | 16px | Cards, containers |
| Large | 24px | Buttons, large cards |
| Full | 9999px | Pills, circular badges |

---

## Shadows

| Name | CSS Value | Usage |
|------|-----------|-------|
| Blue Shadow | `0 0 20px rgba(0, 163, 255, 0.3)` | Cards, hover effects |
| Blue Shadow Hover | `0 0 30px rgba(0, 163, 255, 0.6)` | Hover states |
| Button Shadow | `0 4px 12px rgba(0, 102, 255, 0.3)` | Primary buttons |

---

## Animations & Transitions

### Transition Speeds

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 0.2s | Hover effects, color changes |
| Normal | 0.3s | Button states, card transforms |
| Slow | 0.5s | Large animations, page transitions |

### Common Animations

**Pulse Animation** (Hero background):
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
```

**Hover Lift:**
```css
transform: translateY(-4px)
```

---

## Responsive Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| Desktop | >1024px | Desktop computers |
| Tablet | 768-1024px | Tablets, small laptops |
| Mobile | 480-768px | Mobile phones (landscape) |
| Small Mobile | <480px | Mobile phones (portrait) |

---

## Content Updates

### Text Replacements

**Global Search & Replace:**
- Find: `APT-Casino` or `APT Casino`
- Replace: `OneArcade`

**Specific Locations:**

1. **Navigation Bar**
   - Logo text: APT-Casino → OneArcade

2. **Page Title**
   - Current: `<title>APT Casino</title>`
   - New: `<title>OneArcade - One Chain Gaming Platform</title>`

3. **Hero Section**
   - All brand mentions → OneArcade

4. **Key Features Section**
   - Title: "Key Features of APT-Casino" → "Key Features of OneArcade"

5. **How It Works Section**
   - Title: "How APT Casino Works" → "How OneArcade Works"

6. **Footer**
   - Logo text: APT-Casino → OneArcade
   - Copyright: "© 2025 APT-Casino" → "© 2025 OneArcade"
   - Description: Update to new brand description (see below)

### New Footer Description

```
OneArcade is the next-generation decentralized gaming and entertainment 
platform built on One Chain Network. Experience transparent, fair, and 
secure on-chain gaming where you truly own your assets.
```

### ⚠️ Important: Keep Unchanged

**DO NOT change any mentions of "One Chain Network"**

Examples to keep:
- "Powered by One Chain Network" ✓
- "OCT tokens of One Chain Network" ✓
- "One Chain Network Blockchain" ✓

---

## Icon Library

### Available Icons

| Icon Name | File | Usage |
|-----------|------|-------|
| Wallet | `icon-wallet.png` | Connect wallet feature |
| Tokens | `icon-tokens.png` | Token/currency references |
| Gamepad | `icon-gamepad.png` | Gaming features |
| Trophy | `icon-trophy.png` | Rewards, achievements |
| Dice | `icon-dice.png` | Provably fair gaming |
| Chain | `icon-chain.png` | Cross-chain features |
| Unlock | `icon-unlock.png` | No restrictions feature |

**Icon Specifications:**
- Size: 64×64px
- Color: #00A3FF (Secondary Blue)
- Format: PNG with transparent background
- Style: Minimalist line art

---

## Implementation Checklist

### Visual Updates
- [ ] Replace all logos with OneArcade blue logo
- [ ] Update color scheme from purple/pink to blue
- [ ] Update all buttons to blue gradient or blue border
- [ ] Update game card tags to blue colors
- [ ] Update links and hover effects to blue

### Text Updates
- [ ] Update navigation bar brand name
- [ ] Update page title (HTML `<title>` tag)
- [ ] Update hero section text
- [ ] Update footer logo and copyright
- [ ] Update footer description
- [ ] Verify all "One Chain Network" mentions remain unchanged

### Technical Updates
- [ ] Replace favicon
- [ ] Update Open Graph image
- [ ] Update CSS color variables
- [ ] Replace image files
- [ ] Test responsive design
- [ ] Test dark/light mode adaptation

---

## File Structure

```
frontend_resources/
├── logos/
│   ├── onearcade-logo-horizontal.svg
│   ├── onearcade-logo-horizontal.png
│   ├── onearcade-icon.svg
│   ├── onearcade-icon-512.png
│   └── onearcade-logo-white.svg
├── icons/
│   ├── icon-wallet.png
│   ├── icon-tokens.png
│   ├── icon-gamepad.png
│   ├── icon-trophy.png
│   ├── icon-dice.png
│   ├── icon-chain.png
│   └── icon-unlock.png
├── css/
│   └── onearcade-styles.css
└── docs/
    ├── DESIGN_SPECIFICATIONS.md (this file)
    └── IMPLEMENTATION_GUIDE.md
```

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

---

## Accessibility

- Maintain WCAG 2.1 AA contrast ratios
- All interactive elements keyboard accessible
- Proper ARIA labels for screen readers
- Focus indicators visible on all interactive elements

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 19, 2025 | Initial design specifications for OneArcade rebrand |

---

## Contact & Support

For questions or additional design support, please contact the design team.

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Design Team:** OneArcade Design Team
