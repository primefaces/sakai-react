/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useContext, useRef, useState} from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {LayoutContext} from "../../../../layout/context/layoutcontext";
import {useUser} from "../../../../layout/context/usercontext";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
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
                            <div className="text-900 text-3xl font-medium mb-3">Forgot Password</div>
                            <span className="text-600 font-medium">Enter your email to reset your password</span>
                        </div>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full mb-5" style={{ padding: '1rem' }} />
                            <Button label="Submit" className="w-full p-3 text-xl" onClick={() => user.createRecovery(email, "http://localhost:3000/auth/verify")}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
