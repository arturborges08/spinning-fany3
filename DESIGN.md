---
name: HEB Academy
description: Marca-texto. A book being marked up as you scroll, on ink black with page-white sheets and one highlighter yellow.
colors:
  ink: "#0b0b0c"
  ink-raised: "#151517"
  ink-control: "#202024"
  paper: "#f4f4f0"
  paper-shade: "#e8e8e1"
  page-edge: "#efede6"
  mute-on-ink: "#a4a4aa"
  mute-on-paper: "#55555c"
  mark: "#e6ff2e"
  flag-focus: "#3ddc84"
  flag-pressure: "#ff7a45"
  flag-price: "#ffb800"
  flag-negotiation: "#4b82ff"
  flag-faith: "#d4a373"
typography:
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 4.2vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  statement:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 0.8rem + 4.3vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 100"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 2vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  list-line:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 106"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
    fontVariation: "'wdth' 106"
  button:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
rounded:
  flag: "2px 2px 2px 0"
  cover: "6px 12px 12px 6px"
  focus: "8px"
  sheet: "32px"
  sheet-compact: "24px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 3vw, 48px)"
  chip-gap: "8px"
  control-gap: "12px"
  stack: "24px"
  section-block: "clamp(80px, 10vw, 140px)"
  section-open: "clamp(120px, 16vw, 220px)"
components:
  button-primary:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "54px"
  button-ghost-hover:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
  button-small:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  flag-chip:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 12px"
    height: "44px"
  flag-chip-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  tab:
    backgroundColor: "{colors.paper-shade}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 12px"
    height: "44px"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  store-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 16px"
    height: "44px"
  store-link-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.mark}"
  carousel-arrow:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "52px"
  paper-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "clamp(72px, 10vw, 140px) clamp(20px, 3vw, 48px)"
---

# Design System: HEB Academy

## Overview

**Creative North Star: "Marca-texto"**

The site is a book being marked up as you read it. An ink-black desk holds page-white sheets, and one fluorescent highlighter yellow marks the lines that apply to the reader's life today. The yellow never decorates. It marks a phrase, forms the three strokes of the logo, and fills the one action you're meant to take. The five books each get a page-flag color, sampled from their real covers, and those colors only show up as flags.

The whole page uses one variable family, Archivo, and leans on its width axis: headings are stretched wide and set heavy with tight tracking, while running text stays at normal width. Every control is a pill, every highlight has chisel-cut ends like a real marker tip, and the only illustration is the highlight stroke itself, plus a hand-drawn margin arrow next to the cover carousel. Depth comes from studio light on ink, soft ambient shadows, and a Three.js book that turns with the scroll in space reserved for it, never behind text.

Motion follows the markup metaphor. Highlights sweep across words, either scrubbed by scroll or played once on arrival. Headings rise out of a mask, short paragraphs come into focus from a blur, the paper sheet grows to fill the screen, and buttons fill with a sweep from the left. The page stays fully readable with motion reduced or WebGL off.

**Key Characteristics:**
- Ink ground, paper sheets, one highlighter yellow used only to mark.
- One flag color per book, used only as tabs.
- One family (Archivo variable, self-hosted). Headings stretched to 112% width at weight 800, text at 100%.
- Pill controls throughout. Highlight strokes have chisel-cut ends.
- The 3D book gets its own reserved space and never sits under text.

## Colors

A near-neutral ink and paper pair with one acid highlighter and five saturated page-flag colors kept to small areas.

### Primary
- **Highlighter Yellow** (`mark`): the marker. It appears as the highlight stroke behind key phrases, the three chisel bars of the logo, the primary pill's fill, the ghost pill's hover fill, nav-link hover strokes, the text-selection color, the focus ring (at 70% opacity), store-link hover text, and the rim light on the 3D book.

### Secondary
Page flags, one per book, sampled from the covers:
- **Flag Green** (`flag-focus`): *Alquimia do Sucesso*, focus and ADHD.
- **Flag Tangerine** (`flag-pressure`): *Mente Inabalável*, mind under pressure.
- **Flag Amber** (`flag-price`): *Negócios Incomparáveis*, selling without cutting price.
- **Flag Blue** (`flag-negotiation`): *Negociando com Tubarões*, negotiation.
- **Flag Kraft** (`flag-faith`): *Raízes Profundas*, faith and purpose.

### Neutral
- **Ink** (`ink`): the page ground, text on yellow and paper, the selected tab, and the carousel arrow buttons.
- **Raised Ink** (`ink-raised`): translucent fill for floating flag chips and the floating nav bar (86-88% mixed with transparent, plus a backdrop blur).
- **Control Ink** (`ink-control`): the mobile menu toggle and the scrollbar thumb.
- **Page White** (`paper`): text on ink and the book sheet's surface.
- **Page Shade** (`paper-shade`): resting fill for tabs on the paper sheet.
- **Page Edge** (`page-edge`): page-block material of the 3D book only.
- **Margin Grey** (`mute-on-ink`): secondary text, nav links at rest, and footer links on ink.
- **Pencil Grey** (`mute-on-paper`): secondary text and purchase labels on the paper sheet.

### Named Rules
**The Highlighter Only Marks Rule.** Yellow is a marker stroke, a logo bar, an action fill, or a state (selection, focus, hover). Never use it as a section background, a border, a decorative swatch, or body text on ink.

**The One Flag Per Book Rule.** Each flag color belongs to one book and appears only as a small tab: the notch on a chip or tab (10x16px), the takeaway list marker (14x22px), or the paper flags on the 3D book. Flag colors are never text, never a large fill, and never mixed into the yellow's job.

**The Two Grounds Rule.** There are two surfaces: the ink page and the page-white sheet. Content changes surface by moving onto a sheet, never by adding a third tinted panel.

## Typography

**Display Font:** Archivo variable, self-hosted (weight 100-900, width 62-125%), falling back to Helvetica Neue, then Arial.
**Body Font:** Archivo, same file.

**Character:** a single grotesque doing two jobs through its width axis. Stretched and heavy, it reads like a headline in a business book. At normal width it reads like the page text.

### Hierarchy
- **Brand display**: the hero headline is the HEB logo itself, an SVG drawn at up to 1560px wide (94vw). It is not set in type.
- **Headline** (800, `headline`, 0.98 line height, 112% width): section titles, balanced, about 13-14ch max.
- **Statement** (800, `statement`, 1.04 line height, 100% width): the scroll-highlighted manifesto lines. It runs at normal width so the highlight sweep reads as marking text, not a logo.
- **Title** (800, `title`, 112% width): book names in the detail panel. The mobile menu uses the same size.
- **List line** (700, `list-line`, 1.16 line height, 106% width): takeaway lines, max 26ch.
- **Lead** (500, `lead`, 1.3 to 1.48 line height): the hero promise, book subtitles, the author's role and story, the footer slogan (600, 112% width there).
- **Body** (400, `body`, 1.55 line height): paragraphs, 46ch max beside the manifesto and 34-36rem max in columns.
- **Label** (550-600, `label`): nav links, chips, tabs, store links, purchase labels, legal text. Sentence case, never uppercase.

### Named Rules
**The Stretch Means Voice Rule.** The width axis carries the hierarchy. Headings, buttons, the footer slogan and the brand word in the nav run at 106-112% width. Running text stays at 100%. Don't use a second family.

**The No-Caps Rule.** Every label and control is in sentence case at normal tracking. The build has no tracked uppercase small text, and none should be added.

## Layout

Sections run full-bleed on ink with a fluid gutter (`gutter`, at least the safe-area inset). On desktop, layouts are two-column splits: books head 1.25fr/1fr, book detail 1fr/1fr, author 6fr/5fr, finale 1fr/1fr. Text always sits in one column and the space for the 3D book or stack in the other. The hero is a full-viewport field: the logo centered at about 45% from the top, the book turning in front of it, five flag chips placed absolutely around it, the promise and actions bottom-left (max 500px / 36vw), and a scroll cue bottom-right. The manifesto pins for 230vh (210vh on mobile) while its lines are highlighted.

The books section is the one paper sheet. It runs nearly full-width (8-16px inset) and grows from 93% scale and a 56px radius to full size and a 32px radius as it enters. Vertical rhythm is generous and fluid: sections open with `section-open` or `section-block` padding. Inside a column, gaps are 22-24px for text stacks, 12px between actions, and 8px between chips.

Breakpoints: at 1080px, detail and author collapse to one column. At 760px, or 1100px in portrait, phone layout takes over: the nav becomes logo plus toggle with a full-screen ink menu, and the hero becomes a vertical flow (logo, book space, wrapped chips, promise, full-width actions). Tabs become a horizontal scroller that snaps and bleeds to the edges, the carousel arrows move below the covers, and the sheet radius drops to 24px. Below 700px of height on phones, manifesto type is capped at 5.6svh.

**The Clear Book Rule.** The 3D book only renders into reserved anchor boxes (the hero book space, the manifesto book slot on mobile, the finale stack space). Text and controls sit above it in z-order but never over it, and no solid panel is ever placed behind or in front of it. Without WebGL, a static image fills the same space.

## Elevation & Depth

Depth comes from light and soft ambient shadow, not from stacked panels. The hero has a radial studio glow behind the book. The 3D scene lights the black book with a white key light, a yellow rim light that separates it from the black ground, a cool secondary rim, and a paper-to-ink hemisphere fill. Floating UI (the nav once scrolled, the flag chips) uses translucent raised ink with a backdrop blur, a 1px inner hairline, and a long, soft, negative-spread shadow. On the paper sheet, covers cast a deep soft drop shadow that grows on the active cover.

### Shadow Vocabulary
- **Floating bar** (`0 18px 40px -20px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.06)`): the nav once it floats.
- **Floating chip** (`inset 0 0 0 1px rgba(255,255,255,.08), 0 10px 30px -14px rgba(0,0,0,.8)`): hero flag chips.
- **Action lift** (`0 14px 28px -14px rgba(0,0,0,.65)`): primary pill on hover.
- **Cover rest** (`0 30px 50px -24px rgba(11,11,12,.55), 0 2px 6px rgba(11,11,12,.12)`) and **cover active** (`0 46px 70px -28px rgba(11,11,12,.6), 0 2px 6px rgba(11,11,12,.14)`): carousel covers.
- **Hairline** (`inset 0 1px 0 rgba(255,255,255,.1)`): takeaway row dividers and the footer top edge. On ink, rules are drawn as inset shadows rather than borders.

### Named Rules
**The Soft Light Rule.** Shadows are blurred, offset downward, and spread negatively so they read as ambient light. No hard offset shadows, no glows in yellow.

## Shapes

Three families of shape. Pills (`pill`) for every interactive control: buttons, chips, tabs, store links, nav links, the menu toggle, carousel arrows, the skip link. Large soft rectangles for content containers: the paper sheet and the author portrait (`sheet`, `sheet-compact` on phones). Book objects: covers with a tight spine side and a softer fore-edge (`cover`), and flag notches with a square bottom-left corner (`flag`), like a paper tab peeking from a page.

**The Chisel Rule.** Highlight strokes have slanted ends, like a chisel-tip marker. That's a 104deg gradient with 0.22em transparent ends for inline highlights, and a parallelogram clip with 0.18em offsets for the manifesto sweep. The three logo bars use the same slant. Never use a highlight with rounded or straight ends.

**The Logo.** An H, three chisel-ended highlighter bars standing in for the E (the middle bar shorter), and a B. The H and B take the current text color. The bars are always Highlighter Yellow. The logo is inline SVG (viewBox 2761x704), so it can be animated. On entry the H and B rise in and the bars draw from left to right.

## Components

### Buttons
Confident pills that fill with a sweep when touched.
- **Shape:** full pill (`pill`), 54px tall, 44px for the small size in the nav.
- **Primary:** yellow fill, ink text, label stretched to 112% width, optional 20px arrow icon. On hover or focus, a page-white fill sweeps from left to right (scaleX, 0.6s), the arrow moves 4px, and the action-lift shadow appears. Press scales to 0.97. On fine pointers, primary pills marked as magnetic follow the cursor (22% horizontal, 35% vertical, 0.6s ease-out).
- **Ghost:** transparent, page-white text, 1.5px inset ring at 28% white. On hover, a yellow fill sweeps in and the text turns ink.
- **Store link:** a small pill on paper with a 1.5px ink ring at 18%. On hover, an ink fill rises from below, the text turns yellow, and the out-arrow nudges up and to the right.
- **Carousel arrow:** a 52px ink circle with a paper chevron. Hover scales to 1.08.

### Chips (flag chips and tabs)
- **Style:** pill, 44px tall (40px on phones). A flag notch in the book's color sits before the label. On ink (hero), chips use translucent raised ink with a blur. On paper (tabs), they use Page Shade.
- **State:** hero chips lift 3px and turn page-white on hover, and the notch stretches 1.25x taller. The selected tab inverts to ink with paper text, and its notch stretches the same way. In the hero, the chips drift gently up and down while idle.

### Cards / Containers
- **Paper sheet:** one per page, `sheet` radius, Page White, generous fluid padding, no shadow. It grows into place on scroll.
- **Author portrait:** 4:5, `sheet` radius. It is revealed by a clip that opens from the bottom while the image goes from 1.2 scale and grayscale to normal.

### Navigation
- **Style:** logo plus "Academy" in label type, three links, and a small yellow "Comprar" pill. At rest the bar is transparent and full-width. Once scrolled, it shrinks to a 720px floating pill of raised ink with a blur.
- **Link hover:** a yellow highlight stroke (40% of the line height) draws under the word from left to right, and the text turns ink.
- **Mobile:** a 48px round toggle that morphs into an X, and a full-screen ink menu with links in title type (112% width, weight 800), staggered in.

### Highlight (signature)
The house ornament. Inline highlights sweep in when they load or scroll into view (1.1s, expo in-out) and wrap cleanly across line breaks. In the manifesto, the sweep is scrubbed to scroll: unread lines sit dimmed at 46% white, and as the stroke passes, the ink-colored text is revealed in sync. With reduced motion or no JS, every highlight shows fully lit.

### Cover Carousel (signature)
A circular coverflow. The active cover is centered, neighbors sit at ±30deg rotateY, receding in depth and dimmed by brightness. Covers that wrap around behind switch sides without crossing the screen. On desktop three covers show and the left margin holds a hand-written margin note with a drawn arrow, which hides if it would overlap a cover. The carousel supports drag, arrows, and tabs, and all of them stay in sync with the detail panel. The detail copy refocuses from a 6px blur when it changes.

## Do's and Don'ts

### Do:
- **Do** mark only the phrase the reader should keep, using a chisel-ended yellow highlight behind ink text.
- **Do** keep every control a pill (`pill`) at least 44px tall.
- **Do** carry each book's flag color wherever that book is chosen: chip, tab, and the 3D book's flags.
- **Do** set headings at weight 800 and 112% width with tight tracking, and leave running text at 100% width.
- **Do** reserve an anchor box for any 3D object and keep text out of it. Provide a static image for the no-WebGL case.
- **Do** use expo-out easing (`cubic-bezier(.16,1,.3,1)`) for entrances and fills, and show every highlight fully lit under reduced motion.

### Don't:
- **Don't** use Highlighter Yellow as a background field, border, or decorative swatch. It marks, fills an action, or signals a state.
- **Don't** use a flag color as text or as a fill larger than a tab.
- **Don't** introduce a third surface color or tinted panels. Content lives on ink or on the paper sheet.
- **Don't** add a second typeface or a system display face. Archivo's width axis is the hierarchy.
- **Don't** add tracked uppercase labels or small eyebrow text above headings. Headings stand alone.
- **Don't** use hard offset shadows or yellow glows. Shadows are soft, ambient, and negatively spread.
- **Don't** place text, chips, or solid panels over the 3D book.
