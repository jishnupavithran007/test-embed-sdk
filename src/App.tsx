import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import FullApp from "./components/TSE/FullApp";
import ConfigurableFullApp from "./components/TSE/ConfigurableFullApp";
import FullAppWithEditor from "./components/TSE/FullAppWithEditor";
import "./App.css";
import Help from "./components/Help";

function App() {
  const [activePage, setActivePage] = useState("full-app");

  const handleNavigate = (page: string) => {
    setActivePage(page);
    // You can set different iframe sources based on the page
    // For now, keeping it empty - you can configure it based on your needs
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-800 dark:bg-slate-900">
      <Header title="ThoughtSpot Dashboard" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        {activePage === "full-app" && <FullApp />}
        {activePage === "configurable-app" && <ConfigurableFullApp />}
        {activePage === "full-app-editor" && <FullAppWithEditor />}
        {activePage === "help" && <Help />}
      </div>
    </div>
  );
}

export default App;
