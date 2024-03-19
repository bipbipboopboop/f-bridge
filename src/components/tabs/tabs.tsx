import React, { useState, ReactNode, createContext, useContext, HTMLAttributes } from "react";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabId: string;
  children: React.ReactNode;
}

interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  tabId: string;
  children: React.ReactNode;
  selectedClassName?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ className, children }) => {
  return (
    <TabsProvider>
      <div className={className}>{children}</div>
    </TabsProvider>
  );
};

const TabList: React.FC<TabListProps> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const Tab: React.FC<TabProps> = ({ tabId, children, selectedClassName, className, ...rest }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === tabId;

  // Combine common classes with conditionally applied selectedClassName
  const tabClasses = `${className || ""} ${isActive ? selectedClassName : ""}`.trim();

  return (
    <button {...rest} onClick={() => setActiveTab(tabId)} className={tabClasses}>
      {children}
    </button>
  );
};

const TabPanel: React.FC<TabPanelProps> = ({ tabId, children, ...rest }) => {
  const { activeTab } = useTabs(); // Use the context to get the current active tab

  return activeTab === tabId ? <div {...rest}>{children}</div> : null;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("");

  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

export { Tabs, TabList, Tab, TabPanel };
