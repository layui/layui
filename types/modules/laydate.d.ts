/**
 * Laydate - Date and time picker
 */

declare namespace Laydate {
  interface LaydateOptions {
    elem: string | HTMLElement;
    type?: 'year' | 'month' | 'date' | 'time' | 'datetime';
    range?: boolean | string;
    format?: string;
    value?: string | Date;
    isInitValue?: boolean;
    min?: string | number;
    max?: string | number;
    trigger?: 'click' | 'focus';
    show?: boolean;
    position?: 'absolute' | 'fixed' | 'static';
    zIndex?: number;
    showBottom?: boolean;
    btns?: string[];
    lang?: 'cn' | 'en';
    theme?: string;
    calendar?: boolean;
    mark?: Record<string, string>;
    ready?: (date: string) => void;
    change?: (value: string, date: string, endDate?: string) => void;
    done?: (value: string, date: string, endDate?: string) => void;
  }

  interface LaydateStatic {
    render(options: LaydateOptions): any;
    getEndDate(month: number, year?: number): number;
  }
}
