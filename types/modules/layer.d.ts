/**
 * Layer - Dialog/Modal component
 */

declare namespace Layer {
  interface LayerOptions {
    /** Dialog type: 0=info, 1=page, 2=iframe, 3=loading, 4=tips */
    type?: 0 | 1 | 2 | 3 | 4;
    /** Dialog title */
    title?: string | boolean | string[];
    /** Dialog content */
    content?: string | HTMLElement | any;
    /** Dialog area [width, height] */
    area?: string | string[];
    /** Dialog offset */
    offset?: string | string[];
    /** Icon: 0-6 or custom */
    icon?: number | string;
    /** Button array */
    btn?: string | string[];
    /** Button callbacks */
    yes?: (index: number, layero: any) => void | boolean;
    btn2?: (index: number, layero: any) => void | boolean;
    btn3?: (index: number, layero: any) => void | boolean;
    /** Close button */
    closeBtn?: 0 | 1 | 2 | false;
    /** Shade layer */
    shade?: number | [number, string] | false;
    /** Click shade to close */
    shadeClose?: boolean;
    /** Auto close time (ms) */
    time?: number;
    /** Z-index */
    zIndex?: number;
    /** Max width */
    maxWidth?: number;
    /** Max height */
    maxHeight?: number;
    /** Fixed position */
    fixed?: boolean;
    /** Resize */
    resize?: boolean;
    /** Resizing callback */
    resizing?: (layero: any) => void;
    /** Scrollbar */
    scrollbar?: boolean;
    /** Max/min button */
    maxmin?: boolean;
    /** Move */
    move?: boolean | string;
    /** Move out */
    moveOut?: boolean;
    /** Move end callback */
    moveEnd?: (layero: any) => void;
    /** Tips direction: 1=top, 2=right, 3=bottom, 4=left */
    tips?: 1 | 2 | 3 | 4 | number[];
    /** Tips more */
    tipsMore?: boolean;
    /** Success callback */
    success?: (layero: any, index: number) => void;
    /** Cancel callback */
    cancel?: (index: number, layero: any) => void | boolean;
    /** End callback */
    end?: () => void;
    /** Full callback */
    full?: (layero: any) => void;
    /** Min callback */
    min?: (layero: any) => void;
    /** Restore callback */
    restore?: (layero: any) => void;
  }

  interface PromptOptions extends LayerOptions {
    /** Form type: 0=text, 1=password, 2=textarea */
    formType?: 0 | 1 | 2;
    /** Default value */
    value?: string;
    /** Max length */
    maxlength?: number;
  }

  interface TabOptions {
    /** Tab data */
    tab: Array<{
      title: string;
      content: string;
    }>;
  }

  interface PhotosOptions {
    /** Photos data */
    photos: {
      title?: string;
      id?: number;
      start?: number;
      data: Array<{
        alt: string;
        pid: number;
        src: string;
        thumb: string;
      }>;
    };
    /** Shade close */
    shadeClose?: boolean;
  }

  interface LayerStatic {
    /**
     * Open a dialog
     */
    open(options: LayerOptions): number;

    /**
     * Alert dialog
     */
    alert(content: string, options?: LayerOptions, yes?: (index: number) => void): number;
    alert(content: string, yes?: (index: number) => void): number;

    /**
     * Confirm dialog
     */
    confirm(content: string, options?: LayerOptions, yes?: (index: number) => void, cancel?: (index: number) => void): number;
    confirm(content: string, yes?: (index: number) => void, cancel?: (index: number) => void): number;

    /**
     * Message dialog
     */
    msg(content: string, options?: LayerOptions, end?: () => void): number;
    msg(content: string, end?: () => void): number;

    /**
     * Loading dialog
     */
    load(icon?: 0 | 1 | 2, options?: LayerOptions): number;

    /**
     * Tips dialog
     */
    tips(content: string, follow: string | HTMLElement | any, options?: LayerOptions): number;

    /**
     * Close dialog
     */
    close(index: number): void;

    /**
     * Close all dialogs
     */
    closeAll(type?: string): void;

    /**
     * Get dialog style
     */
    style(index: number, cssStyle: Record<string, any>, limit?: boolean): void;

    /**
     * Set dialog title
     */
    title(title: string, index: number): void;

    /**
     * Get iframe window
     */
    getChildFrame(selector: string, index: number): any;

    /**
     * Get iframe index from iframe page
     */
    getFrameIndex(windowName: string): number;

    /**
     * Iframe parent method call
     */
    iframeAuto(index: number): void;

    /**
     * Iframe src
     */
    iframeSrc(index: number, url: string): void;

    /**
     * Set top
     */
    setTop(layero: any): void;

    /**
     * Maximize
     */
    full(index: number): void;

    /**
     * Minimize
     */
    min(index: number): void;

    /**
     * Restore
     */
    restore(index: number): void;

    /**
     * Prompt
     */
    prompt(options: PromptOptions, yes: (value: string, index: number, elem: any) => void): number;

    /**
     * Tab
     */
    tab(options: TabOptions): number;

    /**
     * Photos
     */
    photos(options: PhotosOptions): void;

    /**
     * Ready
     */
    ready(callback: () => void): void;

    /**
     * Config
     */
    config(options: {
      path?: string;
      zIndex?: number;
      [key: string]: any;
    }): void;
  }
}
