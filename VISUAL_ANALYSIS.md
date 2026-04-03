# QuiRamèneQuoi - Visual Analysis Report
**Date:** 2026-04-03  
**URL:** https://quiramenequoi.fr  
**Tool:** Playwright (Browser Automation)

---

## Executive Summary

The QuiRamèneQuoi landing page is a minimalist, modern design with a clean visual hierarchy. The page demonstrates good responsive design principles across all tested viewports. However, there are some accessibility and UX considerations that could be improved.

**Overall Assessment:** Good design with room for improvement in mobile UX and touch target sizing.

---

## 1. Above-the-Fold Analysis

### Desktop View (1920×1080)
- **Primary Heading (H1):** "QuiRamèneQuoi" is visible at the top (30px font)
- **Main CTA:** "Créer une liste" button is prominently centered below the title with good spacing
- **Visual Balance:** Clean, centered layout with ample whitespace
- **Hero Content:** Minimal hero section with just branding and CTA button
- **Scroll Indicator:** "Scroll ↓ Scroll" text prompts user to discover more content below

**Positive Aspects:**
- Primary CTA is immediately visible and accessible
- Large heading establishes app identity quickly
- Ample whitespace creates focus on the CTA
- Dark theme toggle visible in top-right corner

**Issues:**
- Very sparse above-the-fold content - limited value proposition visibility
- No descriptive tagline about the app's purpose in the hero section
- Relies on scrolling to understand what the app does

### Mobile View (375×812)
- **Header:** Logo remains at top with theme toggle visible
- **Primary Heading:** "QuiRamèneQuoi" is visible but slightly smaller due to responsive sizing
- **Main CTA:** "Créer une liste" button is centered and accessible
- **Layout:** Single-column layout properly adapted for mobile
- **Touch Target:** Button appears adequately sized for mobile interaction

**Positive Aspects:**
- Logo and CTA remain visible without scrolling
- Responsive text sizing adapts well to smaller viewport
- No horizontal overflow

**Issues:**
- Very limited information before scroll
- Minimal context about app functionality for new users

### Tablet View (768×1024)
- **Layout:** Still uses centered, single-column design
- **Header:** Logo and theme toggle properly positioned
- **CTA Button:** Well-sized and accessible
- **Spacing:** Appropriate use of whitespace

---

## 2. Mobile Responsiveness Assessment

### Navigation & Layout
- **Responsive Framework:** Next.js App Router with Tailwind CSS
- **Viewport Meta Tag:** Present and correct (`width=device-width, initial-scale=1`)
- **Max-width Container:** `max-w-3xl` constraint maintains readability at all sizes

### Tested Breakpoints
| Viewport | Width | Height | Status | Issues |
|----------|-------|--------|--------|--------|
| Desktop | 1920px | 1080px | ✓ Good | None observed |
| Laptop | 1366px | 768px | ✓ Good | None observed |
| Tablet | 768px | 1024px | ✓ Good | None observed |
| Mobile | 375px | 812px | ⚠️ Acceptable | Touch target sizing concerns |

### Touch Targets
**Finding:** 3 buttons with touch targets below 48×48px recommended size:
1. Theme toggle button (circular icon button)
2. "Créer une liste" button (appears borderline at mobile size)
3. Possible duplicate CTA buttons in scrollable area

**Recommendation:** Increase button padding for mobile (minimum 44×44px for iOS, 48×48px for Android)

### Font Sizes
- **Base Body Font:** Nunito Sans, responsive sizing
- **Heading (H1):** 30px (desktop), scales down appropriately
- **Secondary Heading (H1 in About):** 36px (desktop)
- **Subheadings (H2):** 24px
- **Body Text:** Appears to be 16px+ (meets WCAG minimum)

**Assessment:** Font sizes are accessible and readable on all devices.

---

## 3. Image Quality & Optimization

### Finding: Zero Images Found
The landing page contains **no images** - only text, buttons, and CSS-based styling.

**Pros:**
- Faster page load (no image download overhead)
- No image optimization needed
- Cleaner, more minimal design

**Cons:**
- Limited visual appeal
- Could benefit from icons or illustrations to guide users through features
- The "About" section with numbered steps (1, 2, 3) could use visual enhancement

**Recommendation:** Consider adding:
- Feature icons (SVG or emoji) for the three-step process
- Event category illustrations (party, dining, family)
- Visual indicators for feature benefits

---

## 4. Alt Text Verification

**Result:** No images present on the page, therefore no alt text issues to report.

**Note:** When images are added in the future, ensure:
- All decorative images use `alt=""`
- All informational images have descriptive alt text
- Alt text describes content and function, not just "image"

---

## 5. Color Contrast & Accessibility

### Theme Implementation
- **Theme System:** Dark mode support via next-themes with "class" strategy
- **Light Mode:** White/light gray backgrounds with dark text
- **Dark Mode:** Dark backgrounds (slate-900, slate-950) with light text

### Contrast Analysis

#### Light Mode
- **Background:** `lab(100 0 0)` = Pure white
- **Text Color:** Very dark gray (lab values indicate near-black)
- **Contrast Ratio:** Estimated **18:1+ WCAG AAA compliant**
- **Button (Primary):** Dark background with light text - High contrast

#### Dark Mode
- **Background:** Slate-950 (very dark)
- **Text Color:** Gray-100/Gray-200 (very light)
- **Contrast Ratio:** Estimated **15:1+ WCAG AAA compliant**

### Accessibility Strengths
- Excellent contrast ratios in both themes
- Support for system preference detection
- Smooth theme switching (disableTransitionOnChange)
- Dark mode properly implemented for reducing eye strain

### Accessibility Issues
1. **Touch Target Sizing:** 3 buttons below recommended 48×48px
2. **Semantic HTML:** Generally good (proper heading hierarchy)
3. **ARIA Labels:** Theme toggle lacks aria-label attribute
4. **Focus Indicators:** Buttons have focus-visible styles (good)

---

## 6. Visual Hierarchy Issues

### Strengths
1. **Clear H1 Usage:** Two H1 headings create logical structure
   - Primary H1: App branding (30px)
   - Secondary H1: Value proposition (36px in About section)
2. **Button Prominence:** Primary CTA uses dark background (primary color) with white text
3. **Whitespace:** Generous spacing creates visual breaks and focus
4. **Grid Layout:** About section uses responsive grid (2 columns on desktop, 1 on mobile)
5. **Color Coding:** Numbered steps use blue circles, benefits use green checkmarks

### Issues
1. **Redundant H1 Tags:** Two H1 elements on one page (SEO consideration)
   - First H1: "QuiRamèneQuoi" (branding)
   - Second H1: "QuiRamèneQuoi - L'art de l'organisation partagée" (value prop)
   - **Recommendation:** Change second H1 to H2 in About section

2. **Limited Hero Section:** Only logo and button above the fold
   - No tagline or value proposition visible immediately
   - Users must scroll to understand the app's purpose

3. **Visual Progression:** Content below fold is well-organized but doesn't appear in initial viewport
   - "Comment ça marche ?" (How it works)
   - "Pourquoi QuiRamèneQuoi ?" (Why use it)
   - Feature categories (Parties, Shared meals, Family events)

---

## 7. Responsive Design Implementation

### Framework & Tools
- **Next.js 15** with React 19
- **Tailwind CSS** for responsive styling
- **Custom Fonts:** Nunito, Nunito Sans, Syne from Google Fonts

### Key Responsive Classes
```
- max-w-3xl: Container constraint (all sizes)
- px-4: Responsive padding on mobile
- grid gap-8 md:grid-cols-2: Responsive grid (1 col mobile, 2 col desktop)
- h-[calc(100vh-68px)]: Dynamic height calculations
- flex flex-col items-center justify-center: Flexbox centering
```

### Media Queries Coverage
- **Mobile-First Approach:** Default styles for small screens
- **Responsive Breakpoints:**
  - Default (mobile)
  - `sm:` (640px)
  - `md:` (768px)
  - `lg:` (1024px)
  - `xl:` (1280px)

### Issues Found
1. **Grid Layout Limitation:** `md:grid-cols-2` changes at 768px
   - On 1366×768 laptop, content might feel cramped horizontally
   - Consider adding `lg:grid-cols-2` breakpoint

2. **Theme Toggle Positioning:** Absolute positioning in header
   - Could be better controlled with flexbox spacing
   - Works but less flexible for layout adjustments

3. **Gradient Overlay:** Hardcoded gradient `to-slate-100` and `to-slate-950`
   - Works but doesn't respect custom theme colors
   - Consider using CSS variables

---

## 8. Layout & Visual Issues

### Issues Identified

1. **Hero Section Sparsity**
   - Only logo and CTA visible above fold
   - No introduction to features or benefits
   - Visitors must scroll to understand the app's purpose
   - **Severity:** Medium
   - **Impact:** May increase bounce rate for new visitors

2. **Duplicate CTA Buttons**
   - Multiple "Créer une liste" buttons throughout the page
   - Second button appears in the About section CTA
   - Good for accessibility but could confuse design
   - **Severity:** Low
   - **Impact:** Minor redundancy

3. **Limited Visual Differentiation**
   - About section uses same centered layout as hero
   - Could use more visual distinction
   - **Severity:** Low
   - **Impact:** Page feels somewhat monotonous

4. **Scroll Indicator Placement**
   - "Scroll ↓ Scroll" text at bottom of viewport
   - Good UX signal but generic text
   - Could be more engaging
   - **Severity:** Very Low

5. **Theme Toggle Accessibility**
   - Button lacks aria-label (accessibility issue)
   - Visual indicator clear (sun/moon icon) but not labeled
   - **Severity:** Low
   - **Impact:** Screen reader users get no label

### No Critical Layout Issues
- ✓ No overlapping elements
- ✓ No text overflow or cutoff
- ✓ No horizontal scrolling at any viewport
- ✓ Proper grid and flexbox usage
- ✓ Images load correctly (none present)

---

## 9. Performance Observations

### Positive Indicators
- Minimal CSS (Tailwind compilation)
- No large images or heavy assets
- Simple, clean DOM structure
- Fast load times expected

### Recommendations
- Consider adding a skeleton loader for the About section
- Lazy load below-fold content if page becomes larger
- Monitor Core Web Vitals with Vercel Speed Insights (already integrated)

---

## 10. Design System Assessment

### Typography
- **Font Family Stack:** Nunito/Nunito Sans/Syne
- **Font Weights:** Bold for headings, regular for body
- **Line Height:** Adequate spacing (appears to be 1.5-1.6)
- **Text Rendering:** Smooth with antialiased class

### Color Palette
- **Light Mode:** White backgrounds, dark gray text, blue accents
- **Dark Mode:** Dark slate backgrounds, light gray text
- **Accent Colors:** Blue (primary buttons), Green (checkmarks), Blue numbers (steps)

### Spacing
- **Header:** 16px padding (p-4)
- **Sections:** 48px padding (py-12)
- **Gap:** 32px (gap-8)
- **Consistent:** Uses Tailwind spacing scale

---

## Summary of Visual/UX Issues

### Critical Issues (0)
- None identified

### High Priority Issues (1)
1. **Limited Hero Section Content**
   - Only logo and CTA above fold
   - No value proposition immediately visible
   - Recommendation: Add tagline or feature teaser

### Medium Priority Issues (2)
1. **Duplicate H1 Tags**
   - Two H1 elements on page (SEO concern)
   - Recommendation: Change second H1 to H2

2. **Touch Target Sizing on Mobile**
   - 3 buttons below 48×48px recommended
   - Recommendation: Increase padding for mobile

### Low Priority Issues (2)
1. **Theme Toggle Missing aria-label**
   - Accessibility concern
   - Recommendation: Add aria-label="Toggle dark mode"

2. **Sparse Visual Content**
   - No icons or illustrations
   - Recommendation: Add SVG icons or illustrations

---

## Recommendations

### Immediate Actions
1. Add aria-label to theme toggle button
2. Increase button padding on mobile (min 44-48px)
3. Change second H1 to H2 in About section

### Short-term Improvements
1. Add a compelling tagline to hero section (e.g., "Qui ramène quoi ? Décidez en 30 secondes")
2. Add icons/illustrations for:
   - The 3-step process
   - Feature categories (parties, meals, family events)
3. Enhance visual distinction between sections

### Future Enhancements
1. Add social proof (testimonials, user count)
2. Include animated transitions for better visual feedback
3. Add loading states for async operations
4. Consider adding a FAQ section
5. Test with actual users for usability feedback

---

## Conclusion

**QuiRamèneQuoi's landing page demonstrates excellent technical implementation with clean, responsive design.** The application is:

- ✅ **Fully responsive** across all tested viewports
- ✅ **Accessible** with good color contrast and semantic HTML
- ✅ **Fast loading** with minimal assets
- ✅ **Mobile-friendly** with proper viewport configuration
- ⚠️ **Could benefit** from richer hero section content
- ⚠️ **Minor touch target** sizing improvements needed

The overall design is professional and functional, meeting modern web standards. The suggestions provided would enhance user engagement and accessibility without major design overhauls.

---

## Screenshot References

All screenshots are saved in: `/Users/antoinecalma/Documents/GitHub/bringwhat/screenshots/`

- `desktop.png` - 1920×1080 viewport
- `laptop.png` - 1366×768 viewport
- `tablet.png` - 768×1024 viewport
- `mobile.png` - 375×812 viewport
