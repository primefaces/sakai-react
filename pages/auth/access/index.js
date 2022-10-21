import React from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import Link from 'next/link';
import AppConfig from '../../../layout/AppConfig';
import { Button } from 'primereact/button';

const AccessDeniedPage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`${contextPath}/demo/images/access/logo-orange.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0"/>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">Access Denied Occured</h1>
                        <div className="text-600 mb-5">You do not have the necessary permisions.</div>
                        <img src={`${contextPath}/demo/images/access/asset-access.svg`} alt="Error" className="mb-5" width="80%" />
                        <Button icon="pi pi-arrow-left" label="Go to Dashboard" className="p-button-text" onClick={() => router.push('/')}/>
                    </div>
                </div>
            </div>
        </div> 
    );

    return (
        <div className="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="grid justify-content-center p-2 lg:p-0" style={{ minWidth: '80%' }}>
                <div className="col-12 mt-5 xl:mt-0 text-center">
                    <img src={`${contextPath}/demo/images/access/logo-orange.svg`} alt="Sakai logo" className="mb-5" style={{ width: '81px', height: '60px' }} />
                </div>
                <div className="col-12 xl:col-6" style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)' }}>
                    <div className="h-full w-full m-0 py-7 px-4" style={{ borderRadius: '53px', background: 'linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))' }}>
                        <div className="grid flex flex-column align-items-center">
                            <div className="flex justify-content-center align-items-center bg-orange-500 border-circle" style={{ width: '3.2rem', height: '3.2rem' }}>
                                <i className="text-50 pi pi-fw pi-lock text-2xl"></i>
                            </div>
                            <h1 className="text-900 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1>
                            <span className="text-600 text-center">You do not have the necessary permisions. Please contact admins.</span>
                            <img src={`${contextPath}/demo/images/access/asset-access.svg`} alt="Access denied" className="mt-5" width="80%" />
                            <div className="col-12 mt-5 text-center">
                                <i className="pi pi-fw pi-arrow-left text-blue-500 mr-2" style={{ verticalAlign: 'center' }}></i>
                                <Link href="/">
                                    <a className="text-blue-500">Go to Dashboard</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AccessDeniedPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default AccessDeniedPage;
