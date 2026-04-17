/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Demo.Product[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number | null>(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Demo.Product>>(null);

    const categories = ['Accessories', 'Clothing', 'Electronics', 'Fitness'];
    const inventoryStatuses = ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'];
    const priceOptions = [
        { label: 'All Prices', value: null },
        { label: 'Under $50', value: 50 },
        { label: 'Under $100', value: 100 },
        { label: 'Under $200', value: 200 },
        { label: 'Under $500', value: 500 }
    ];

    useEffect(() => {
        initFilters();
        setLoading(true);
        ProductService.getProducts().then((data) => {
            setProducts(data as Demo.Product[]);
            setLoading(false);
        });
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
            },
            category: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.IN }]
            },
            price: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.LTE }]
            },
            inventoryStatus: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.IN }]
            }
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const stats = useMemo(() => {
        const total = products.length;
        const inStock = products.filter((p) => p.inventoryStatus === 'INSTOCK').length;
        const lowStock = products.filter((p) => p.inventoryStatus === 'LOWSTOCK').length;
        const outOfStock = products.filter((p) => p.inventoryStatus === 'OUTOFSTOCK').length;
        return { total, inStock, lowStock, outOfStock };
    }, [products]);

    const filteredCount = useMemo(() => {
        if (loading) return 0;
        let count = products.length;
        if (selectedCategories.length > 0) {
            count = products.filter((p) => p.category && selectedCategories.includes(p.category)).length;
        }
        if (selectedStatuses.length > 0) {
            count = products.filter((p) => p.inventoryStatus && selectedStatuses.includes(p.inventoryStatus)).length;
        }
        if (priceRange !== null) {
            count = products.filter((p) => (p.price || 0) <= priceRange).length;
        }
        return count;
    }, [products, selectedCategories, selectedStatuses, priceRange, loading]);

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Accessories':
                return 'pi pi-star';
            case 'Clothing':
                return 'pi pi-shopping-bag';
            case 'Electronics':
                return 'pi pi-mobile';
            case 'Fitness':
                return 'pi pi-heart';
            default:
                return 'pi pi-box';
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedStatuses([]);
        setPriceRange(null);
        setGlobalFilter('');
        initFilters();
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedStatuses.length > 0 || priceRange !== null;

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Product List</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search products..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    const getFilteredProducts = () => {
        let filtered = [...products];
        
        if (globalFilter) {
            const filter = globalFilter.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.name && p.name.toLowerCase().includes(filter)) ||
                    (p.code && p.code.toLowerCase().includes(filter)) ||
                    (p.category && p.category.toLowerCase().includes(filter))
            );
        }
        
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((p) => p.category && selectedCategories.includes(p.category));
        }
        
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter((p) => p.inventoryStatus && selectedStatuses.includes(p.inventoryStatus));
        }
        
        if (priceRange !== null) {
            filtered = filtered.filter((p) => (p.price || 0) <= priceRange);
        }
        
        return filtered;
    };

    const emptyTemplate = () => {
        if (loading) {
            return (
                <div className="flex flex-column align-items-center justify-content-center py-8">
                    <div className="flex flex-column align-items-center">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                        <h3 className="text-xl font-semibold mb-2">Loading products...</h3>
                        <p className="text-color-secondary">Please wait while we fetch your products</p>
                    </div>
                </div>
            );
        }
        
        const hasFilters = selectedCategories.length > 0 || selectedStatuses.length > 0 || priceRange !== null || globalFilter;
        
        if (hasFilters) {
            return (
                <div className="flex flex-column align-items-center justify-content-center py-8">
                    <div className="flex flex-column align-items-center text-center">
                        <div 
                            className="flex align-items-center justify-content-center mb-4"
                            style={{ 
                                width: '6rem', 
                                height: '6rem', 
                                backgroundColor: 'var(--surface-ground)',
                                borderRadius: '50%'
                            }}
                        >
                            <i className="pi pi-search" style={{ fontSize: '2.5rem', color: 'var(--text-color-secondary)' }}></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-color-secondary mb-4 max-w-md">
                            We couldn't find any products matching your current filters. 
                            Try adjusting your search criteria or clear all filters to see all products.
                        </p>
                        <div className="flex gap-3">
                            <Button label="Clear All Filters" icon="pi pi-filter-slash" text onClick={clearAllFilters} />
                            <Button label="Add Product" icon="pi pi-plus" severity="success" onClick={openNew} />
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="flex flex-column align-items-center justify-content-center py-8">
                <div className="flex flex-column align-items-center text-center">
                    <div 
                        className="flex align-items-center justify-content-center mb-4"
                        style={{ 
                            width: '6rem', 
                            height: '6rem', 
                            backgroundColor: 'var(--surface-ground)',
                            borderRadius: '50%'
                        }}
                    >
                        <i className="pi pi-box" style={{ fontSize: '2.5rem', color: 'var(--text-color-secondary)' }}></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                    <p className="text-color-secondary mb-4 max-w-md">
                        Your product inventory is currently empty. 
                        Get started by adding your first product to begin managing your inventory.
                    </p>
                    <div className="flex flex-column align-items-center gap-3">
                        <Button label="Add Your First Product" icon="pi pi-plus" severity="success" onClick={openNew} />
                        <p className="text-sm text-color-secondary">
                            <i className="pi pi-info-circle mr-1"></i>
                            You can also import products from a CSV file
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const toggleStatusFilter = (status: string | null) => {
        if (status === null) {
            setSelectedStatuses([]);
        } else {
            if (selectedStatuses.includes(status)) {
                setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
            } else {
                setSelectedStatuses([...selectedStatuses, status]);
            }
        }
    };

    const isStatusSelected = (status: string) => {
        return selectedStatuses.includes(status);
    };

    const statsCardTemplate = (title: string, value: number, icon: string, bgColor: string, iconColor: string, status: string | null = null) => {
        const isSelected = status !== null ? isStatusSelected(status) : selectedStatuses.length === 0;
        
        if (loading) {
            return (
                <div className="card mb-0 cursor-pointer">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <Skeleton width="100px" height="1.25rem" className="mb-2" />
                            <Skeleton width="60px" height="1.5rem" />
                        </div>
                        <Skeleton shape="circle" size="2.5rem" />
                    </div>
                    <Skeleton width="120px" height="1rem" />
                </div>
            );
        }
        
        return (
            <div 
                className={`card mb-0 cursor-pointer transition-all duration-200 ${isSelected ? 'shadow-4' : 'hover:shadow-3'}`}
                onClick={() => toggleStatusFilter(status)}
                style={{ border: isSelected ? '2px solid var(--primary-color)' : 'none' }}
            >
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center ${bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`pi ${icon} ${iconColor} text-xl`} />
                    </div>
                </div>
                <div className="flex align-items-center">
                    <span className="text-sm text-color-secondary">
                        {isSelected ? 'Active filter' : 'Click to filter'}
                    </span>
                </div>
            </div>
        );
    };

    const removeCategoryFilter = (category: string) => {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
    };

    const removeStatusFilter = (status: string) => {
        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    };

    const removePriceFilter = () => {
        setPriceRange(null);
    };

    const removeSearchFilter = () => {
        setGlobalFilter('');
    };

    const filterTagsTemplate = () => {
        const tags = [];
        
        selectedCategories.forEach((cat) => {
            tags.push(
                <Tag
                    key={`cat-${cat}`}
                    value={cat}
                    severity="info"
                    rounded
                    className="mr-2 mb-2"
                    icon={getCategoryIcon(cat)}
                    onRemove={() => removeCategoryFilter(cat)}
                    removable
                />
            );
        });
        
        selectedStatuses.forEach((status) => {
            tags.push(
                <Tag
                    key={`status-${status}`}
                    value={status}
                    severity={getStatusSeverity(status)}
                    rounded
                    className="mr-2 mb-2"
                    onRemove={() => removeStatusFilter(status)}
                    removable
                />
            );
        });
        
        if (priceRange !== null) {
            tags.push(
                <Tag
                    key="price"
                    value={`Under $${priceRange}`}
                    severity="warning"
                    rounded
                    className="mr-2 mb-2"
                    icon="pi pi-dollar"
                    onRemove={removePriceFilter}
                    removable
                />
            );
        }
        
        if (globalFilter) {
            tags.push(
                <Tag
                    key="search"
                    value={`Search: "${globalFilter}"`}
                    severity="secondary"
                    rounded
                    className="mr-2 mb-2"
                    icon="pi pi-search"
                    onRemove={removeSearchFilter}
                    removable
                />
            );
        }
        
        return tags;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Total Products', stats.total, 'pi pi-box', 'bg-blue-100', 'text-blue-500', null)}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('In Stock', stats.inStock, 'pi pi-check-circle', 'bg-green-100', 'text-green-500', 'INSTOCK')}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Low Stock', stats.lowStock, 'pi pi-exclamation-triangle', 'bg-yellow-100', 'text-yellow-500', 'LOWSTOCK')}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Out of Stock', stats.outOfStock, 'pi pi-times-circle', 'bg-red-100', 'text-red-500', 'OUTOFSTOCK')}
            </div>

            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <div className="mb-4 p-4 surface-ground border-round">
                        <div className="flex flex-wrap gap-3 align-items-center">
                            <div className="flex flex-wrap gap-2 flex-grow-1">
                                <div className="flex flex-column">
                                    <label className="text-sm font-medium mb-1">Category</label>
                                    <MultiSelect
                                        value={selectedCategories}
                                        options={categories}
                                        onChange={(e) => setSelectedCategories(e.value)}
                                        placeholder="All Categories"
                                        maxSelectedLabels={1}
                                        className="w-16rem"
                                        showClear
                                    />
                                </div>
                                <div className="flex flex-column">
                                    <label className="text-sm font-medium mb-1">Status</label>
                                    <MultiSelect
                                        value={selectedStatuses}
                                        options={inventoryStatuses}
                                        onChange={(e) => setSelectedStatuses(e.value)}
                                        placeholder="All Statuses"
                                        maxSelectedLabels={1}
                                        className="w-14rem"
                                        showClear
                                    />
                                </div>
                                <div className="flex flex-column">
                                    <label className="text-sm font-medium mb-1">Price Range</label>
                                    <Dropdown
                                        value={priceRange}
                                        options={priceOptions}
                                        onChange={(e) => setPriceRange(e.value)}
                                        placeholder="All Prices"
                                        className="w-14rem"
                                        showClear
                                    />
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    label="Clear Filters"
                                    icon="pi pi-filter-slash"
                                    text
                                    onClick={clearAllFilters}
                                    className="mt-1"
                                />
                            )}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <div className="mb-4 flex align-items-center">
                            <i className="pi pi-filter-fill mr-2 text-primary"></i>
                            <span className="text-sm text-color-secondary mr-3">Active Filters:</span>
                            <div className="flex flex-wrap align-items-center">
                                {filterTagsTemplate()}
                            </div>
                            <span className="ml-auto text-sm text-color-secondary">
                                Showing {getFilteredProducts().length} of {products.length} products
                            </span>
                        </div>
                    )}

                    <DataTable
                        ref={dt}
                        value={getFilteredProducts()}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage=" "
                        emptyMessageTemplate={emptyTemplate}
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
                        <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
