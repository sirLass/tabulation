---
name: Crown & Glory
colors:
  surface: '#fff8f3'
  surface-dim: '#e1d9d0'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2e9'
  surface-container: '#f5ede4'
  surface-container-high: '#efe7de'
  surface-container-highest: '#e9e1d8'
  on-surface: '#1e1b16'
  on-surface-variant: '#4e4639'
  inverse-surface: '#34302a'
  inverse-on-surface: '#f8efe6'
  outline: '#7f7667'
  outline-variant: '#d1c5b4'
  surface-tint: '#775a19'
  primary: '#775a19'
  on-primary: '#ffffff'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#e9c176'
  secondary: '#68558b'
  on-secondary: '#ffffff'
  secondary-container: '#d5bffd'
  on-secondary-container: '#5d4b80'
  tertiary: '#5e5e5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#a6a5a2'
  on-tertiary-container: '#3b3b39'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d2bcfa'
  on-secondary-fixed: '#231043'
  on-secondary-fixed-variant: '#4f3d72'
  tertiary-fixed: '#e4e2de'
  tertiary-fixed-dim: '#c8c6c3'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#fff8f3'
  on-background: '#1e1b16'
  surface-variant: '#e9e1d8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 120px
---

## Brand & Style

This design system embodies the prestige, heritage, and high-stakes elegance of international pageantry. It is designed for elite audiences who value tradition paired with modern excellence. The brand personality is authoritative yet celebratory, evoking an emotional response of aspiration and "the winning moment."

The design style is **Luxury Editorial**, blending elements of minimalism with high-contrast drama. It utilizes expansive whitespace to allow content to breathe, punctuated by sharp, ornate details that signal exclusivity. Subtle glowing gradients and shimmering transitions provide a digital "spotlight" effect, ensuring the UI feels alive and prestigious.

## Colors

The palette is anchored in a regal hierarchy:
- **Rich Gold (#C5A059):** Used exclusively for primary actions, success states, and critical brand accents. It represents the crown and the achievement.
- **Deep Royal Purple (#2D1B4E):** Provides the foundation for depth. Used for footers, immersive backgrounds, and high-contrast text to evoke mystery and luxury.
- **Shimmering Cream (#FDFBF7):** The primary surface color. It is warmer and more sophisticated than pure white, providing a gallery-like backdrop for photography.
- **Accent Shimmer (#E8D1A7):** A lighter gold used for gradients and hover states to create a "metallic reflection" effect.

## Typography

The typography system relies on the interplay between the "Grand Dame" (Playfair Display) and the "Modern Professional" (Montserrat). 

**Headlines** should use generous tracking only in lowercase; for a more authoritative look, use tight tracking in large display sizes. **Body text** prioritize legibility with increased line heights to maintain the "airy" luxury feel. **Labels and Metadata** are always set in uppercase Montserrat with wide letter spacing to mimic high-end fashion mastheads.

## Layout & Spacing

This design system utilizes a **Fixed Grid** on desktop and a **Fluid Grid** on mobile. The spacing philosophy is "Luxurious Expansion"—never crowd the content.

- **Desktop:** A 12-column grid with wide 32px gutters. Large vertical gaps (120px+) between sections create a rhythmic, editorial flow.
- **Mobile:** A 4-column grid with 24px side margins.
- **Alignment:** Centralized alignment is preferred for splash screens and landing sections, while asymmetrical layouts are used for galleries to create visual interest.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Shimmer** rather than heavy shadows.

1.  **Surfaces:** Use the Shimmering Cream as the base. Higher elevation levels are indicated by a subtle inner glow (Soft Gold) or a paper-thin 1px border in #E8D1A7.
2.  **Shadows:** When necessary, use "Ambient Gold" shadows—extremely diffused (30px+ blur), low opacity (10%), tinted with the primary gold color to make elements appear as if they are floating above a lit stage.
3.  **Glassmorphism:** Use for overlays and navigation bars. A backdrop-blur (12px) combined with a 20% opacity Cream fill creates a "frosted crystal" effect.

## Shapes

To maintain a "Professional & Prestigious" vibe, the design system utilizes **Sharp (0px)** corners for almost all structural elements. This conveys architectural strength and precision.

- **Containers & Cards:** Strict 90-degree angles.
- **Buttons:** Sharp rectangles, creating a "monolithic" and confident look.
- **Exceptions:** Photography may occasionally use a "softened" edge (4px) if the subject matter is organic, but all UI framing remains sharp.

## Components

### Buttons
Primary buttons are solid Gold (#C5A059) with white or Cream text. Secondary buttons are "Ghost" style with a 1px Gold border and high-letter-spaced uppercase text. On hover, buttons should exhibit a subtle "sheen" gradient transition.

### Cards
Cards use the Cream background with a 1px border in a slightly darker cream or gold. Headers within cards should use Playfair Display Medium. There is no drop shadow; depth is created by a 1px Gold bottom-border accent.

### Inputs
Text fields are minimal: a single bottom border (1px) in Deep Purple or Gold. Labels sit above the line in Montserrat Caps. Focus states animate the bottom border to a 2px thickness with a subtle golden outer glow.

### Chips & Tags
Used for categories like "Winner" or "Finalist." These are always rectangular, using a Deep Purple background with Gold text to signify high status.

### Progress Indicators
Step indicators for application forms or scoring should be thin, elegant lines. Completed steps are marked by a small "diamond" shape in Gold, rather than a standard circle.