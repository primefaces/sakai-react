import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { PickList } from 'primereact/picklist';
import { OrderList } from 'primereact/orderlist';
import { ProductService } from '../service/ProductService';

const ListDemo = () => {
    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' },
    ];

    const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
    const [dataviewValue, setDataviewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setDataviewValue(data));
    }, []);

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        }
        else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataviewHeader = (
        <div className="grid grid-nogutter">
            <div className="col-6" style={{ textAlign: 'left' }}>
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
            </div>
            <div className="col-6" style={{ textAlign: 'right' }}>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        </div>
    );

    const dataviewListItem = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={`assets/demo/images/product/${data.image}`} alt={data.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    <div className="flex-1 text-center md:text-left">
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <Rating value={data.rating} readonly cancel={false} className="mb-2"></Rating>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} className="mb-2"></Button>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 md:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                    <div className="text-center">
                        <img src={`assets/demo/images/product/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <Rating value={data.rating} readonly cancel={false} />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        }
        else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h5>DataView</h5>
                    <DataView value={dataviewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataviewHeader}></DataView>
                </div>
            </div>

            <div className="col-12 lg:col-8">
                <div className="card">
                    <h5>PickList</h5>
                    <PickList source={picklistSourceValue} target={picklistTargetValue} sourceHeader="From" targetHeader="To" itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => { setPicklistSourceValue(e.source); setPicklistTargetValue(e.target) }} sourceStyle={{ height: '200px' }} targetStyle={{ height: '200px' }}></PickList>
                </div>
            </div>

            <div className="col-12 lg:col-4">
                <div className="card">
                    <h5>OrderList</h5>
                    <OrderList value={orderlistValue} listStyle={{ height: '200px' }} className="p-orderlist-responsive" rows={10} header="Cities" itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => setOrderlistValue(e.value)}></OrderList>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ListDemo, comparisonFn);