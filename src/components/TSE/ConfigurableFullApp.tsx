import { useEffect, useRef, useState, useCallback } from "react";
import {
  EmbedEvent,
  AppEmbed,
  Page,
  ListPage,
  type AppViewConfig,
} from "@thoughtspot/visual-embed-sdk";
import { authNone } from "../../auth";
import { Settings } from "lucide-react";

authNone();

type ModularHomeOption = "true" | "false" | "none";
type ListPageOption = "v2" | "v3" | "none";

const ConfigurableFullApp = () => {
  const refApp = useRef<AppEmbed | null>(null);
  const [modularHome, setModularHome] = useState<ModularHomeOption>("none");
  const [listPageVersion, setListPageVersion] =
    useState<ListPageOption>("none");
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  // Function to build config - used by both useEffect and display
  const buildConfig = useCallback((): AppViewConfig => {
    const config: AppViewConfig = {
      frameParams: {
        width: "100%",
        height: "100vh",
      },
      pageId: Page.Home,
      showPrimaryNavbar: true,
    };

    // Handle modularHomeExperience option
    if (modularHome !== "none") {
      config.modularHomeExperience = modularHome === "true";
    }

    // Handle listPageVersion option
    if (listPageVersion !== "none") {
      config.discoveryExperience = {
        ...(config.discoveryExperience || {}),
        listPageVersion:
          listPageVersion === "v2" ? ListPage.List : ListPage.ListWithUXChanges,
      };
    }

    return config;
  }, [modularHome, listPageVersion]);

  useEffect(() => {
    // Cleanup existing embed if any
    if (refApp.current) {
      refApp.current.destroy();
    }

    const config = buildConfig();
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
  }, [modularHome, listPageVersion, buildConfig]);

  return (
    <div className="w-full h-full relative">
      {/* Configuration Panel */}
      <div
        className={`absolute top-12 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transition-all ${
          isConfigOpen ? "w-80" : "w-auto"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Configuration
            </h3>
          </div>
          <button
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsConfigOpen(!isConfigOpen);
            }}
          >
            {isConfigOpen ? (
              <svg
                className="w-5 h-5"
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
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Configuration Options */}
        {isConfigOpen && (
          <div className="p-4 space-y-4">
            {/* Modular Home Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Modular Home Experience
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modularHome"
                    value="true"
                    checked={modularHome === "true"}
                    onChange={(e) =>
                      setModularHome(e.target.value as ModularHomeOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    True
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modularHome"
                    value="false"
                    checked={modularHome === "false"}
                    onChange={(e) =>
                      setModularHome(e.target.value as ModularHomeOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    False
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modularHome"
                    value="none"
                    checked={modularHome === "none"}
                    onChange={(e) =>
                      setModularHome(e.target.value as ModularHomeOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Not passed (default)
                  </span>
                </label>
              </div>
            </div>

            {/* List Page Version */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                List Page Version
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listPageVersion"
                    value="v2"
                    checked={listPageVersion === "v2"}
                    onChange={(e) =>
                      setListPageVersion(e.target.value as ListPageOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    V2 (List)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listPageVersion"
                    value="v3"
                    checked={listPageVersion === "v3"}
                    onChange={(e) =>
                      setListPageVersion(e.target.value as ListPageOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    V3 (ListWithUXChanges)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listPageVersion"
                    value="none"
                    checked={listPageVersion === "none"}
                    onChange={(e) =>
                      setListPageVersion(e.target.value as ListPageOption)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Not passed (default)
                  </span>
                </label>
              </div>
            </div>

            {/* Current Config Display */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Current Config:
              </p>
              <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded overflow-auto max-h-32 text-slate-800 dark:text-slate-200">
                {JSON.stringify(buildConfig(), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Embed Container */}
      <div className="w-full h-full" id="tsEmbed"></div>
    </div>
  );
};

export default ConfigurableFullApp;
