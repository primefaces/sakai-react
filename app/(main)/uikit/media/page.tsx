'use client';

import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Galleria } from 'primereact/galleria';
import { Image } from 'primereact/image';
import React, { useEffect, useState } from 'react';
import { PhotoService } from '../../../../demo/service/PhotoService';
import { ProductService } from '../../../../demo/service/ProductService';
import type { Demo } from '../../../../types/types';

const MediaDemo = () => {
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [images, setImages] = useState<Demo.Photo[]>([]);

    const galleriaResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
    const carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        ProductService.getProductsSmall().then((products) => setProducts(products));

        PhotoService.getImages().then((images) => setImages(images));
    }, []);

    const carouselItemTemplate = (product: Demo.Product) => {
        return (
            <div className="border-1 surface-border border-round m-1 text-center py-5">
                <div className="mb-3">
                    <img src={`/demo/images/product/${product.image}`} alt={product.name} className="w-6 shadow-2" />
                </div>
                <div>
                    <h4 className="p-mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <span className={`product-badge status-${product.inventoryStatus?.toLowerCase()}`}>{product.inventoryStatus}</span>
                    <div className="car-buttons mt-5">
                        <Button type="button" className="mr-2" rounded icon="pi pi-search"></Button>
                        <Button type="button" className="mr-2" severity="success" rounded icon="pi pi-star"></Button>
                        <Button type="button" severity="help" rounded icon="pi pi-cog"></Button>
                    </div>
                </div>
            </div>
        );
    };

    const galleriaItemTemplate = (item: Demo.Photo) => <img src={`/${item.itemImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    const galleriaThumbnailTemplate = (item: Demo.Photo) => <img src={`/${item.thumbnailImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />;

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h5>Carousel</h5>
                    <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Image</h5>
                    <div className="flex justify-content-center">
                        <Image src={`/demo/images/galleria/galleria10.jpg`} alt="Image" width="250" preview />
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Galleria</h5>
                    <Galleria value={images} responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular style={{ maxWidth: '800px', margin: 'auto' }} item={galleriaItemTemplate} thumbnail={galleriaThumbnailTemplate}></Galleria>
                </div>
            </div>
        </div>
    );
};

export default MediaDemo;
