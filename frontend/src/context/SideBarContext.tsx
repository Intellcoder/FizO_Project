import { createContext, useContext, useState } from "react";

const SideBarContext = createContext({
  isOpen: true,
  toggle: () => {},
  closeSidebar: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SideBarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((p) => !p),
        closeSidebar: () => setIsOpen(false),
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export const useSidebar = () => useContext(SideBarContext);
