# Design System

## Color Palette

### Warm Espresso + Sage Green

The design uses a warm, earthy palette with espresso browns and sage green accents.

#### Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#1a1612` | Main page background |
| `--color-bg-secondary` | `#231f1a` | Alternate sections |
| `--color-bg-card` | `#2a2520` | Card surfaces |
| `--color-bg-elevated` | `#342e28` | Elevated elements (modals, dropdowns) |
| `--color-bg-input` | `#1e1a16` | Form input backgrounds |

#### Brand Accents

| Token | Value | Usage |
|---|---|---|
| `--color-accent-sage` | `#8fae7e` | Primary accent — links, buttons, highlights |
| `--color-accent-gold` | `#c4a882` | Secondary accent — hover states, gradients |
| `--color-accent-glow` | `rgba(143, 174, 126, 0.15)` | Subtle glow effects |
| `--color-accent-glow-strong` | `rgba(143, 174, 126, 0.3)` | Stronger glow effects |

#### Text

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#f5f0eb` | Headings, primary text |
| `--color-text-secondary` | `#b5a99a` | Body text |
| `--color-text-muted` | `#6b5f54` | Captions, labels |
| `--color-text-inverse` | `#1a1612` | Text on light backgrounds |
| `--color-text-accent` | `#8fae7e` | Accent text |

#### Status

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#7eb87e` | Success states |
| `--color-warning` | `#d4a853` | Warning states |
| `--color-error` | `#c46b5e` | Error states |
| `--color-pending` | `#d4b85a` | Pending states |
| `--color-info` | `#8fae7e` | Info states |

#### Printer Brand

| Token | Value | Usage |
|---|---|---|
| `--color-bambu-orange` | `#d4845a` | Bambu Lab references |

---

## Typography

### Font Families

| Token | Font | Usage |
|---|---|---|
| `--font-display` | Cormorant Garamond, Georgia, serif | Headings (h1–h5) |
| `--font-body` | Outfit, system-ui, sans-serif | Body text, paragraphs |
| `--font-label` | JetBrains Mono, Fira Code, monospace | Labels, code, specs, prices |

### Font Size Scale (Fluid)

Sizes smoothly interpolate between 375px and 1280px viewports using `clamp()`.

| Token | Value |
|---|---|
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.875rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `clamp(1.0625rem, 1.035rem + 0.11vw, 1.125rem)` |
| `--text-xl` | `clamp(1.125rem, 1.07rem + 0.22vw, 1.25rem)` |
| `--text-2xl` | `clamp(1.25rem, 1.145rem + 0.44vw, 1.5rem)` |
| `--text-3xl` | `clamp(1.5rem, 1.29rem + 0.88vw, 2rem)` |
| `--text-4xl` | `clamp(1.875rem, 1.615rem + 1.1vw, 2.5rem)` |
| `--text-5xl` | `clamp(2.25rem, 1.73rem + 2.21vw, 3.5rem)` |
| `--text-6xl` | `clamp(2.75rem, 2.025rem + 3.09vw, 4.5rem)` |

### Line Heights

| Token | Value |
|---|---|
| `--leading-none` | `1` |
| `--leading-tight` | `1.1` |
| `--leading-snug` | `1.25` |
| `--leading-normal` | `1.5` |
| `--leading-relaxed` | `1.65` |
| `--leading-loose` | `1.8` |

### Letter Spacing

| Token | Value |
|---|---|
| `--tracking-tighter` | `-0.03em` |
| `--tracking-tight` | `-0.02em` |
| `--tracking-snug` | `-0.01em` |
| `--tracking-normal` | `0` |
| `--tracking-wide` | `0.04em` |
| `--tracking-wider` | `0.08em` |
| `--tracking-widest` | `0.12em` |

### Font Weights

| Token | Value |
|---|---|
| `--weight-light` | `300` |
| `--weight-regular` | `400` |
| `--weight-medium` | `500` |
| `--weight-semibold` | `600` |
| `--weight-bold` | `700` |

---

## Spacing Scale

| Token | Value |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `32px` |
| `--space-xl` | `64px` |
| `--space-2xl` | `128px` |

---

## Border Radius

| Token | Value |
|---|---|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-2xl` | `24px` |
| `--radius-full` | `9999px` |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 4px 32px rgba(10, 8, 6, 0.6)` | Card elevation |
| `--shadow-glow` | `0 0 40px rgba(143, 174, 126, 0.15)` | Sage glow effect |
| `--shadow-glow-sm` | `0 0 16px rgba(143, 174, 126, 0.12)` | Small glow |
| `--shadow-glow-lg` | `0 0 60px rgba(143, 174, 126, 0.2)` | Large glow |
| `--shadow-elevated` | `0 8px 48px rgba(10, 8, 6, 0.7)` | Modals, overlays |
| `--shadow-inset` | `inset 0 1px 2px rgba(10, 8, 6, 0.4)` | Input fields |
| `--shadow-warm` | `0 4px 24px rgba(196, 168, 130, 0.08)` | Warm subtle shadow |

---

## Transitions

### Easing Functions

| Token | Value | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default exit transitions |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Bidirectional transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy spring effects |

### Durations

| Token | Value |
|---|---|
| `--duration-fast` | `150ms` |
| `--duration-normal` | `250ms` |
| `--duration-slow` | `400ms` |
| `--duration-slower` | `600ms` |

---

## Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-base` | `0` | Default stacking |
| `--z-elevated` | `10` | Raised elements |
| `--z-dropdown` | `100` | Dropdown menus |
| `--z-sticky` | `200` | Sticky headers |
| `--z-overlay` | `300` | Overlays |
| `--z-modal` | `400` | Modal dialogs |
| `--z-toast` | `500` | Toast notifications |

---

## Component Patterns

### Cards

```css
/* Standard card */
.card {
  background: var(--color-bg-card);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

/* Glass card (frosted effect) */
.glass-card {
  background: rgba(42, 37, 32, 0.6);
  backdrop-filter: blur(16px);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
}
```

### Badges

```html
<span class="badge badge--sage">Active</span>
<span class="badge badge--gold">Premium</span>
<span class="badge badge--success">Delivered</span>
<span class="badge badge--warning">Pending</span>
<span class="badge badge--error">Cancelled</span>
```

### Text Utilities

```html
<h1 class="text-gradient-sage">Gradient heading</h1>
<span class="text-mono">Monospace text</span>
<span class="text-price">₹1,299</span>
<span class="text-spec">256³mm</span>
<span class="text-overline">SECTION LABEL</span>
```

### Glow Effects

```css
/* Glow border on hover */
.glow-border::after {
  background: linear-gradient(135deg, var(--color-accent-sage), var(--color-accent-gold));
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}
.glow-border:hover::after { opacity: 0.3; }

/* Glowing dot indicator */
.glow-dot {
  background: var(--color-accent-sage);
  box-shadow: 0 0 8px var(--color-accent-sage), 0 0 20px rgba(143, 174, 126, 0.3);
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| Mobile | `< 768px` | Single column, stacked layouts |
| Tablet | `768px – 1024px` | Two-column grids |
| Desktop | `> 1024px` | Full layout |
| Max width | `1280px` | Container max-width |
| Narrow | `960px` | Content-focused pages |

### Container

```css
.container {
  max-width: var(--container-max); /* 1280px */
  padding: 0 var(--container-padding); /* 32px, 16px on mobile */
}

.container--narrow {
  max-width: var(--container-narrow); /* 960px */
}
```

### Mobile Adjustments

On screens `< 768px`:
- Container padding reduces from `32px` to `16px`
- Section padding reduces from `128px` to `64px`
- Font sizes use their minimum `clamp()` values

---

## Borders

| Token | Value |
|---|---|
| `--border-subtle` | `1px solid rgba(143, 174, 126, 0.1)` |
| `--border-glow` | `1px solid rgba(143, 174, 126, 0.4)` |
| `--border-strong` | `1px solid rgba(143, 174, 126, 0.6)` |
| `--border-muted` | `1px solid rgba(245, 240, 235, 0.06)` |
| `--border-warm` | `1px solid rgba(196, 168, 130, 0.15)` |

---

## Scrollbar

Custom scrollbar styling for WebKit and Firefox:

- Track: `--color-bg-primary`
- Thumb: `--color-bg-elevated` with thin styling
- Hover: Sage glow tint
