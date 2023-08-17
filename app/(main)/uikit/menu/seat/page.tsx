'use client';

import React from 'react';
import Menu from '../page';
function SeatDemo() {
    return (
        <Menu>
            <div className="flex align-items-center py-5 px-3">
                <i className="pi pi-fw pi-ticket mr-2 text-2xl" />
                <p className="m-0 text-lg">Seat Component Content via Child Route</p>
            </div>
        </Menu>
    );
}

export default SeatDemo;
