'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect } from 'react';

export default function DocumentModal({children, title, fetchValue, visible, setVisible}:
    {
        children: ReactNode, 
        title: string,
        fetchValue: ()=> void,
        visible: boolean,
        setVisible: (params: boolean)=> void,
    }
    ){

    return (
        <div>
            <Dialog
                header={title}
                visible={visible}
                className='my-custom-document-dialog'
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                {children}
            </Dialog>
        </div>
    );
}
