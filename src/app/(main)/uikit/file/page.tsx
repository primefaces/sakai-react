'use client';

import React, { useRef } from 'react';
import {
    FileUpload,
    FileUploadSelectEvent,
} from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileDemo = () => {
    const toast = useRef<Toast | null>(null);

    const onUpload = (event:FileUploadSelectEvent) => {
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: event.files + ' Uploaded',
            life: 3000
        });
    };

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <form>
                        <FileUpload name="cenk1" url="/api/upload" onSelect={onUpload} multiple accept="*" maxFileSize={1000000} />

                        <h5>Basic</h5>
                        <FileUpload mode="basic" name="cenk2" url="/api/upload" maxFileSize={1000000} onSelect={onUpload} />

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileDemo;
