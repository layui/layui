/**
 * Table - Data table component
 */

declare namespace Table {
  interface TableOptions {
    elem: string | HTMLElement;
    cols: Array<Array<ColumnOptions>>;
    url?: string;
    data?: any[];
    page?: boolean | PageOptions;
    limit?: number;
    limits?: number[];
    loading?: boolean;
    title?: string;
    text?: {
      none?: string;
    };
    autoSort?: boolean;
    initSort?: {
      field: string;
      type: 'asc' | 'desc';
    };
    id?: string;
    skin?: string;
    size?: string;
    even?: boolean;
    done?: (res: any, curr: number, count: number) => void;
  }

  interface ColumnOptions {
    field?: string;
    title?: string;
    width?: number | string;
    minWidth?: number;
    type?: 'checkbox' | 'radio' | 'numbers' | 'space';
    fixed?: 'left' | 'right';
    hide?: boolean;
    totalRow?: boolean;
    totalRowText?: string;
    sort?: boolean;
    unresize?: boolean;
    edit?: string;
    event?: string;
    style?: string;
    align?: 'left' | 'center' | 'right';
    colspan?: number;
    rowspan?: number;
    templet?: string | ((d: any) => string);
    toolbar?: string;
  }

  interface PageOptions {
    layout?: string[];
    groups?: number;
    first?: boolean;
    last?: boolean;
    prev?: string;
    next?: string;
    limits?: number[];
    limit?: number;
    curr?: number;
    count?: number;
    jump?: (obj: any, first: boolean) => void;
  }

  interface TableStatic {
    render(options: TableOptions): any;
    reload(id: string, options?: Partial<TableOptions>, deep?: boolean): void;
    on(event: string, callback: (obj: any) => void): void;
    checkStatus(id: string): {
      data: any[];
      isAll: boolean;
    };
    exportFile(id: string, data?: any[], type?: string): void;
  }
}
