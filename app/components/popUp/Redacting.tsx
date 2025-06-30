import { Menu } from 'primereact/menu';
import React, { useRef } from 'react';

export default function Redacting({ redactor, textSize }) {
    const menuLeft = useRef(null);

    return (
        <div>
            <i className="mr-2 pi pi-ellipsis-v cursor-pointer" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
            <Menu
                model={redactor}
                ref={menuLeft}
                popup
                popupAlignment="left"
                id="popup_menu_left"
                pt={{
                    root: {
                        style: {
                            width: 'auto',
                            fontSize: '10px'
                        }
                    },
                    // action: {
                    //     style: {
                    //         fontSize: '10px'
                    //     }
                    // },
                    icon: {
                        style: {fontSize:textSize}
                    },
                    // label: {
                    //     className: 'hidden' // если label пустой, лучше скрыть, чтобы не мешал
                    // }
                }}
            />
        </div>
    );
}
