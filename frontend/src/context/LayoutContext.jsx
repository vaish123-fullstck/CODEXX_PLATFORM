import React, { createContext, useState } from 'react';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const collapseSidebar = () => setIsSidebarCollapsed(true);
    const expandSidebar = () => setIsSidebarCollapsed(false);
    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <LayoutContext.Provider value={{ isSidebarCollapsed, collapseSidebar, expandSidebar, toggleSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
};
