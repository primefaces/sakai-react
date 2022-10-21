import React from 'react';
import getConfig from 'next/config';
import Link from 'next/link';
import AppConfig from '../../../layout/AppConfig';

const NotFound = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <div className="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="grid justify-content-center p-2 lg:p-0" style={{ minWidth: '80%' }}>
                <div className="col-12 mt-5 xl:mt-0 text-center">
                    <img src={`${contextPath}/demo/images/notfound/logo-blue.svg`} alt="Sakai logo" className="mb-5" style={{ width: '81px', height: '60px' }} />
                </div>
                <div className="col-12 xl:col-6" style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="flex justify-content-center h-full w-full m-0 py-7 px-4" style={{ borderRadius: '53px', background: 'linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))' }}>
                        <div className="grid flex-column align-items-center">
                            <span className="text-blue-500 font-bold text-3xl">404</span>
                            <h1 className="text-900 font-bold text-3xl lg:text-5xl mb-2">Looks like you are lost</h1>
                            <span className="text-600">Requested resource is not available.</span>
                            <Link href="/">
                                <a className="col-12 flex align-items-center py-5 mt-6 border-300 border-bottom-1">
                                    <div className="flex justify-content-center align-items-center bg-cyan-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                        <i className="text-50 pi pi-fw pi-table text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-900 lg:text-xl font-medium mb-0 block">Frequently Asked Questions</p>
                                        <span className="text-600 lg:text-xl">Ultricies mi quis hendrerit dolor.</span>
                                    </div>
                                </a>
                            </Link>
                            <Link href="/">
                                <a className="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                                    <div className="flex justify-content-center align-items-center bg-orange-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                        <i className="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-900 lg:text-xl font-medium mb-0">Solution Center</p>
                                        <span className="text-600 lg:text-xl">Phasellus faucibus scelerisque eleifend.</span>
                                    </div>
                                </a>
                            </Link>
                            <Link href="/">
                                <a className="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                                    <div className="flex justify-content-center align-items-center bg-indigo-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                        <i className="pi pi-fw pi-unlock text-50 text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-900 lg:text-xl font-medium mb-0">Permission Manager</p>
                                        <span className="text-600 lg:text-xl">Accumsan in nisl nisi scelerisque</span>
                                    </div>
                                </a>
                            </Link>
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

NotFound.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default NotFound;
