/**
 * TypeScript definitions for Layui v2.13.0
 * Project: https://layui.dev
 * Definitions by: Community Contributors
 * 
 * Classic modular front-end UI library
 */

/// <reference path="./modules/layer.d.ts" />
/// <reference path="./modules/laydate.d.ts" />
/// <reference path="./modules/form.d.ts" />
/// <reference path="./modules/table.d.ts" />
/// <reference path="./modules/upload.d.ts" />

declare namespace layui {
  /**
   * Layui version
   */
  const v: string;

  /**
   * Layui configuration
   */
  interface Config {
    /** Base directory for modules */
    dir?: string;
    /** Module request timeout in seconds */
    timeout?: number;
    /** Enable debug mode */
    debug?: boolean;
    /** Add version parameter to module requests */
    version?: boolean | string;
  }

  /**
   * Configure Layui
   */
  function config(options: Config): typeof layui;

  /**
   * Load and use modules
   */
  function use(modules: string | string[], callback?: (...args: any[]) => void): typeof layui;

  /**
   * Define a module
   */
  function define(deps: string | string[], factory: (...args: any[]) => any): typeof layui;

  /**
   * Extend modules
   */
  function extend(options: Record<string, string>): typeof layui;

  /**
   * Device information
   */
  const device: {
    os: string;
    ie: boolean | number;
    weixin: boolean;
    android: boolean;
    ios: boolean;
  };

  // Module exports
  const layer: Layer.LayerStatic;
  const laydate: Laydate.LaydateStatic;
  const form: Form.FormStatic;
  const table: Table.TableStatic;
  const upload: Upload.UploadStatic;
}

export = layui;

export as namespace layui;
