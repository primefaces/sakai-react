import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProductService } from '../service/ProductService';
import { CustomerService } from '../service/CustomerService';
import './TableDemo.scss';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';

export function TableDemo() {

    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedRepresentatives, setSelectedRepresentatives] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dt = useRef(null);
    const representatives = [
        { name: "Amy Elsner", image: 'amyelsner.png' },
        { name: "Anna Fali", image: 'annafali.png' },
        { name: "Asiya Javayant", image: 'asiyajavayant.png' },
        { name: "Bernardo Dominic", image: 'bernardodominic.png' },
        { name: "Elwin Sharvill", image: 'elwinsharvill.png' },
        { name: "Ioni Bowcher", image: 'ionibowcher.png' },
        { name: "Ivan Magalhaes", image: 'ivanmagalhaes.png' },
        { name: "Onyama Limba", image: 'onyamalimba.png' },
        { name: "Stephen Shaw", image: 'stephenshaw.png' },
        { name: "XuXue Feng", image: 'xuxuefeng.png' }
    ];

    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];


    const [products, setProducts] = useState([]);
    const [customersRowGroup, setCustomersRowGroup] = useState([]);

    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
    const productService = new ProductService();
    const customerService = new CustomerService();

    useEffect(() => {
        if (isMounted.current) {
            const summary = expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed';
            toast.current.show({ severity: 'success', summary: `${summary}`, life: 3000 });
        }
    }, [expandedRows]);

    useEffect(() => {
        isMounted.current = true;
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
        customerService.getCustomersMedium().then(data => setCustomersRowGroup(data));
        customerService.getCustomersLarge().then(data => {
            setCustomers(data)
        });
    }, []);

    const renderHeader = () => {
        return (
            <div className="table-header">
                List of Customers
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" />
                </span>
            </div>
        );
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={false} />
            </React.Fragment>
        );
    }

    const actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={classNames('customer-badge', 'status-' + rowData.status)}>{rowData.status}</span>
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const countryBodyTemplate = (rowData) => {
        let { name, code } = rowData.country;

        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <img src="assets/layout/flags/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={name} className={classNames('flag', 'flag-' + code)} />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{name}</span>
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
        const src = "assets/demo/images/avatar/" + rowData.representative.image;

        return (
            <React.Fragment>
                <span className="p-column-title">Representative</span>
                <img alt={rowData.representative.name} src={src} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{rowData.representative.name}</span>
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    const renderRepresentativeFilter = () => {
        return (
            <MultiSelect className="p-column-filter" value={selectedRepresentatives} options={representatives}
                onChange={onRepresentativeFilterChange} itemTemplate={representativeItemTemplate} placeholder="All" optionLabel="name" optionValue="name" />
        );
    }

    const representativeItemTemplate = (option) => {
        const src = "assets/demo/images/avatar/" + option.image;

        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={src} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{option.name}</span>
            </div>
        );
    }

    const onRepresentativeFilterChange = (event) => {
        dt.current.filter(event.value, 'representative.name', 'in');
        setSelectedRepresentatives(event.value);
    }

    const renderDateFilter = () => {
        return (
            <Calendar value={dateFilter} onChange={onDateFilterChange} placeholder="Registration Date" dateFormat="yy-mm-dd" className="p-column-filter" />
        );
    }

    const onDateFilterChange = (event) => {
        if (event.value !== null)
            dt.current.filter(formatDate(event.value), 'date', 'equals');
        else
            dt.current.filter(null, 'date', 'equals');

        setDateFilter(event.value);
    }

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    const renderStatusFilter = () => {
        return (
            <Dropdown value={selectedStatus} options={statuses} onChange={onStatusFilterChange}
                itemTemplate={statusItemTemplate} showClear placeholder="Select a Status" className="p-column-filter" />
        );
    }

    const statusItemTemplate = (option) => {
        return (
            <span className={classNames('customer-badge', 'status-' + option)}>{option}</span>
        );
    }

    const onStatusFilterChange = (event) => {
        dt.current.filter(event.value, 'status', 'equals');
        setSelectedStatus(event.value);
    }

    const headerDataTable = renderHeader();
    const representativeFilterElement = renderRepresentativeFilter();
    const dateFilterElement = renderDateFilter();
    const statusFilterElement = renderStatusFilter();

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    }

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    }

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`assets/demo/images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readonly cancel={false} />;
    }

    const statusBodyTemplate3 = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders}>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    }

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="p-mr-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
        </div>
    );

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="image-text">{data.representative.name}</span>
            </React.Fragment>
        );
    }

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="4" style={{ textAlign: 'right' }}>Total Customers</td>
                <td>{calculateCustomerTotal(data.representative.name)}</td>
            </React.Fragment>
        );
    }

    const countryBodyTemplateRow = (rowData) => {
        return (
            <React.Fragment>
                <img alt={rowData.country.name} src={`assets/layout/flags/flag_placeholder.png`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData.country.code}`} width="30" />
                <span className="image-text">{rowData.country.name}</span>
            </React.Fragment>
        );
    }

    const statusBodyTemplate4 = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    }

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (customersRowGroup) {
            for (let customer of customersRowGroup) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">
                    <h4>Default</h4>
                    <p>Pagination, sorting, filtering and checkbox selection.</p>
                    <div className="datatable-doc-demo">
                        <DataTable ref={dt} value={customers}
                            header={headerDataTable} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                            selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                            paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                            <Column field="name" header="Name" body={nameBodyTemplate} sortable filterPlaceholder="Search by name" />
                            <Column sortField="country.name" filterField="country.name" header="Country" body={countryBodyTemplate} sortable filterMatchMode="contains" filterPlaceholder="Search by country" />
                            <Column sortField="representative.name" filterField="representative.name" header="Representative" body={representativeBodyTemplate} sortable filterElement={representativeFilterElement} />
                            <Column field="date" header="Date" body={dateBodyTemplate} sortable filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement} />
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable filterElement={statusFilterElement} />
                            <Column field="activity" header="Activity" body={activityBodyTemplate} sortable filterMatchMode="gte" filterPlaceholder="Minimum" />
                            <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h4>Customized</h4>
                    <p>Scrollable table with gridlines (<mark>.p-datatable-gridlines</mark>), striped rows (<mark>.p-datatable-striped</mark>) and smaller paddings (<mark>p-datatable-sm</mark>).</p>
                    <div className="datatable-doc-demo">
                        <DataTable ref={dt} value={customers}
                            header={headerDataTable} className="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                            selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                            paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                            <Column field="name" header="Name" body={nameBodyTemplate} sortable fiterPlaceholder="Search by name" />
                            <Column sortField="country.name" filterField="country.name" header="Country" body={countryBodyTemplate} sortable filterMatchMode="contains" filterPlaceholder="Search by country" />
                            <Column sortField="representative.name" filterField="representative.name" header="Representative" body={representativeBodyTemplate} sortable filterElement={representativeFilterElement} />
                            <Column field="date" header="Date" body={dateBodyTemplate} sortable filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement} />
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable filterElement={statusFilterElement} />
                            <Column field="activity" header="Activity" body={activityBodyTemplate} sortable filterMatchMode="gte" filterPlaceholder="Minimum" />
                            <Column body={actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h4>Row Expand</h4>
                    <div className="row-expand-demo">
                        <Toast ref={toast} />
                        <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                            onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                            rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                            <Column expander style={{ width: '3em' }} />
                            <Column field="name" header="Name" sortable />
                            <Column header="Image" body={imageBodyTemplate} />
                            <Column field="price" header="Price" sortable body={priceBodyTemplate} />
                            <Column field="category" header="Category" sortable />
                            <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} />
                            <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate3} />
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h4>Row Group</h4>
                    <div className="datatable-rowgroup-demo">
                        <DataTable value={customersRowGroup} rowGroupMode="subheader" groupField="representative.name"
                            sortMode="single" sortField="representative.name" sortOrder={1}
                            rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate}>
                            <Column field="name" header="Name"></Column>
                            <Column field="country" header="Country" body={countryBodyTemplateRow}></Column>
                            <Column field="company" header="Company"></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate4}></Column>
                            <Column field="date" header="Date"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}