import React, {useContext, useEffect, useState} from 'react';

import {Button} from 'primereact/button';
import AuthContext from "../AuthProvider";
import {useLocation, useNavigate} from "react-router-dom";
import {InputText} from 'primereact/inputtext';
import {Password} from "primereact/password";

export const Login = () => {
    let location = useLocation();
    let navigate = useNavigate();
    let from = location.state?.from?.pathname || "/";

    const {signIn, signOut} = useContext(AuthContext);


    useEffect(() => {
        signOut()
    }, []);


    const login = () => {
        signIn();
        navigate(from, {replace: true});
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="p-grid login-demo">
            <div className="login-panel">
                <InputText placeholder="Email" id="inputtext" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button onClick={() => login()}>
                    <span className="p-button-label">LOGIN</span>
                </Button>
            </div>
        </div>
    );
}
