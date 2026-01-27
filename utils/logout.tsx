'use client';

import { User } from "@/types/user";

export const logout = ({setGlobalLoading, setUser}: {setGlobalLoading: (params: boolean)=> void, setUser: React.Dispatch<React.SetStateAction<User | null>>}) => {
    console.log('logout');
    setGlobalLoading(true);

    setTimeout(() => {
        setGlobalLoading(false);
    }, 1000);

    setUser(null);
    localStorage.removeItem('userVisit');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
};
