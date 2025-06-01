'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import MyFontAwesome from '../../../components/MyFontAwesome';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Tiered({title, items, insideColor}) {
    const [mobile, setMobile] = useState(false);

      const menu = useRef(null);
    const media = useMediaQuery('(max-width: 1000px)');

    const menuItems = items.map(item => ({
        ...item,
        url: item.link && item.link
    }));

    const toggleMenu = (e)=> {
      menu.current.toggle(e);
      setMobile(prev => !prev);
    }
    // Общий фонт который закрывает кнопку бургер меню, Close
    return (
        <div className='relative'>
            {title.name ? <Button
                  label={title.name && title.name}
                  icon={title.name && "pi pi-list"}
                  onClick={(e) => toggleMenu(e)}
                  className={`flex gap-2 text-[17px] text-[var(${insideColor})] hover:text-[var(--mainColor)]`}
            />
            : <button onClick={(e) => toggleMenu(e)}>
                  <MyFontAwesome icon={mobile ? faClose : faBars} className="text-[var(--mainColor)] text-2xl"/>
             </button>
            }
            
            <TieredMenu
                  model={menuItems}
                  popup
                  ref={menu}
                  breakpoint="1000px"
                  style={{ width: media ? '90%' : '' , marginLeft: media ? '5%' : ''}}
                  className={`pointer max-h-[200px] overflow-y-scroll`}
                  pt={{
                        root: { className: `bg-white mt-4 border border-gray-300 rounded-md shadow-md`},
                        menu: { className: 'transition-all' },
                        menuitem: { className: 'text-[var(--titleColor)] text-[14px] px-4 py-4 border-b hover:shadow-xl border-gray-200 hover:text-white hover:bg-[var(--mainColor)]' },
                        action: { className: '' }, // для иконки + текста
                        icon: { className: 'text-[var(--titleColor)] mx-1 hover:text-white' },
                        submenuIcon: { className: 'text-gray-400 ml-auto' }
                  }}
            />
        </div>
    );
}