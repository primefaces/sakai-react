    import React, { useContext } from 'react';
    import { LayoutContext } from '@/layout/context/layoutcontext';

    export default function GlobalLoading() {
        const { globalLoading } = useContext(LayoutContext);
        return null;
        // if(globalLoading){
        //     return (
        //         <>
        //             <div id="preloader">
        //                 <div id="preloader-area">
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                     <div className="spinner"></div>
        //                 </div>
        //                 <div className="preloader-section preloader-left"></div>
        //                 <div className="preloader-section preloader-right"></div>
        //             </div>
        //         </>
        //     );
        // }
    }
