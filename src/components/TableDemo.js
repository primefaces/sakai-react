import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { ProductService } from '../service/ProductService';
import { CustomerService } from '../service/CustomerService';

export const TableDemo = () => {

    const [customer1, setCustomer1] = useState(null);
    const [customer2, setCustomer2] = useState(null);
    const [customer3, setCustomer3] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [globalFilter2, setGlobalFilter2] = useState('');
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [products, setProducts] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        const customerService = new CustomerService();
        const productService = new ProductService();
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
        customerService.getCustomersMedium().then(data => { setCustomer1(data); setLoading1(false) });
        customerService.getCustomersMedium().then(data => { setCustomer2(data); setLoading2(false) });
        customerService.getCustomersMedium().then(data => setCustomer3(data));
    }, []);

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };

    const expandAll = () => {
        let _expandedRows = {}
        products.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
        toast.current.show({ severity: 'success', summary: 'All Rows Expanded', life: 3000 });
    };

    const collapseAll = () => {
        setExpandedRows(null);
        toast.current.show({ severity: 'success', summary: 'All Rows Collapsed', life: 3000 });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (customer3) {
            for (let customer of customer3) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    const customer1TableHeader = (
        <div className="table-header">
            List of Customers
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter1} onChange={(e) => setGlobalFilter1(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const customer2TableHeader = (
        <div className="table-header">
            List of Customers
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter2} onChange={(e) => setGlobalFilter2(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    const countryBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Country</span>
                <img src="assets/demo/images/flags/flag_placeholder.png" alt={data.country.name} className={`flag flag-${data.country.code}`} width={30} height={20} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.country.name}</span>
            </>
        );
    };

    const representativeBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Representative</span>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${data.status}`}>{data.status}</span>
            </>
        )
    };

    const activityBody = (data) => {
        return (
            <>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={data.activity} showValue={false} />
            </>
        )
    };

    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;

    const productsTableHeader = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="p-mr-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
        </div>
    );

    const imageBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${data.image}`} alt={data.image} className="product-image" />
            </>
        );
    };

    const priceBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(data.price)}
            </>
        );
    };

    const reviewsBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={data.rating} readonly cancel={false} />
            </>
        );
    };

    const productStatusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
            </>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders}>
                    <Column field="id" header="Id" sortable body={bodyTemplate}></Column>
                    <Column field="customer" header="Customer" sortable body={bodyTemplate}></Column>
                    <Column field="date" header="Date" sortable body={bodyTemplate}></Column>
                    <Column field="amount" header="Amount" sortable body={bodyTemplate}></Column>
                    <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                    <Column headerStyle={{ width: '4rem' }} body={() => <Button icon="pi pi-search" />}></Column>
                </DataTable>
            </div>
        );
    };

    const headerRowGroup = (data) => {
        return (
            <>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const footerRowGroup = (data) => {
        return (
            <>
                <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Customers:</strong></td>
                <td><strong>{calculateCustomerTotal(data.representative.name)}</strong></td>
            </>
        )
    };

    return (
        <div className="p-grid table-demo">
            <div className="p-col-12">
                <div className="card">
                    <h5>Default</h5>
                    <p>Pagination, sorting, filtering and checkbox selection.</p>
                    <DataTable value={customer1} paginator className="p-datatable-customers" rows={10} dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                        globalFilter={globalFilter1} emptyMessage="No customers found." loading={loading1} header={customer1TableHeader}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column field="country.name" header="Country" sortable body={countryBodyTemplate}></Column>
                        <Column field="representative.name" header="Representative" sortable body={representativeBodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={bodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="activity" header="Activity" sortable body={activityBody}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h5>Customized</h5>
                    <p>Scrollable table with gridlines (<mark>.p-datatable-gridlines</mark>), striped rows (<mark>.p-datatable-striped</mark>) and smaller paddings (<mark>p-datatable-sm</mark>).</p>
                    <DataTable value={customer2} scrollable scrollHeight="600px" className="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-customers" dataKey="id" rowHover
                        globalFilter={globalFilter2} emptyMessage="No customers found." loading={loading2} header={customer2TableHeader}>
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column field="country.name" header="Country" sortable body={countryBodyTemplate}></Column>
                        <Column field="representative.name" header="Representative" sortable body={representativeBodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={bodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="activity" header="Activity" sortable body={activityBody}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="p-col-12">
                <div className="card">
                    <h5>Row Expand</h5>

                    <Toast ref={toast} />
                    <DataTable value={products} expandedRows={expandedRows} className="p-datatable-customers" dataKey="id" onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                        header={productsTableHeader} rowExpansionTemplate={rowExpansionTemplate}>
                        <Column expander headerStyle={{ width: '3rem' }} />
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" sortable body={priceBodyTemplate}></Column>
                        <Column field="category" header="Category" sortable body={bodyTemplate}></Column>
                        <Column field="rating" header="Reviews" sortable body={reviewsBodyTemplate}></Column>
                        <Column field="inventoryStatus" header="Status" sortable body={productStatusBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="p-col-12">
                <div className="card">
                    <h5>Row Group</h5>
                    <DataTable value={customer3} rowGroupMode="subheader" className="p-datatable-customers" groupField="representative.name" sortMode="single" sortField="representative.name" sortOrder={1}
                        rowGroupHeaderTemplate={headerRowGroup} rowGroupFooterTemplate={footerRowGroup}>
                        <Column field="representative.name" header="Representative"></Column>
                        <Column field="name" header="Name" body={bodyTemplate}></Column>
                        <Column field="country" header="Country" body={countryBodyTemplate}></Column>
                        <Column field="company" header="Company" body={bodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="date" header="Date" body={bodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    )
}
