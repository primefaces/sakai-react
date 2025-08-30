import { Menu } from 'primereact/menu';
import type { Menu as MenuRef } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';

export default function Redacting({ redactor, textSize }: {redactor: MenuItem[], textSize: string}) {
    const menuLeft = useRef<MenuRef>(null);
    
    return (
        <div>
            <i className="mr-2 pi pi-ellipsis-v cursor-pointer border-2 text-[var(--mainColor)] border-[var(--mainColor)] hover:text-white hover:bg-[var(--mainColor)] transition-all rounded-full p-1" onClick={(event) => menuLeft.current?.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
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
