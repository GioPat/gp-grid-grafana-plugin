import { css } from '@emotion/css';
import { gridStyles } from '@gp-grid/react';

// Emotion attaches a nested selector that starts with a pseudo-class to the parent itself
// (`.css-x:where(.a)`), so gp-grid's `:where(...)` rules need an explicit descendant combinator.
const LEADING_PSEUDO = /(^|[{},])(\s*):where\(/g;

export const toNestable = (stylesheet: string) => stylesheet.replace(LEADING_PSEUDO, '$1$2& :where(');

// Grafana forbids global CSS imports; nesting the stylesheet under a class scopes it to the panel.
export const gridClass = css(toNestable(gridStyles));
