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
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [quantityFilter, setQuantityFilter] = useState<string | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);
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
    const ratingOptions = [
        { label: 'All Ratings', value: null },
        { label: '5 Stars', value: 5 },
        { label: '4 Stars & Up', value: 4 },
        { label: '3 Stars & Up', value: 3 },
        { label: '2 Stars & Up', value: 2 },
        { label: '1 Star & Up', value: 1 }
    ];
    const quantityOptions = [
        { label: 'All Quantities', value: null },
        { label: 'In Stock (Qty > 0)', value: 'instock' },
        { label: 'Low Stock (Qty < 10)', value: 'low' },
        { label: 'Out of Stock (Qty = 0)', value: 'out' }
    ];

    const quickFilters = [
        { label: 'All Products', value: 'all', icon: 'pi pi-box' },
        { label: 'In Stock', value: 'instock', icon: 'pi pi-check-circle' },
        { label: 'Low Stock', value: 'lowstock', icon: 'pi pi-exclamation-triangle' },
        { label: 'Out of Stock', value: 'outofstock', icon: 'pi pi-times-circle' }
    ];

    const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');

    useEffect(() => {
        initFilters();
        loadProducts();
    }, [refreshCount]);

    const loadProducts = useCallback(() => {
        setLoading(true);
        ProductService.getProducts().then((data) => {
            setProducts(data as Demo.Product[]);
            setLoading(false);
            setLastUpdated(new Date());
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

    const getFilteredProducts = useCallback(() => {
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
        
        if (ratingFilter !== null) {
            filtered = filtered.filter((p) => (p.rating || 0) >= ratingFilter);
        }
        
        if (quantityFilter) {
            switch (quantityFilter) {
                case 'instock':
                    filtered = filtered.filter((p) => (p.quantity || 0) > 0);
                    break;
                case 'low':
                    filtered = filtered.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 10);
                    break;
                case 'out':
                    filtered = filtered.filter((p) => (p.quantity || 0) === 0);
                    break;
            }
        }
        
        if (activeQuickFilter !== 'all') {
            switch (activeQuickFilter) {
                case 'instock':
                    filtered = filtered.filter((p) => p.inventoryStatus === 'INSTOCK');
                    break;
                case 'lowstock':
                    filtered = filtered.filter((p) => p.inventoryStatus === 'LOWSTOCK');
                    break;
                case 'outofstock':
                    filtered = filtered.filter((p) => p.inventoryStatus === 'OUTOFSTOCK');
                    break;
            }
        }
        
        return filtered;
    }, [products, globalFilter, selectedCategories, selectedStatuses, priceRange, ratingFilter, quantityFilter, activeQuickFilter]);

    const filteredCount = useMemo(() => {
        if (loading) return 0;
        return getFilteredProducts().length;
    }, [loading, getFilteredProducts]);

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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'INSTOCK':
                return 'In Stock';
            case 'LOWSTOCK':
                return 'Low Stock';
            case 'OUTOFSTOCK':
                return 'Out of Stock';
            default:
                return status;
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
        setRatingFilter(null);
        setQuantityFilter(null);
        setActiveQuickFilter('all');
        initFilters();
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedStatuses.length > 0 || priceRange !== null || 
                           ratingFilter !== null || quantityFilter !== null || activeQuickFilter !== 'all';

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
        toast.current?.show({
            severity: 'info',
            summary: 'Export Started',
            detail: 'Exporting products to CSV...',
            life: 2000
        });
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
                <Button 
                    label="Refresh" 
                    icon="pi pi-refresh" 
                    className="mr-2" 
                    onClick={() => setRefreshCount(prev => prev + 1)}
                    loading={loading}
                    text
                />
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
                <div className="flex align-items-center">
                    <span className="font-medium">{rowData.name}</span>
                    {rowData.quantity && rowData.quantity < 10 && rowData.quantity > 0 && (
                        <Badge value="Low" severity="warning" className="ml-2" style={{ fontSize: '0.6rem' }} />
                    )}
                    {rowData.quantity === 0 && (
                        <Badge value="Out" severity="danger" className="ml-2" style={{ fontSize: '0.6rem' }} />
                    )}
                </div>
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
                <div className="flex align-items-center">
                    <i className={`${getCategoryIcon(rowData.category || '')} mr-2 text-color-secondary`}></i>
                    {rowData.category}
                </div>
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <div className="flex align-items-center">
                    <Rating value={rowData.rating} readOnly cancel={false} />
                    <span className="ml-2 text-sm text-color-secondary">({rowData.rating})</span>
                </div>
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <Tag 
                    value={getStatusLabel(rowData.inventoryStatus || '')} 
                    severity={getStatusSeverity(rowData.inventoryStatus || '')}
                />
            </>
        );
    };

    const quantityBodyTemplate = (rowData: Demo.Product) => {
        const qty = rowData.quantity || 0;
        let severity = 'success';
        if (qty === 0) severity = 'danger';
        else if (qty < 10) severity = 'warning';
        
        return (
            <>
                <span className="p-column-title">Quantity</span>
                <Tag value={qty.toString()} severity={severity} />
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <div className="flex align-items-center justify-content-center gap-1">
                    <Button icon="pi pi-eye" rounded severity="info" className="mr-1" onClick={() => toast.current?.show({
                        severity: 'info',
                        summary: 'View Product',
                        detail: `Viewing ${rowData.name}`,
                        life: 2000
                    })} tooltip="View" tooltipOptions={{ position: 'top' }} />
                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-1" onClick={() => editProduct(rowData)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
                    <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} tooltip="Delete" tooltipOptions={{ position: 'top' }} />
                </div>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <div className="flex align-items-center mb-2 md:mb-0">
                <h5 className="m-0 mr-3">Product List</h5>
                {lastUpdated && (
                    <span className="text-sm text-color-secondary">
                        <i className="pi pi-clock mr-1"></i>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    type="search" 
                    value={globalFilter}
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)} 
                    placeholder="Search products..." 
                    className="w-18rem"
                />
                {globalFilter && (
                    <Button 
                        icon="pi pi-times" 
                        text 
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0" 
                        onClick={() => setGlobalFilter('')}
                    />
                )}
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

    const emptyTemplate = () => {
        if (loading) return null;
        
        const hasFilters = hasActiveFilters || globalFilter;
        
        if (hasFilters) {
            return (
                <div className="flex flex-column align-items-center justify-content-center py-8">
                    <div className="surface-ground border-circle p-5 mb-4">
                        <i className="pi pi-search" style={{ fontSize: '3rem', color: 'var(--text-color-secondary)' }}></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-color-secondary mb-4">Try adjusting your filters to find what you're looking for</p>
                    <div className="flex gap-2">
                        <Button label="Clear All Filters" icon="pi pi-filter-slash" text onClick={clearAllFilters} />
                        <Button label="Add New Product" icon="pi pi-plus" severity="success" onClick={openNew} />
                    </div>
                </div>
            );
        }
        
        return (
            <div className="flex flex-column align-items-center justify-content-center py-8">
                <div className="surface-ground border-circle p-5 mb-4">
                    <i className="pi pi-box" style={{ fontSize: '3rem', color: 'var(--text-color-secondary)' }}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                <p className="text-color-secondary mb-4">Get started by adding your first product</p>
                <Button label="Add Product" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const statsCardTemplate = (title: string, value: number, icon: string, bgColor: string, iconColor: string, trend?: string, trendColor?: string) => {
        if (loading) {
            return (
                <div className="card mb-0">
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
            <div className="card mb-0 cursor-pointer hover:shadow-3 transition-shadow" onClick={() => {
                if (title === 'Total Products') setActiveQuickFilter('all');
                else if (title === 'In Stock') setActiveQuickFilter('instock');
                else if (title === 'Low Stock') setActiveQuickFilter('lowstock');
                else if (title === 'Out of Stock') setActiveQuickFilter('outofstock');
            }}>
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-2xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center ${bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`pi ${icon} ${iconColor} text-xl`} />
                    </div>
                </div>
                {trend && (
                    <div className={`flex align-items-center ${trendColor}`}>
                        <i className={`pi ${trend.includes('+') ? 'pi-arrow-up' : 'pi-arrow-down'} mr-1`}></i>
                        <span className="text-sm font-medium">{trend} since last week</span>
                    </div>
                )}
            </div>
        );
    };

    const filterTagsTemplate = () => {
        const tags = [];
        
        if (activeQuickFilter !== 'all') {
            const qf = quickFilters.find(f => f.value === activeQuickFilter);
            tags.push(
                <Tag
                    key="quickfilter"
                    value={qf?.label || activeQuickFilter}
                    severity="info"
                    rounded
                    className="mr-2 mb-2"
                    icon={qf?.icon}
                    removable
                    onRemove={() => setActiveQuickFilter('all')}
                />
            );
        }
        
        selectedCategories.forEach((cat) => {
            tags.push(
                <Tag
                    key={`cat-${cat}`}
                    value={cat}
                    severity="info"
                    rounded
                    className="mr-2 mb-2"
                    icon={getCategoryIcon(cat)}
                    removable
                    onRemove={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}
                />
            );
        });
        
        selectedStatuses.forEach((status) => {
            tags.push(
                <Tag
                    key={`status-${status}`}
                    value={getStatusLabel(status)}
                    severity={getStatusSeverity(status)}
                    rounded
                    className="mr-2 mb-2"
                    removable
                    onRemove={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
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
                    removable
                    onRemove={() => setPriceRange(null)}
                />
            );
        }
        
        if (ratingFilter !== null) {
            tags.push(
                <Tag
                    key="rating"
                    value={`${ratingFilter}+ Stars`}
                    severity="info"
                    rounded
                    className="mr-2 mb-2"
                    icon="pi pi-star"
                    removable
                    onRemove={() => setRatingFilter(null)}
                />
            );
        }
        
        if (quantityFilter) {
            const qtyLabel = quantityOptions.find(o => o.value === quantityFilter)?.label || quantityFilter;
            tags.push(
                <Tag
                    key="quantity"
                    value={qtyLabel}
                    severity="info"
                    rounded
                    className="mr-2 mb-2"
                    icon="pi pi-box"
                    removable
                    onRemove={() => setQuantityFilter(null)}
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
                    removable
                    onRemove={() => setGlobalFilter('')}
                />
            );
        }
        
        return tags;
    };

    const quickFilterTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {quickFilters.map((filter) => (
                    <Button
                        key={filter.value}
                        label={filter.label}
                        icon={filter.icon}
                        severity={activeQuickFilter === filter.value ? 'primary' : 'secondary'}
                        outlined={activeQuickFilter !== filter.value}
                        onClick={() => setActiveQuickFilter(filter.value)}
                        className="p-button-sm"
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Total Products', stats.total, 'pi pi-box', 'bg-blue-100', 'text-blue-500', '+12%', 'text-green-500')}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('In Stock', stats.inStock, 'pi pi-check-circle', 'bg-green-100', 'text-green-500', '+8%', 'text-green-500')}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Low Stock', stats.lowStock, 'pi pi-exclamation-triangle', 'bg-yellow-100', 'text-yellow-500', '-5%', 'text-red-500')}
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                {statsCardTemplate('Out of Stock', stats.outOfStock, 'pi pi-times-circle', 'bg-red-100', 'text-red-500', '-2%', 'text-green-500')}
            </div>

            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {quickFilterTemplate()}

                    <div className="mb-4">
                        <Button
                            label={showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
                            icon={showAdvancedFilters ? 'pi pi-chevron-up' : 'pi pi-filter'}
                            text
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="mb-3"
                        />
                        
                        {showAdvancedFilters && (
                            <div className="p-4 surface-ground border-round">
                                <div className="flex flex-wrap gap-3 align-items-start">
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
                                                filter
                                                showSelectAll
                                            />
                                        </div>
                                        <div className="flex flex-column">
                                            <label className="text-sm font-medium mb-1">Status</label>
                                            <MultiSelect
                                                value={selectedStatuses}
                                                options={inventoryStatuses.map(s => ({ label: getStatusLabel(s), value: s }))}
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
                                        <div className="flex flex-column">
                                            <label className="text-sm font-medium mb-1">Rating</label>
                                            <Dropdown
                                                value={ratingFilter}
                                                options={ratingOptions}
                                                onChange={(e) => setRatingFilter(e.value)}
                                                placeholder="All Ratings"
                                                className="w-14rem"
                                                showClear
                                            />
                                        </div>
                                        <div className="flex flex-column">
                                            <label className="text-sm font-medium mb-1">Quantity</label>
                                            <Dropdown
                                                value={quantityFilter}
                                                options={quantityOptions}
                                                onChange={(e) => setQuantityFilter(e.value)}
                                                placeholder="All Quantities"
                                                className="w-14rem"
                                                showClear
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <Divider className="my-3" />
                                
                                <div className="flex justify-content-between align-items-center">
                                    <div className="flex align-items-center gap-3">
                                        <div className="flex align-items-center">
                                            <Checkbox 
                                                inputId="showOnlyLow" 
                                                onChange={(e) => e.checked ? setQuantityFilter('low') : setQuantityFilter(null)}
                                                checked={quantityFilter === 'low'}
                                            />
                                            <label htmlFor="showOnlyLow" className="ml-2 cursor-pointer">Show only low stock items</label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <Checkbox 
                                                inputId="showOnlyOutOfStock" 
                                                onChange={(e) => e.checked ? setQuantityFilter('out') : setQuantityFilter(null)}
                                                checked={quantityFilter === 'out'}
                                            />
                                            <label htmlFor="showOnlyOutOfStock" className="ml-2 cursor-pointer">Show only out of stock</label>
                                        </div>
                                    </div>
                                    {hasActiveFilters && (
                                        <Button
                                            label="Clear All Filters"
                                            icon="pi pi-filter-slash"
                                            text
                                            severity="secondary"
                                            onClick={clearAllFilters}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <div className="mb-4 flex flex-wrap align-items-center gap-2">
                            <div className="flex align-items-center mr-2">
                                <i className="pi pi-filter-fill mr-2 text-primary"></i>
                                <span className="text-sm text-color-secondary">Active Filters:</span>
                            </div>
                            <div className="flex flex-wrap align-items-center flex-grow-1">
                                {filterTagsTemplate()}
                            </div>
                            <div className="ml-auto flex align-items-center gap-3">
                                <span className="text-sm text-color-secondary">
                                    Showing <strong>{filteredCount}</strong> of <strong>{products.length}</strong> products
                                </span>
                                {hasActiveFilters && (
                                    <Button
                                        label="Clear All"
                                        icon="pi pi-times"
                                        text
                                        severity="secondary"
                                        className="p-button-sm"
                                        onClick={clearAllFilters}
                                    />
                                )}
                            </div>
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
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage=" "
                        emptyMessageTemplate={emptyTemplate}
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading}
                        rowHover
                        sortMode="multiple"
                        removableSort
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate} style={{ width: '120px' }}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="quantity" header="Qty" body={quantityBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
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