import { cache } from '@emotion/css';
import { gridClass, toNestable } from './gridClass';

const emittedRules = () =>
  (cache.sheet.tags as HTMLStyleElement[]).flatMap((tag) =>
    Array.from(tag.sheet?.cssRules ?? [], (rule) => rule.cssText)
  );

const selectorsOf = (rule: string) =>
  rule
    .slice(0, rule.indexOf('{'))
    .split(',')
    .map((selector) => selector.trim());

describe('gridClass', () => {
  it('scopes every grid rule to descendants of the panel wrapper', () => {
    const styleRules = emittedRules().filter((rule) => !rule.startsWith('@'));
    const selectors = styleRules.flatMap(selectorsOf);

    expect(selectors.length).toBeGreaterThan(100);
    expect(selectors.filter((selector) => !selector.startsWith(`.${gridClass} `))).toEqual([]);
  });

  it('keeps the filter popup styles reachable', () => {
    expect(emittedRules().some((rule) => rule.includes(`.${gridClass} :where(.gp-grid-filter-popup)`))).toBe(true);
  });

  it('only rewrites selectors, never declarations', () => {
    expect(toNestable(':where(.a){color:red}.b,:where(.c){top:0}')).toBe(
      '& :where(.a){color:red}.b,& :where(.c){top:0}'
    );
  });
});
