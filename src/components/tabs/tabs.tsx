import React, { createContext, useContext, useState, ReactNode, HTMLAttributes, FunctionComponent } from "react";

// Tabs Context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within a TabsProvider");
  return context;
};

const TabsProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  return <TabsContext.Provider value={{ activeTabIndex, setActiveTabIndex }}>{children}</TabsContext.Provider>;
};

interface TabsContextType {
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
}

interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  index?: number;
  selectedClassName?: string;
}

// Tabs Component
const Tabs: FunctionComponent<TabsProps & HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
  return (
    <TabsProvider>
      <div className={className}>{children}</div>
    </TabsProvider>
  );
};

// TabList Component
const TabList: FunctionComponent<TabListProps & HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return (
    <div {...rest}>
      {React.Children.map(children, (child, index) => React.cloneElement(child as React.ReactElement<any>, { index }))}
    </div>
  );
};

// Tab Component
const Tab: FunctionComponent<TabProps> = ({ children, index, selectedClassName, className = "", ...rest }) => {
  const { activeTabIndex, setActiveTabIndex } = useTabs();
  const isActive = index === activeTabIndex;
  const tabClassName = isActive ? `${className} ${selectedClassName}` : className;

  return (
    <button {...rest} onClick={() => setActiveTabIndex(index ?? 0)} className={tabClassName}>
      {children}
    </button>
  );
};

// TabPanel Component
interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  children: ReactNode;
}

const TabPanel: FunctionComponent<TabPanelProps> = ({ index, children, ...rest }) => {
  const { activeTabIndex } = useTabs();
  return activeTabIndex === index ? <div {...rest}>{children}</div> : null;
};

// Props Interfaces
interface TabsProps {
  children: ReactNode;
}

interface TabListProps {
  children: ReactNode;
}

export { Tabs, TabList, Tab, TabPanel };
