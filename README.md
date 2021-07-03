# River Marketing Website

Acceptance environment: https://carbonfive.github.io/river-marketing/

## Maintenance Notes

- There are a handful of inline `onclick` handlers tacked straight on the HTML.
- The line drawing SVG animation has been pretty expensive on my machine and hoses the "typing" effect. Take care about when the line drawing is retriggered.
- If the animation is slow, try reducing the number of SVGs in the scribble.
- Sorry about the JS. It's clearly a mutant in desperate need of refactoring.
