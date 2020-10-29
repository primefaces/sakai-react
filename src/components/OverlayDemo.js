import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../service/ProductService';
import './OverlayDemo.scss';


export function OverlayDemo() {

    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [position, setPosition] = useState('center');

    const [visibleLeft, setVisibleLeft] = useState(false);
    const [visibleRight, setVisibleRight] = useState(false);
    const [visibleTop, setVisibleTop] = useState(false);
    const [visibleBottom, setVisibleBottom] = useState(false);
    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const [visibleCustomToolbar, setVisibleCustomToolbar] = useState(false);

    const [products, setProducts] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productService = new ProductService();
    const op = useRef(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
    const opImg = useRef(null)

    const [saveBtnTooltipText, setSaveBtnTooltipText] = useState('Click to proceed');

    useEffect(() => {
        isMounted.current = true;
        productService.getProductsSmall().then(data => setProducts(data));
    }, [productService]);

    useEffect(() => {
        if (isMounted.current) {
            op.current.hide();
            toast.current.show({ severity: 'info', summary: 'Product Selected', life: 3000 });
        }
    }, [selectedProduct]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const onProductSelect = (e) => {
        setSelectedProduct(e.value);
    }

    const imageBody = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
    }

    const priceBody = (rowData) => {
        return formatCurrency(rowData.price);
    }


    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayConfirmation': setDisplayConfirmation,
    }

    const customIcons = (
        <React.Fragment>
            <button className="p-sidebar-icon p-link p-mr-1">
                <span className="pi pi-print" />
            </button>
            <button className="p-sidebar-icon p-link p-mr-1">
                <span className="pi pi-arrow-right" />
            </button>
        </React.Fragment>
    );

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
            </div>
        );
    }

    return (
        <div className="p-grid overlay-demo">
            <div className="p-col-12 p-lg-6">
                <div className="card p-fluid">
                    <h5>Dialog</h5>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Button label="Show" icon="pi pi-external-link" onClick={() => onClick('displayBasic')} />
                        </div>
                    </div>
                    <Dialog header="Header" visible={displayBasic} style={{ width: '30vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </Dialog>
                </div>
                <div className="card p-fluid">
                    <h5>Overlay Panel</h5>
                    <div className="p-grid p-formgrid">
                        <div className="p-col-6">
                            <Button type="button" label="Image" onClick={(e) => opImg.current.toggle(e)} className="p-button-success" />
                            <OverlayPanel ref={opImg} showCloseIcon>
                                <img src="assets/demo/images/nature/nature2.jpg" alt="nature.2jpg" />
                            </OverlayPanel>
                        </div>
                        <div className="p-col-6">

                            <Toast ref={toast} />

                            <Button type="button" label="DataTable" onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="p-button-success select-product-button" />

                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                                <DataTable value={products} selectionMode="single" paginator rows={5}
                                    selection={selectedProduct} onSelectionChange={onProductSelect}>
                                    <Column field="name" header="Name" sortable />
                                    <Column header="Image" body={imageBody} />
                                    <Column field="price" header="Price" sortable body={priceBody} />
                                </DataTable>
                            </OverlayPanel>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-lg-6">
                <div className="card p-fluid">
                    <h5>Confirmation</h5>
                    <Button label="Confirm" icon="pi pi-trash" className="p-button-danger" onClick={() => onClick('displayConfirmation')} />
                    <Dialog header="Confirmation" visible={displayConfirmation} modal style={{ width: '350px' }} footer={renderFooter('displayConfirmation')} onHide={() => onHide('displayConfirmation')}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to proceed?</span>
                        </div>
                    </Dialog>
                </div>
                <div className="card">
                    <h5>Sidebar</h5>
                    <Sidebar visible={visibleLeft} baseZIndex={1000000} onHide={() => setVisibleLeft(false)}>
                        <h1 style={{ fontWeight: 'normal' }}>Left Sidebar</h1>
                        <Button type="button" onClick={() => setVisibleLeft(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleLeft(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Sidebar visible={visibleRight} position="right" baseZIndex={1000000} onHide={() => setVisibleRight(false)}>
                        <h1 style={{ fontWeight: 'normal' }}>Right Sidebar</h1>
                        <Button type="button" onClick={() => setVisibleRight(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleRight(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Sidebar visible={visibleTop} position="top" baseZIndex={1000000} onHide={() => setVisibleTop(false)}>
                        <h1 style={{ fontWeight: 'normal' }}>Top Sidebar</h1>
                        <Button type="button" onClick={() => setVisibleTop(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleTop(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Sidebar visible={visibleBottom} position="bottom" baseZIndex={1000000} onHide={() => setVisibleBottom(false)}>
                        <h1 style={{ fontWeight: 'normal' }}>Bottom Sidebar</h1>
                        <Button type="button" onClick={() => setVisibleBottom(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleBottom(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Sidebar visible={visibleFullScreen} fullScreen baseZIndex={1000000} onHide={() => setVisibleFullScreen(false)}>
                        <h1 style={{ fontWeight: 'normal' }}>Full Screen Sidebar</h1>
                        <Button type="button" onClick={() => setVisibleFullScreen(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleFullScreen(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Sidebar visible={visibleCustomToolbar} baseZIndex={1000000} onHide={() => setVisibleCustomToolbar(false)} icons={customIcons}>
                        <h1 style={{ fontWeight: 'normal' }}>Sidebar with custom icons</h1>
                        <Button type="button" onClick={() => setVisibleCustomToolbar(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                        <Button type="button" onClick={() => setVisibleCustomToolbar(false)} label="Cancel" className="p-button-secondary" />
                    </Sidebar>

                    <Button icon="pi pi-arrow-right" onClick={() => setVisibleLeft(true)} style={{ marginRight: '.25em' }} className="p-button-warning" />
                    <Button icon="pi pi-arrow-left" onClick={() => setVisibleRight(true)} style={{ marginRight: '.25em' }} className="p-button-warning" />
                    <Button icon="pi pi-arrow-down" onClick={() => setVisibleTop(true)} style={{ marginRight: '.25em' }} className="p-button-warning" />
                    <Button icon="pi pi-arrow-up" onClick={() => setVisibleBottom(true)} style={{ marginRight: '.25em' }} className="p-button-warning" />
                    <Button icon="pi pi-external-link" onClick={() => setVisibleFullScreen(true)} style={{ marginRight: '.25em' }} className="p-button-warning" />
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h5>Tooltip</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field">
                            <InputText type="text" placeholder="Username" tooltip="Your username" />
                        </div>
                        <Button type="button" label="Save" icon="pi pi-check" tooltip={saveBtnTooltipText} onClick={() => setSaveBtnTooltipText('Completed')} />
                    </div>
                </div>
            </div>
        </div>
    )
}
