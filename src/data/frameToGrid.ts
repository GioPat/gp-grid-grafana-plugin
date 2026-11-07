import {
  DataFrame,
  Field,
  FieldType,
  formattedValueToString,
  getDisplayProcessor,
  getFieldDisplayName,
  GrafanaTheme2,
} from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import { GridFieldConfig } from 'types';
import {
  CellDataType,
  CellValue,
  ColumnarDataSource,
  ColumnarField,
  ColumnDefinition,
  createColumnarDataSource,
} from '@gp-grid/react';

export interface FrameGrid {
  columns: ColumnDefinition[];
  dataSource: ColumnarDataSource;
}

interface FormatContext {
  theme: GrafanaTheme2;
  timeZone: TimeZone;
  filterable: boolean;
}

export const DEFAULT_COLUMN_WIDTH = 150;

const CELL_TYPES: Partial<Record<FieldType, CellDataType>> = {
  [FieldType.number]: 'number',
  [FieldType.boolean]: 'boolean',
};

// Grafana date units (dateTimeAsLocal, time:YYYY-MM-DD, ...) render epoch-ms numbers as dates.
const isDateUnit = (unit?: string) => Boolean(unit?.startsWith('dateTime') || unit?.startsWith('time:'));

const isDateTimeField = (field: Field) => field.type === FieldType.time || isDateUnit(field.config.unit);

const cellTypeOf = (field: Field): CellDataType => {
  if (isDateTimeField(field)) {
    return 'dateTime';
  }
  return CELL_TYPES[field.type] ?? 'text';
};

// Field names are not unique in a frame, so the grid keys columns by position.
const fieldKey = (index: number) => `f${index}`;

const formatterOf = (field: Field, ctx: FormatContext) => {
  const display = field.display ?? getDisplayProcessor({ field, theme: ctx.theme, timeZone: ctx.timeZone });
  return (value: CellValue) => {
    if (value instanceof Date) {
      return formattedValueToString(display(value.getTime()));
    }
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value);
    }
    return formattedValueToString(display(value));
  };
};

const toColumn = (field: Field, index: number, frame: DataFrame, ctx: FormatContext): ColumnDefinition => {
  const custom: GridFieldConfig = field.config.custom ?? {};
  const pinned = custom.pinned === 'none' ? undefined : custom.pinned;
  return {
    field: fieldKey(index),
    headerName: getFieldDisplayName(field, frame),
    cellDataType: cellTypeOf(field),
    width: custom.width ?? DEFAULT_COLUMN_WIDTH,
    hidden: custom.hidden,
    pinned,
    filterable: ctx.filterable,
    valueFormatter: formatterOf(field, ctx),
  };
};

const toDate = (value: unknown): CellValue => (typeof value === 'number' ? new Date(value) : (value as CellValue));

// gp-grid date filters only accept Date objects; an accessor converts per read so the column is never copied.
const toColumnarField = (field: Field, index: number): ColumnarField => {
  if (isDateTimeField(field)) {
    return { field: fieldKey(index), getValue: (row) => toDate(field.values[row]) };
  }
  return { field: fieldKey(index), data: field.values };
};

export const frameToGrid = (frame: DataFrame, ctx: FormatContext): FrameGrid => ({
  columns: frame.fields.map((field, index) => toColumn(field, index, frame, ctx)),
  dataSource: createColumnarDataSource({
    rowCount: frame.length,
    fields: frame.fields.map(toColumnarField),
  }),
});
