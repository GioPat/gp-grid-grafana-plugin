import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { GridFieldConfig, GridOptions } from './types';
import { GridPanel } from './components/GridPanel';
import { DEFAULT_COLUMN_WIDTH } from './data/frameToGrid';

export const plugin = new PanelPlugin<GridOptions, GridFieldConfig>(GridPanel)
  .useFieldConfig({
    // The grid renders plain formatted text, so color-driven options would have no effect.
    disableStandardOptions: [
      FieldConfigProperty.Color,
      FieldConfigProperty.Thresholds,
      FieldConfigProperty.Links,
      FieldConfigProperty.Min,
      FieldConfigProperty.Max,
      FieldConfigProperty.FieldMinMax,
    ],
    useCustomConfig: (builder) =>
      builder
        .addNumberInput({
          path: 'width',
          name: 'Column width',
          defaultValue: DEFAULT_COLUMN_WIDTH,
          settings: { min: 20, integer: true },
        })
        .addRadio({
          path: 'pinned',
          name: 'Pin column',
          defaultValue: 'none',
          settings: {
            options: [
              { value: 'none', label: 'None' },
              { value: 'start', label: 'Start' },
              { value: 'end', label: 'End' },
            ],
          },
        })
        .addBooleanSwitch({
          path: 'hidden',
          name: 'Hide column',
          defaultValue: false,
        }),
  })
  .setPanelOptions((builder) =>
    builder
      .addNumberInput({
        path: 'frameIndex',
        name: 'Frame index',
        description: 'Which query result (data frame) to show when the panel receives several',
        defaultValue: 0,
        settings: { min: 0, integer: true },
      })
      .addNumberInput({
        path: 'rowHeight',
        name: 'Row height',
        defaultValue: 32,
        settings: { min: 20, integer: true },
      })
      .addBooleanSwitch({
        path: 'sortable',
        name: 'Column sorting',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'filterable',
        name: 'Column filters',
        defaultValue: true,
      })
  );
