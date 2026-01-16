# Design System Guide - Swarm Feedback

**iOS-Inspired Glassmorphic Design**

---

## Quick Reference

### Color Palette

```css
/* Primary Accent Colors */
--accent-blue: #007aff; /* iOS Blue - Primary actions */
--accent-purple: #af52de; /* iOS Purple - Secondary actions */
--accent-pink: #ff2d55; /* iOS Pink - Highlights */
--accent-green: #34c759; /* iOS Green - Success states */

/* Background Gradients */
--bg-gradient-start: #0a0e27;
--bg-gradient-mid: #1a1f3a;
--bg-gradient-end: #0f1419;

/* Glassmorphic Effects */
--glass-white: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-shadow: rgba(0, 0, 0, 0.1);
```

---

## Component Styling Guide

### 1. Glassmorphic Cards

#### Standard Card

```jsx
<Card className="p-6">{/* Content */}</Card>
```

**CSS Properties:**

- Background: `rgba(255, 255, 255, 0.05)`
- Backdrop Filter: `blur(20px) saturate(180%)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Border Radius: `24px`
- Box Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.2)`

#### Strong Glass Card

```css
.glass-strong {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 2. Interactive Elements

#### Hover Lift Effect

```css
.hover-lift {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
}
```

#### Gradient Backgrounds

```css
/* Blue Gradient */
.bg-gradient-blue {
  background: linear-gradient(
    135deg,
    rgba(0, 122, 255, 0.3) 0%,
    rgba(0, 122, 255, 0.2) 100%
  );
}

/* Purple Gradient */
.bg-gradient-purple {
  background: linear-gradient(
    135deg,
    rgba(175, 82, 222, 0.3) 0%,
    rgba(175, 82, 222, 0.2) 100%
  );
}
```

### 3. Typography

#### Headings

```jsx
<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
  Gradient Title
</h1>
```

#### Body Text

```jsx
<p className="text-gray-400 text-sm font-medium">
  Body text with proper contrast
</p>
```

### 4. Form Inputs

#### Glassmorphic Input

```jsx
<input
  className="w-full px-4 py-3 glass rounded-2xl text-white 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             focus:border-transparent transition-all placeholder-gray-500"
  placeholder="Enter text..."
/>
```

### 5. Buttons

#### Primary Button

```jsx
<button
  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 
                   text-white font-medium hover-lift shadow-lg"
>
  Click Me
</button>
```

#### Outline Button

```jsx
<button
  className="px-6 py-3 rounded-2xl glass border-2 border-blue-500/50 
                   text-blue-300 font-medium hover-lift"
>
  Secondary Action
</button>
```

---

## Animation Guidelines

### 1. Fade In Up

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Shimmer Effect

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### 3. Transition Timing

- **Fast**: 150ms - Small UI changes
- **Normal**: 300ms - Most interactions
- **Slow**: 600ms - Page transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## Spacing System

```css
/* Consistent spacing scale */
gap-2  → 8px
gap-3  → 12px
gap-4  → 16px
gap-6  → 24px
gap-8  → 32px

/* Padding scale */
p-4  → 16px
p-5  → 20px
p-6  → 24px
p-8  → 32px
```

---

## Icon Guidelines

### Sizes

- **Small**: 16px - Inline with text
- **Medium**: 20-24px - Standard UI
- **Large**: 28-32px - Feature highlights
- **XL**: 48-64px - Hero sections

### Colors

```jsx
// Blue accent
<Icon size={24} className="text-blue-300" />

// Purple accent
<Icon size={24} className="text-purple-300" />

// Gradient (use inline style)
<Icon size={24} style={{
  background: 'linear-gradient(135deg, #007AFF, #AF52DE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}} />
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Grid Layouts

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
  border-radius: 8px;
}
```

### Color Contrast

- Text on dark background: Use gray-300 or lighter
- Text on light glass: Use gray-700 or darker
- Minimum contrast ratio: 4.5:1 (WCAG AA)

### Keyboard Navigation

- All interactive elements must be focusable
- Tab order should be logical
- Focus indicators must be visible

---

## Best Practices

### DO ✅

- Use glassmorphic cards for content containers
- Apply hover-lift to interactive elements
- Use gradient text for important headings
- Maintain consistent spacing
- Use semantic HTML
- Test on multiple browsers
- Ensure proper contrast ratios

### DON'T ❌

- Overuse animations (keep it subtle)
- Use pure white backgrounds (breaks glass effect)
- Mix different border radius values
- Ignore mobile responsiveness
- Skip focus states
- Use too many colors in one view

---

## Code Examples

### Example 1: Stat Card

```jsx
<Card className="p-6 group">
  <div className="flex items-center gap-4">
    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 backdrop-blur-sm">
      <Icon size={28} className="text-blue-300" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">Total Projects</p>
      <p className="text-3xl font-bold text-white mt-1">42</p>
    </div>
  </div>
</Card>
```

### Example 2: Activity Item

```jsx
<Card className="p-5 flex items-center justify-between group cursor-pointer">
  <div className="flex items-center gap-4">
    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg" />
    <div>
      <p className="text-white font-medium">Activity Title</p>
      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
    </div>
  </div>
</Card>
```

### Example 3: Profile Avatar

```jsx
<div className="relative w-36 h-36 rounded-full mb-4 group">
  {/* Glow effect */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />

  {/* Avatar container */}
  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
  </div>
</div>
```

---

## Performance Tips

1. **Use CSS transforms** for animations (GPU accelerated)
2. **Limit backdrop-filter usage** on large elements
3. **Optimize images** before using as backgrounds
4. **Use will-change** sparingly for critical animations
5. **Debounce hover effects** on lists with many items

---

## Browser Support

### Full Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Fallbacks

```css
/* Backdrop filter fallback */
@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: rgba(255, 255, 255, 0.15);
  }
}
```

---

**Last Updated:** January 16, 2026  
**Version:** 2.0
