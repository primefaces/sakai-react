'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect } from 'react';

export default function FormModal({
    children,
    title,
    fetchValue,
    clearValues,
    visible,
    setVisible,
    start,
    footerValue
}: {
    children: ReactNode;
    title: string;
    fetchValue: () => void;
    clearValues: () => void;
    visible: boolean;
    setVisible: (params: boolean) => void;
    start: boolean;
    footerValue?: { footerState: boolean; reject: string; next: string };
}) {

    const footerContent = (
        <div>
            <Button
                label={footerValue?.footerState ? footerValue.reject : 'Назад'}
                className="reject-button"
                icon="pi pi-times"
                onClick={() => {
                    setVisible(false);
                    clearValues();
                }}
            />

            <Button
                label={footerValue?.footerState ? footerValue.next : 'Добавить'}
                disabled={start}
                icon="pi pi-check"
                onClick={() => {
                    setVisible(false);
                    fetchValue();
                }}
                autoFocus
            />
        </div>
    );

    return (
        <div>
            <Dialog
                header={title}
                visible={visible}
                className="my-custom-dialog"
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    clearValues();
                }}  
                footer={footerContent}
            >
                {children}
            </Dialog>
        </div>
    );
}
