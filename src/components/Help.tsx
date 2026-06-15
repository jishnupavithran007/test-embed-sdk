import { Copy, ChevronRight, CheckCircle2, Link, GitBranch } from "lucide-react";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

const Help = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { success } = useToast();

  const npmLinkSteps = [
    {
      step: 1,
      title: "Clone clover bank repository",
      command: "git clone https://github.com/ts-blink/clover-bank",
      description: "Clone the test embed environment",
    },
    {
      step: 2,
      title: "Clone visual-embed-sdk repository",
      command: "git clone https://github.com/thoughtspot/visual-embed-sdk",
      description: "Clone the SDK repository",
    },
    {
      step: 3,
      title: "Install dependencies in visual-embed-sdk",
      command: "npm i --legacy-peer-deps",
      description: "Install SDK dependencies (remove puppeteer from package.json if errors occur)",
    },
    {
      step: 4,
      title: "Generate TypeScript files",
      command: "npm run prepublishOnly",
      description: "Build the SDK (remove 'npm run is-publish-allowed &&' from script if not allowed)",
    },
    {
      step: 5,
      title: "Link visual-embed-sdk globally",
      command: "npm link",
      description: "Create a global symlink for the SDK",
    },
    {
      step: 6,
      title: "Install dependencies in clover-bank",
      command: "npm i",
      description: "Navigate to clover-bank directory first",
    },
    {
      step: 7,
      title: "Link visual-embed-sdk to clover-bank",
      command: "npm link @thoughtspot/visual-embed-sdk",
      description: "Link the local SDK to your test environment",
    },
    {
      step: 8,
      title: "Whitelist localhost URL",
      command: "tscli csp add-override --source 'frame-ancestors' --url '*'",
      description: "Allow embedding from localhost",
    },
  ];

  const unlinkSteps = [
    {
      title: "Check global packages",
      command: "npm ls --global",
      description: "List all globally linked packages",
    },
    {
      title: "Uninstall global package",
      command: "npm uninstall --global @thoughtspot/visual-embed-sdk",
      description: "Remove the global link",
    },
    {
      title: "Unlink from testbed",
      command: "npm unlink @thoughtspot/visual-embed-sdk",
      description: "Remove the link from your test environment",
    },
    {
      title: "Reinstall packages",
      command: "npm install",
      description: "Reinstall packages in your testbed",
    },
  ];

  const tscliCommands = [
    {
      title: "Configure CORS Hosts",
      command:
        'echo "https://.*.csb.app" | tscli --adv config set --key "/config/nginx/corshosts"',
      description: "Set up CORS configuration for CSB app domains",
    },
    {
      title: "Add CSP Frame Ancestors Override",
      command: "tscli csp add-override --source 'frame-ancestors' --url '*'",
      description: "Allow embedding in frames from any source",
    },
    {
      title: "Configure Nginx Cookie Flags",
      command:
        "tscli --adv service add-gflag nginx.nanny nginx_cookie_flag 'Secure SameSite=None'",
      description: "Set cookie security flags for cross-site access",
    },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    success("Command copied to clipboard!");

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-slate-800 dark:bg-slate-900 overflow-auto">
      <div className="p-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-gray-400 text-sm">
          <ChevronRight className="w-4 h-4" />
          <h1 className="text-2xl font-semibold text-white">
            Developer Guide & Useful Commands
          </h1>
        </div>

        {/* NPM Link Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              NPM Link visual-embed-sdk & Setup Test Environment
            </h2>
          </div>
          <div className="space-y-3">
            {npmLinkSteps.map((item, index) => (
              <div
                key={index}
                className="bg-slate-700 dark:bg-slate-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-9">
                  <code className="flex-1 px-3 py-2 bg-slate-900 dark:bg-slate-950 text-gray-300 rounded text-sm font-mono overflow-x-auto">
                    {item.command}
                  </code>
                  <button
                    onClick={() => copyToClipboard(item.command, index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                      copiedIndex === index
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NPM Unlink Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">
              NPM Unlink visual-embed-sdk
            </h2>
          </div>
          <div className="space-y-3">
            {unlinkSteps.map((item, index) => (
              <div
                key={`unlink-${index}`}
                className="bg-slate-700 dark:bg-slate-800 rounded-lg p-4"
              >
                <h3 className="text-base font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-slate-900 dark:bg-slate-950 text-gray-300 rounded text-sm font-mono overflow-x-auto">
                    {item.command}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(item.command, 100 + index)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                      copiedIndex === 100 + index
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === 100 + index ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TSCLI Commands Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            TSCLI Configuration Commands
          </h2>
          <div className="space-y-3">
            {tscliCommands.map((item, index) => (
              <div
                key={`tscli-${index}`}
                className="bg-slate-700 dark:bg-slate-800 rounded-lg p-4"
              >
                <h3 className="text-base font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-slate-900 dark:bg-slate-950 text-gray-300 rounded text-sm font-mono overflow-x-auto">
                    {item.command}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(item.command, 200 + index)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                      copiedIndex === 200 + index
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === 200 + index ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Note */}
        <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-amber-500 flex-shrink-0 mt-0.5">
            <span className="text-amber-500 text-xs font-bold">!</span>
          </div>
          <div className="text-sm">
            <span className="text-amber-200 font-semibold">Note: </span>
            <span className="text-amber-300">
              These commands require appropriate tscli access and should be run with proper permissions. 
              Make sure to restart your testbed server after unlinking packages.
            </span>
          </div>
        </div>

        {/* Source Link */}
        <div className="mt-4 text-center">
          <a
            href="https://thoughtspot.atlassian.net/wiki/spaces/TSEM/pages/2750677521/How+to+NPM+link+visual-embed-sdk+locally+and+setup+a+test+embed+environment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            View original Confluence documentation →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
