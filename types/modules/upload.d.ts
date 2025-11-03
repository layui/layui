/**
 * Upload - File upload component
 */

declare namespace Upload {
  interface UploadOptions {
    elem: string | HTMLElement;
    url: string;
    data?: Record<string, any>;
    headers?: Record<string, string>;
    accept?: 'images' | 'file' | 'video' | 'audio';
    acceptMime?: string;
    exts?: string;
    auto?: boolean;
    bindAction?: string | HTMLElement;
    field?: string;
    size?: number;
    multiple?: boolean;
    number?: number;
    drag?: boolean;
    before?: (obj: any) => void | boolean;
    done?: (res: any, index: number, upload: any) => void;
    error?: (index: number, upload: any) => void;
    choose?: (obj: any) => void;
  }

  interface UploadStatic {
    render(options: UploadOptions): any;
  }
}
