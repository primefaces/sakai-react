'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
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
    start
}: {
    children: ReactNode;
    title: string;
    fetchValue: () => void;
    clearValues: () => void;
    visible: boolean;
    setVisible: (params: boolean) => void;
    start: boolean;
}) {
    const media = useMediaQuery('(max-width:640px)');

    const footerContent = (
        <div>
            <Button
                label="Назад"
                className="reject-button"
                icon="pi pi-times"
                onClick={() => {
                    setVisible(false);
                    clearValues();
                }}
            />
            {
                <Button
                    label="Добавить"
                    disabled={start}
                    icon="pi pi-check"
                    onClick={() => {
                        setVisible(false);
                        fetchValue();
                    }}
                    autoFocus
                />
            }
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
