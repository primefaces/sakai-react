import React from 'react';
import Menu from './index';
function ConfirmationDemo() {
    return (
        <Menu>
            <div className="flex align-items-center py-5 px-3">
                <i className="pi pi-fw pi-check mr-2 text-2xl" />
                <p className="m-0 text-lg">Confirmation Component Content via Child Route</p>
            </div>
        </Menu>
    );
}

export default ConfirmationDemo;
