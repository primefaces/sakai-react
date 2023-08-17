'use client';
import React from 'react';
import Menu from '../page';
function PaymentDemo() {
    return (
        <Menu>
            <div className="flex align-items-center py-5 px-3">
                <i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
                <p className="m-0 text-lg">Payment Component Content via Child Route</p>
            </div>
        </Menu>
    );
}

export default PaymentDemo;
