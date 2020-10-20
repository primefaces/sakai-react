import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';

export function FileDemo() {

    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    const onBasicUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }

    return (
        <div>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card">
                        <h5>Advanced</h5>
                        <FileUpload name="demo[]" url="./upload.php" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000}
                            emptyTemplate={<p className="p-m-0"></p>} />
                        <h5>Basic</h5>
                        <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" maxFileSize={1000000} onUpload={onBasicUpload} />
                    </div>
                </div>
            </div>
        </div>
    )
}