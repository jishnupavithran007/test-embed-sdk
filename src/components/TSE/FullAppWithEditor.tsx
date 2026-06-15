import { useEffect, useRef, useState } from "react";
import {
  EmbedEvent,
  AppEmbed,
  Page,
  type AppViewConfig,
} from "@thoughtspot/visual-embed-sdk";
import { authNone } from "../../auth";
import Editor, { type Monaco } from "@monaco-editor/react";
import { Code2, Play, Settings, CheckCircle, XCircle } from "lucide-react";
import type { editor } from "monaco-editor";
import {
  loadVisualEmbedSDKTypes,
  loadDOMTypes,
} from "../../utils/monaco-ts-types";

authNone();

const FullAppWithEditor = () => {
  const refApp = useRef<AppEmbed | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [editorCode, setEditorCode] =
    useState<string>(`// ThoughtSpot AppEmbed Configuration
import { 
  AppEmbed, 
  Page, 
  EmbedEvent, 
  PrimaryNavbarVersion,
  type AppViewConfig 
} from '@thoughtspot/visual-embed-sdk';

const config: AppViewConfig = {
  frameParams: {
    width: "100%",
    height: "100vh",
  },
  pageId: Page.Home,
  showPrimaryNavbar: true,
  discoveryExperience: {
    primaryNavbarVersion: PrimaryNavbarVersion.Sliding,
  },
  // Try typing 'Page.' or 'config.' to see IntelliSense!
};

// Initialize the embed
const appEmbed = new AppEmbed(
  document.getElementById("tsEmbed")!,
  config
);

// Listen to events
appEmbed.on(EmbedEvent.Init, (payload) => {
  console.log("Embed initialized", payload);
});

appEmbed.render();
`);
  const [config, setConfig] = useState<AppViewConfig>({
    frameParams: {
      width: "100%",
      height: "100vh",
    },
    pageId: Page.Home,
    showPrimaryNavbar: true,
  });
  const [editorWidth, setEditorWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [typeErrors, setTypeErrors] = useState<string[]>([]);
  const [typesLoaded, setTypesLoaded] = useState(false);

  // Configure Monaco Editor with TypeScript types
  const handleEditorWillMount = async (monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ["node_modules/@types"],
      strict: false,
      skipLibCheck: true,
      lib: ["ES2020", "DOM"],
      isolatedModules: true,
      allowSyntheticDefaultImports: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [],
    });

    // Load type definitions from the SDK package (wait for completion)
    console.log("⏳ Loading SDK types...");
    await loadVisualEmbedSDKTypes(monaco);
    loadDOMTypes(monaco);
    setTypesLoaded(true);
    console.log("✅ SDK types loaded, IntelliSense ready");
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, "typescript");
    }

    const updateDiagnostics = () => {
      const model = editor.getModel();
      if (!model) return;

      const uri = model.uri;
      const markers = monaco.editor.getModelMarkers({ resource: uri });

      const errors = markers
        .filter(
          (marker: { severity: number }) =>
            marker.severity === monaco.MarkerSeverity.Error
        )
        .map(
          (marker: {
            startLineNumber: number;
            message: string;
            code?: string | number;
          }) => {
            const code = marker.code ? ` (${marker.code})` : "";
            return `Line ${marker.startLineNumber}${code}: ${marker.message}`;
          }
        );

      setTypeErrors(errors);
    };

    editor.onDidChangeModelContent(() => {
      setTimeout(updateDiagnostics, 300);
    });

    updateDiagnostics();
  };

  useEffect(() => {
    if (refApp.current) {
      refApp.current.destroy();
    }

    const appEmbed = new AppEmbed(document.getElementById("tsEmbed")!, config);

    appEmbed.on(EmbedEvent.AuthExpire, (payload) => {
      console.log("AuthExpire", payload);
    });

    appEmbed.on(EmbedEvent.Init, (payload) => {
      console.log("Init", payload);
    });

    refApp.current = appEmbed;
    appEmbed.render();

    return () => {
      if (refApp.current) {
        refApp.current.destroy();
      }
    };
  }, [config]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleApplyConfig = async () => {
    try {
      // Import actual SDK enums to use in evaluation
      const SDK = await import("@thoughtspot/visual-embed-sdk");

      const configMatch = editorCode.match(
        /const config:?\s*(?:AppViewConfig)?\s*=\s*({[\s\S]*?});/
      );
      if (configMatch) {
        // Create function with SDK enums in scope
        const evalFunction = new Function(
          "Page",
          "PrimaryNavbarVersion",
          "HomePage",
          "ListPage",
          "DataPanelCustomColumnGroupsAccordionState",
          "HomePageSearchBarMode",
          `return ${configMatch[1]}`
        );

        const newConfig = evalFunction(
          SDK.Page,
          SDK.PrimaryNavbarVersion,
          SDK.HomePage,
          SDK.ListPage,
          SDK.DataPanelCustomColumnGroupsAccordionState,
          SDK.HomePageSearchBarMode
        );

        setConfig(newConfig);
        console.log("Applied new config:", newConfig);
      }
    } catch (error) {
      console.error("Error applying config:", error);
      alert("Error parsing configuration. Please check your code syntax.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="h-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            ThoughtSpot Full App with Live Editor
          </h1>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
            • IntelliSense {typesLoaded ? "✓" : "⏳"} • Type-safe editing
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyConfig}
            disabled={typeErrors.length > 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
            title={
              typeErrors.length > 0
                ? "Fix type errors before applying"
                : "Apply configuration"
            }
          >
            <Play className="w-4 h-4" />
            Apply Config
          </button>
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div
          className="flex flex-col bg-slate-900"
          style={{ width: `${editorWidth}%` }}
        >
          <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
            <span className="text-xs font-medium text-slate-300">
              config.ts
            </span>
            <div className="flex items-center gap-2">
              {typeErrors.length === 0 ? (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>No errors</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>
                    {typeErrors.length} error{typeErrors.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              path="config.ts"
              theme="vs-dark"
              value={editorCode}
              onChange={(value) => setEditorCode(value || "")}
              beforeMount={handleEditorWillMount}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false,
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnCommitCharacter: true,
                acceptSuggestionOnEnter: "on",
                snippetSuggestions: "inline",
              }}
            />
          </div>
          {typeErrors.length > 0 && (
            <div className="h-24 bg-slate-950 border-t border-slate-700 overflow-y-auto flex-shrink-0">
              <div className="p-2">
                <div className="text-xs font-medium text-red-400 mb-1">
                  TypeScript Errors:
                </div>
                {typeErrors.map((error, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-red-300 mb-1 font-mono"
                  >
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-slate-300 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Right Side - Embed */}
        <div className="flex-1 relative bg-white dark:bg-slate-900">
          {showConfigPanel && (
            <div className="absolute top-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 w-80 max-h-96 overflow-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Current Configuration
                  </h3>
                  <button
                    onClick={() => setShowConfigPanel(false)}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded overflow-auto text-slate-800 dark:text-slate-200 font-mono">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <div className="w-full h-full" id="tsEmbed"></div>
        </div>
      </div>
    </div>
  );
};

export default FullAppWithEditor;
