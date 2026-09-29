# José María Castro: portfolio and local web development

## Intent and preservation
The page `/desarrollo-web-alcobendas` is part of the portfolio, not a new brand.
Audience: local businesses, independent professionals and small companies.
Goal: explain the service clearly and make a direct enquiry easy.
Preserve existing URLs, metadata, ES/EN content, logo and architectural images.

## Visual system
- Canvas: charcoal `#101416`; text: warm white `#eeeae3`.
- Accent: steel blue `#397dab`; accessible filled controls: `#285d80`.
- Secondary text: `#b9c1c5`; focus: `#8fc8f1`.
- Manrope, self-hosted: 800/700 display, 400 body. No new font family.
- Tight display tracking (-.055em), 1.02 line-height; body 1.6.
- Sharp geometry, at most 2px corners. No decorative card stacks.
- Depth comes from the existing stone artwork, not generic gradients or shadows.
- Spacing: 8px base, 24/32/48/64/96px rhythm, fluid 5vw outer gutters.
- Layer order: artwork 0, contrast scrim 1, content 2, navigation 3.

## Four scenes
1. Hero: two-line statement, concise copy, primary enquiry action, stone sculpture.
2. Solutions: architectural visual left, three open typographic service rows right.
3. Process and FAQ: calm two-column information scene, native accessible accordions.
4. Contact: clear left-hand invitation, labelled form right, separate footer.

## Motion and responsive
Design variance 6, motion 5, density 4. Reuse existing GSAP in the portfolio.
Landing uses staggered entry on intersection and subtle image scale: only opacity
and transforms, no custom wheel hijacking. Reduced motion shows everything instantly.
On mobile use a single-column reading order and natural section height; never shrink
form text to force a viewport fit. Touch targets at least 44px. Images never stretch.

## Skill decisions
design-taste (v2 + v1), frontend-design and redesign-existing-projects inform
the preservation audit, hierarchy and non-generic structure. high-end-visual-design,
minimalist-ui and gpt-taste inform spacing and purposeful, staggered motion.
brandkit supplies consistency checks rather than a replacement identity.
design-md's BMW M reference informed full-bleed imagery and square controls;
its proprietary font, tricolour and uppercase voice are NOT imported.
imagegen-frontend-web and image-to-code produced four separate preview references.
The original portfolio remains authoritative where those previews differ.
web-design-guidelines informs focus, labels, native controls and reduced motion.
Industrial-brutalist and Stitch-specific generation are reviewed but not applied:
their terminal ornamentation / separate generator would not fit this request.
Native mobile-app image generation is not applicable to this responsive website.

## Verification and publication
Check 1920x1080, 1440x951, 1366x768, 768x1024, 390x844, 360x740 and zoom.
Check English, keyboard navigation, long form input, errors and reduced motion.
No push or deployment until the user reviews the local result.
