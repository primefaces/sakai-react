import getConfig from 'next/config';
import React from 'react';
import Link from 'next/link';
import AppConfig from '../../../layout/AppConfig';
const Error = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    return (
        <div className="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="grid justify-content-center p-2 lg:p-0" style={{ minWidth: '80%' }}>
                <div className="col-12 mt-5 xl:mt-0 text-center">
                    <img src={`${contextPath}/demo/images/error/logo-error.svg`} alt="Sakai logo" className="mb-5" style={{ width: '81px', height: '60px' }} />
                </div>
                <div className="col-12 xl:col-6" style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="h-full w-full m-0 py-7 px-4" style={{ borderRadius: '53px', background: 'linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))' }}>
                        <div className="grid flex flex-column align-items-center">
                            <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                                <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                            </div>
                            <h1 className="text-900 font-bold text-5xl mb-2">Error Occured</h1>
                            <span className="text-600">Requested resource is not available.</span>
                            <img src={`${contextPath}/demo/images/error/asset-error.svg`} alt="Error" className="mt-5" width="80%" />
                            <div className="col-12 mt-5 text-center">
                                <i className="pi pi-fw pi-arrow-left text-blue-500 mr-2" style={{ verticalAlign: 'center' }}></i>
                                <Link href={`${contextPath}/`} passHref>
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
Error.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};
export default Error;
