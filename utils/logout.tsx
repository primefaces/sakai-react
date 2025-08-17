'use client';

export const logout = ({setGlobalLoading, setUser}) => {
    console.log('logout');
    setGlobalLoading(true);

    setTimeout(() => {
        setGlobalLoading(false);    
    }, 1000);

    setUser(null);
    localStorage.removeItem('userVisit');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
};
