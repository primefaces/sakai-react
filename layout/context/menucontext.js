import React, { useState } from 'react';

export const MenuContext = React.createContext();

export const MenuProvider = (props) => {
    const [activeMenu, setActiveMenu] = useState('');

    const value = {
        activeMenu,
        setActiveMenu
    };

    return <MenuContext.Provider value={value}>{props.children}</MenuContext.Provider>;
};
