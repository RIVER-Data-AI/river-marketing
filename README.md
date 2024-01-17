# River Marketing Website

This is a simple marketing website for forthcoming product called RIVER.

It's currently hosted via Github pages at https://river-data-ai.github.io/river-marketing/

## Getting Started

##### Install Dependencies
`bundle`
##### Run Dev Server
`scripts/run-dev`
##### Visit http://localhost:4000

## Technical Overview

- [Jekyll](https://jekyllrb.com)
- SASS via Jekyll assets config
- JS is very oldschool; no compilation, just `<script>` tags in order

## Maintenance Notes

- There are a handful of inline `onclick` handlers tacked straight on the HTML.
- The line drawing SVG animation has been pretty expensive on my machine and hoses the "typing" effect. Take care about when the line drawing is retriggered.
- If the animation is slow, try reducing the number of SVGs in the scribble.
- Sorry about the JS. It's clearly a mutant in desperate need of refactoring.
