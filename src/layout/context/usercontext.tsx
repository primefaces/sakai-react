import {
    createContext,
    useContext,
    useEffect, useRef,
    useState
} from "react";
import {account} from "../../service/appwrite";
import {useRouter} from "next/navigation";
import {ID, Models} from "appwrite";
import {Toast} from "primereact/toast";

const UserContext = createContext({} as UserContextProps);

export function useUser() {
    return useContext(UserContext);
}

export interface UserContextProps {
    current: Models.Session | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createRecovery: (email: string, url: string) => Promise<Models.Token>;
    register: (email: string, password: string) => Promise<void>;
    updateRecovery: (password: string, password2: string)=> Promise<void>;
}

export function UserProvider(props: { children: any }) {
    const [user, setUser] = useState(null);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    async function login(email: string, password: string) {
        const loggedIn = await account.createEmailSession(email, password);
        setUser(loggedIn as any);
        localStorage.setItem("auth_user", JSON.stringify(loggedIn))

        toast.current?.show({severity: 'success', summary: 'Logined', detail: 'Login successful', life: 3000});
        router.push('/');
    }

    async function createRecovery(email: string, url: string) {
        let token = await account.createRecovery(email, url);

        router.push('/');
        return token
    }

    async function updateRecovery(password: string, password2: string) {
        const urlParams = new URLSearchParams(window.location.search);
        const secret = urlParams.get('secret');
        const userId = urlParams.get('userId');
        await account.updateRecovery(userId as string, secret as string, password, password2);
        router.push('/auth/login');
    }

    async function logout() {
        await account.deleteSession("current");
        localStorage.removeItem("auth_user")
        setUser(null);
    }

    async function register(email: string, password: string) {
        await account.create(ID.unique(), email, password);
        await login(email, password);
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            setUser(loggedIn as any);
        } catch (err) {
            setUser(null);
        }
    }

    useEffect(() => {
        debugger
        init();
    }, []);

    const value: UserContextProps = {
        current: user,
        login,
        logout,
        register,
        createRecovery,
        updateRecovery
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}
