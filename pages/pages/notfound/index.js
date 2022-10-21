import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Button } from 'primereact/button';

const NotFoundPage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`${contextPath}/demo/images/notfound/logo-blue.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0"/>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <span className="text-blue-500 font-bold text-3xl">404</span>
                        <h1 className="text-900 font-bold text-5xl mb-2">Not Found</h1>
                        <div className="text-600 mb-5">Requested resource is not available</div>
                        <Link href="/">
                            <a className="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                                <span className="flex justify-content-center align-items-center bg-cyan-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                    <i className="text-50 pi pi-fw pi-table text-2xl"></i>
                                </span>
                                <span className="ml-4 flex flex-column">
                                    <span className="text-900 lg:text-xl font-medium mb-1">Frequently Asked Questions</span>
                                    <span className="text-600 lg:text-lg">Ultricies mi quis hendrerit dolor.</span>
                                </span>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                                <span className="flex justify-content-center align-items-center bg-orange-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                    <i className="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                                </span>
                                <span className="ml-4 flex flex-column">
                                    <span className="text-900 lg:text-xl font-medium mb-1">Solution Center</span>
                                    <span className="text-600 lg:text-lg">Phasellus faucibus scelerisque eleifend.</span>
                                </span>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="col-12 flex align-items-center mb-5 py-5 border-300 border-bottom-1">
                                <span className="flex justify-content-center align-items-center bg-indigo-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                    <i className="pi pi-fw pi-unlock text-50 text-2xl"></i>
                                </span>
                                <span className="ml-4 flex flex-column">
                                    <span className="text-900 lg:text-xl font-medium mb-1">Permission Manager</span>
                                    <span className="text-600 lg:text-lg">Accumsan in nisl nisi scelerisque</span>
                                </span>
                            </a>
                        </Link>
                        <Button icon="pi pi-arrow-left" label="Go to Dashboard" className="p-button-text" onClick={() => router.push('/')}/>
                    </div>
                </div>
            </div>
        </div> 
    );
};

NotFoundPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default NotFoundPage;
