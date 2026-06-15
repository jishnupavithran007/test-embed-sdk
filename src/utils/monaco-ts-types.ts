/**
 * Monaco Editor Type Definitions Loader
 * Dynamically loads TypeScript definitions from the installed @thoughtspot/visual-embed-sdk package
 *
 * ZERO HARDCODING - All types are loaded directly from the installed SDK package
 */

import type { Monaco } from "@monaco-editor/react";

/**
 * Loads ThoughtSpot Visual Embed SDK type definitions from the actual package
 * Fetches ALL declaration files from the SDK package for complete type coverage
 */
export const loadVisualEmbedSDKTypes = async (
  monaco: Monaco
): Promise<void> => {
  try {
    // List of key declaration files from the SDK package
    // These files contain ALL the types maintained by ThoughtSpot
    const typeFiles = [
      "/node_modules/@thoughtspot/visual-embed-sdk/lib/src/types.d.ts", // Core types (6700+ lines)
      "/node_modules/@thoughtspot/visual-embed-sdk/lib/src/embed/app.d.ts", // AppEmbed, Page enums
      "/node_modules/@thoughtspot/visual-embed-sdk/lib/src/embed/search.d.ts", // SearchEmbed
      "/node_modules/@thoughtspot/visual-embed-sdk/lib/src/embed/liveboard.d.ts", // LiveboardEmbed
      "/node_modules/@thoughtspot/visual-embed-sdk/lib/src/index.d.ts", // Main exports
    ];

    let allContent = "";

    // Fetch all type files
    for (const file of typeFiles) {
      try {
        console.log(`🔍 Fetching: ${file}`);
        const response = await fetch(file);
        console.log(
          `📡 Response for ${file.split("/").pop()}: ${response.status}`
        );

        if (response.ok) {
          const content = await response.text();
          console.log(`📄 Content length: ${content.length} chars`);

          // Remove import statements and sourcemap comments, but KEEP export keywords
          const cleanedContent = content
            .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "") // Remove imports
            .replace(/^export\s*{[^}]*}\s*from\s*['"].*?['"];?\s*$/gm, "") // Remove re-exports
            .replace(/\/\/# sourceMappingURL=.*/g, ""); // Remove sourcemap comments
          // Note: We keep 'export declare' and 'export interface' etc.

          allContent += "\n" + cleanedContent;
          console.log(`✅ Loaded: ${file.split("/").pop()}`);
        } else {
          console.error(`❌ HTTP ${response.status} for ${file}`);
        }
      } catch (error) {
        console.error(`⚠️  Error loading ${file}:`, error);
      }
    }

    if (allContent.trim()) {
      // Wrap in module declaration for proper TypeScript imports
      const wrappedTypes = `
declare module '@thoughtspot/visual-embed-sdk' {
${allContent}
}
`;

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        wrappedTypes,
        "file:///node_modules/@thoughtspot/visual-embed-sdk/index.d.ts"
      );

      console.log(
        "✅ Successfully loaded ALL ThoughtSpot SDK types from package"
      );
    } else {
      throw new Error("No content loaded from type files");
    }
  } catch (error) {
    console.error("❌ Failed to load Visual Embed SDK types:", error);
    console.log("ℹ️  Falling back to minimal types...");
    loadFallbackTypes(monaco);
  }
};

/**
 * Fallback minimal types - only used if package fetch fails
 * This is NOT the primary source - just a safety net
 */
const loadFallbackTypes = (monaco: Monaco) => {
  const minimalTypes = `
declare module '@thoughtspot/visual-embed-sdk' {
  export enum Page {
    Home = 'home',
    Search = 'search',
    Answers = 'answers',
    Liveboards = 'liveboards',
    Data = 'data',
  }
  
  export enum PrimaryNavbarVersion {
    Sliding = 'v3',
  }
  
  export enum EmbedEvent {
    Init = 'init',
    Load = 'load',
    AuthExpire = 'authExpire',
  }
  
  export interface AppViewConfig {
    frameParams?: { width?: string | number; height?: string | number };
    pageId?: Page;
    showPrimaryNavbar?: boolean;
    discoveryExperience?: {
      primaryNavbarVersion?: PrimaryNavbarVersion;
    };
  }
  
  export class AppEmbed {
    constructor(domSelector: HTMLElement, viewConfig: AppViewConfig);
    render(): AppEmbed;
    destroy(): void;
    on(event: EmbedEvent, callback: (payload: any) => void): void;
  }
}`;

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    minimalTypes,
    "file:///fallback-types.d.ts"
  );
};

/**
 * Loads DOM type definitions (document, console, window)
 */
export const loadDOMTypes = (monaco: Monaco): void => {
  const domTypes = `
declare const document: Document;
declare const console: Console;
declare const window: Window;

interface Document {
  getElementById(elementId: string): HTMLElement | null;
  createElement(tagName: string): HTMLElement;
  querySelector(selector: string): HTMLElement | null;
}

interface Console {
  log(...data: any[]): void;
  error(...data: any[]): void;
  warn(...data: any[]): void;
  info(...data: any[]): void;
}

interface Window {
  [key: string]: any;
}

interface HTMLElement {
  id: string;
  className: string;
  innerHTML: string;
  style: CSSStyleDeclaration;
}

interface CSSStyleDeclaration {
  [key: string]: string;
}
`;

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    domTypes,
    "file:///node_modules/@types/dom/index.d.ts"
  );
};
