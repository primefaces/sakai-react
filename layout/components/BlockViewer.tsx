import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';

interface BlockViewerProps {
    header: string;
    code: string;
    new?: boolean;
    free?: boolean;
    containerClassName?: string;
    previewStyle?: React.CSSProperties;
    children: React.ReactNode;
}

const BlockViewer = (props: BlockViewerProps) => {
    const [blockView, setBlockView] = useState('PREVIEW');
    const actionCopyRef = useRef(null);

    const copyCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
        await navigator.clipboard.writeText(props.code);
        event.preventDefault();
    };

    return (
        <div className="block-viewer">
            <div className="block-section">
                <div className="block-header">
                    <span className="block-title">
                        <span>{props.header}</span>
                        {props.new && <span className="badge-new">New</span>}
                        {props.free && <span className="badge-free">Free</span>}
                    </span>
                    <div className="block-actions">
                        <button tabIndex={0} className={classNames('p-link', { 'block-action-active': blockView === 'PREVIEW' })} onClick={() => setBlockView('PREVIEW')}>
                            <span>Preview</span>
                        </button>
                        <button className={classNames('p-link', { 'block-action-active': blockView === 'CODE' })} onClick={() => setBlockView('CODE')}>
                            <span>Code</span>
                        </button>
                        <button ref={actionCopyRef} tabIndex={0} className="p-link block-action-copy" onClick={copyCode}>
                            <i className="pi pi-copy"></i>
                        </button>
                        <Tooltip target={actionCopyRef as any} position="bottom" content="Copied to clipboard" event="focus" />
                    </div>
                </div>
                <div className="block-content">
                    {blockView === 'PREVIEW' && (
                        <div className={props.containerClassName} style={props.previewStyle}>
                            {props.children}
                        </div>
                    )}

                    {blockView === 'CODE' && (
                        <pre className="app-code">
                            <code>{props.code}</code>
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockViewer;
