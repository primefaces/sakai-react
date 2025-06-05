'use client';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useContext, useEffect, useRef } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function Message() {
    const { message } = useContext(LayoutContext);
    const toast = useRef(null);

    const showError = () => {
        toast.current?.show({ severity: message.value.severity, summary: message.value.summary, detail: message.value.detail, life: 3000 });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            showError();
        }, 0); // откладываем до следующей итерации event loop

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div>
            {/* <Button label="Error" severity="danger" onClick={showError} /> */}
            <Toast ref={toast} />
        </div>
    );
}
