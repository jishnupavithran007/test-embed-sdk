import { useEffect, useRef } from "react";
import {
  EmbedEvent,
  AppEmbed,
  Page,
  PrimaryNavbarVersion,
  // HomePage,
  // PrimaryNavbarVersion,
} from "@thoughtspot/visual-embed-sdk";
import { trustedAuth } from "../../auth";

trustedAuth();

const FullApp = () => {
  const refApp = useRef<AppEmbed | null>(null);
  useEffect(() => {
    const appEmbed = new AppEmbed(document.getElementById("tsEmbed")!, {
      frameParams: {
        width: "100%",
        height: "100vh",
      },
      pageId: Page.Home,
      isLiveboardXLSXCSVDownloadEnabled: true,
      discoveryExperience: {
        // homePage: HomePage.Focused,
        primaryNavbarVersion: PrimaryNavbarVersion.Sliding,
      },
      updatedSpotterChatPrompt: true,
      spotterSidebarConfig: {
        enablePastConversationsSidebar: true,
      },
    });
    appEmbed.on(EmbedEvent.AuthExpire, (payload) => {
      console.log("AuthInit", payload);
    });
    refApp.current = appEmbed;
    appEmbed.render();
  }, []);

  return <div className="w-full h-full" id="tsEmbed"></div>;
};

export default FullApp;
