/**
 * Form - Form component
 */

declare namespace Form {
  interface RenderOptions {
    elem?: string | HTMLElement;
    filter?: string;
  }

  interface FormStatic {
    render(type?: string, filter?: string): void;
    on(event: string, callback: (data: any) => void): void;
    val(filter: string, object?: Record<string, any>): Record<string, any>;
    verify(options: Record<string, (value: string, item: HTMLElement) => string | boolean>): void;
  }
}
