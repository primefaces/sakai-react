'use client';

export function getToken(name:string) {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
};

export function isTokenExpired() {
  const testToken = getToken('access_token');
  
   try {
      if (!testToken) throw new Error("Токен отсутствует");
      
      const { exp } = JSON.parse(atob(testToken.split(".")[1]));
      return exp - Math.floor(Date.now() / 1000) <= 300;
   } catch (error) {
      console.log("Ошибка при разборе токена:", error);
      return true; // В случае ошибки считаем, что истёк
   }
}