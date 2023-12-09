/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import {LayoutContext} from "../../../../layout/context/layoutcontext";
import {useUser} from "../../../../layout/context/usercontext";

const LoginPage = () => {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const { layoutConfig } = useContext(LayoutContext);

    const user = useUser();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                            <span className="text-600 font-medium">Reset password and continue</span>
                        </div>

                        <div>
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3"></Password>
                            <label htmlFor="password2" className="block text-900 font-medium text-xl mb-2">
                                Repeat Password
                            </label>
                            <Password inputId="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} feedback={false} placeholder="Repeat Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3"></Password>
                            <Button label="Reset Password" className="w-full p-3 text-xl" onClick={() => user.updateRecovery(password, password2)}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
