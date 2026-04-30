# Journal

Shared project notes for `react-demos`.

## Current status

- The app currently has six demo pages: `memoization`, `effects`, `lazy-loading`, `css-foundations`, `accessibility-semantics`, and `forms`.
- The old `state-demo` page and route were removed.
- The `effects` page is framed around a core rule: use effects for synchronization, not ordinary app logic.
- The `lazy-loading` page is framed around a core rule: defer optional code, offscreen media, and oversized lists, not the essential first screen.
- The `css-foundations` page is framed around a core rule: use relative units for behavior and semantic variables for design decisions.
- The `accessibility-semantics` page is framed around a core rule: start with semantic HTML and let ARIA fill real gaps instead of replacing native meaning.
- The `forms` page is framed around a core rule: choose controlled state, validation timing, and submit flow based on the UX the form actually needs.

## Recent changes

- Added a reuse pass across the teaching pages:
  - extracted a shared `LessonHero` component for the repeated mental-model hero pattern
  - extracted a shared `GuidanceGrid` for the three-question intro sections
  - extracted a shared `RuleCallout` for the repeated rule-of-thumb blocks
  - extracted a shared `DemoSectionHeader` for repeated example-section intros with notes and stat chips
  - extracted a shared `ComparisonCardHeader` for repeated comparison-card labels/titles/aside chips
  - consolidated the matching hero CSS into shared lesson-hero styles with per-page tone modifiers
- Updated the app shell to better match the demos:
  - route pages now lazy load
  - nav links preload page code on hover/focus intent
  - the shell now includes a skip link, stronger nav semantics, and clearer sidebar structure
  - shared styles now use more root-level tokens and explicit focus-visible treatment
  - follow-up shell cleanup fixed the sidebar nav card layout after removing link descriptions
- Added `/effects` with demos for:
  - derived state vs render-time derivation
  - stale async closures
  - request cleanup and race prevention
  - dependency churn from the wrong effect boundary
- Added test coverage for the effects route.
- Polished the visual presentation of `/effects` with a stronger top-level mental model section and clearer bad-vs-better comparison treatment.
- Added `/lazy-loading` with demos for:
  - lazy loading an optional panel on demand
  - Suspense boundary placement
  - browser-level image lazy loading
  - list virtualization
  - preloading code on hover or focus intent
- Added test coverage for the lazy-loading route.
- Added `/css-foundations` with demos for:
  - choosing a sizing philosophy before choosing units
  - `px` vs `em` box behavior
  - what browser zoom and root font-size changes actually affect
  - CSS variables as reusable tokens
  - theme tokens and swapping themes
  - consuming semantic tokens in component CSS
  - token overrides through the cascade
  - responsive spacing through shared tokens
- Added test coverage for the css foundations route.
- Reframed the CSS page to take a clearer stance: `px` is a valid default for box metrics, `rem` is a system choice, and `em` is a narrow local tool.
- Added `/accessibility-semantics` with demos for:
  - landmarks and heading structure
  - native controls vs patched generic containers
  - link-looking actions implemented as buttons
  - accessible form labeling, grouping, and error association
  - lists and articles as real content structure
- Added test coverage for the accessibility semantics route.
- Added `/forms` with demos for:
  - controlled vs uncontrolled data flow
  - live derived feedback for controlled forms
  - validation timing tradeoffs
  - pending, success, and error submit states
- Added test coverage for the forms route.

## Next ideas

- Decide what the next teaching page should be after `memoization` and `effects`.
- Consider demos for:
  - form state
  - async data patterns
  - URL state
  - transitions and deferred updates

## Decisions

- Keep demo pages focused on teaching mental models first, with API details serving that goal.
- Use visual contrast on comparison-heavy pages so the wrong pattern and the better pattern are readable at a glance.

## Open questions

- Should each demo page stay focused on one React concept, or should some pages compare related concepts directly?
- Do we want this repo to emphasize teaching mental models, API mechanics, or both?

## Notes

- Use this file to track progress, ideas, rough plans, and decisions between sessions.
