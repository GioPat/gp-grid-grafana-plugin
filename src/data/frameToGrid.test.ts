import { createDataFrame, createTheme, FieldType } from '@grafana/data';
import { frameToGrid } from './frameToGrid';

const frame = createDataFrame({
  fields: [
    { name: 'time', type: FieldType.time, values: [0, 60000] },
    { name: 'value', type: FieldType.number, values: [1.5, 2], config: { unit: 'percent' } },
    { name: 'value', type: FieldType.string, values: ['a', 'b'] },
    { name: 'meta', type: FieldType.other, values: [{ a: 1 }, null], config: { custom: { hidden: true } } },
    { name: 'epoch', type: FieldType.number, values: [0, 1], config: { unit: 'dateTimeAsIso' } },
    { name: 'id', type: FieldType.string, values: ['x', 'y'], config: { custom: { width: 80, pinned: 'start' } } },
  ],
});

const grid = frameToGrid(frame, { theme: createTheme(), timeZone: 'utc', filterable: true });

describe('frameToGrid', () => {
  it('maps fields to uniquely keyed, typed columns', () => {
    expect(grid.columns.map((c) => [c.field, c.headerName, c.cellDataType])).toEqual([
      ['f0', 'time', 'dateTime'],
      ['f1', 'value 1', 'number'],
      ['f2', 'value 2', 'text'],
      ['f3', 'meta', 'text'],
      ['f4', 'epoch', 'dateTime'],
      ['f5', 'id', 'text'],
    ]);
  });

  it('reads values from the frame without copying rows', () => {
    expect(grid.dataSource.access.rowCount).toBe(2);
    expect(grid.dataSource.access.getValue(1, 'f2')).toBe('b');
  });

  it('exposes date-typed fields as Date objects', () => {
    expect(grid.dataSource.access.getValue(1, 'f0')).toEqual(new Date(60000));
    expect(grid.dataSource.access.getValue(1, 'f4')).toEqual(new Date(1));
  });

  it('formats cells with the field display processor', () => {
    expect(grid.columns[1].valueFormatter?.(1.5)).toBe('1.50%');
    expect(grid.columns[0].valueFormatter?.(new Date(60000))).toBe('1970-01-01 00:01:00');
  });

  it('serializes object values instead of printing [object Object]', () => {
    expect(grid.columns[3].valueFormatter?.({ a: 1 })).toBe('{"a":1}');
  });

  it('applies the custom field config', () => {
    expect(grid.columns[3].hidden).toBe(true);
    expect(grid.columns[5]).toMatchObject({ width: 80, pinned: 'start' });
    expect(grid.columns[0]).toMatchObject({ width: 150, pinned: undefined });
  });
});
