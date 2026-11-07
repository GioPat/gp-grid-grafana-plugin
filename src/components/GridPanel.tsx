import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { Grid } from '@gp-grid/react';
import '@gp-grid/react/dist/styles.css';
import { GridOptions } from 'types';
import { frameToGrid } from 'data/frameToGrid';

interface Props extends PanelProps<GridOptions> {}

export const GridPanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id, timeZone }) => {
  const theme = useTheme2();
  const frame = data.series[Math.min(options.frameIndex, data.series.length - 1)];
  const grid = useMemo(
    () => frame && frameToGrid(frame, { theme, timeZone, filterable: options.filterable }),
    [frame, theme, timeZone, options.filterable]
  );

  if (!grid || grid.columns.every((column) => column.hidden)) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} />;
  }

  return (
    <div data-testid="gp-grid-panel" style={{ width, height }}>
      <Grid
        columns={grid.columns}
        dataSource={grid.dataSource}
        rowHeight={options.rowHeight}
        sortingEnabled={options.sortable}
        darkMode={theme.isDark}
      />
    </div>
  );
};
