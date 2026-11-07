export interface GridOptions {
  frameIndex: number;
  rowHeight: number;
  filterable: boolean;
  sortable: boolean;
}

export type PinSide = 'none' | 'start' | 'end';

export interface GridFieldConfig {
  width?: number;
  hidden?: boolean;
  pinned?: PinSide;
}
