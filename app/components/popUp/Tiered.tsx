'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu'; 
import { useMediaQuery } from '@/hooks/useMediaQuery';
// import type { Menu, Menu as MenuRef } from 'primereact/menu';

import { MenuItem } from 'primereact/menuitem';

type CustomMenuItem = Omit<MenuItem, 'label' | 'items'> & {
  label?: string;
  items?: CustomMenuItem[];
};

interface TieredProps {
  title: {
    name: string;
    font: string;
  };
  items: CustomMenuItem[];
  insideColor: string;
}

export default function Tiered({ title, items, insideColor }: TieredProps) {
    // const [mobile, setMobile] = useState(false);

    const menu = useRef<TieredMenuRef>(null);
    const media = useMediaQuery('(max-width: 1000px)');
  
    const menuItems = items.map((item) => ({
      ...item,
      url: item.url || undefined
    }));

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e);

        menu.current?.toggle(e);
        // setMobile(prev => !prev);
    };
    // Общий фонт который закрывает кнопку бургер меню, Close
    return (
        <div className="relative">
            <Button
                label={title.name ? title.name : ''}
                // icon={title.font}
                onClick={(e) => toggleMenu(e)}
                style={{ color: 'black', fontSize: title.name ? '16px' : '20px' }}
                className={`${title.font} ${title.name ? 'flex gap-2 items-center pb-3 px-0' : 'text-blue-300'} bg-white p-2`}
            />

            <TieredMenu
                model={menuItems}
                popup
                ref={menu}
                breakpoint="1000px"
                style={{ width: media ? '290px' : '220px', left: '10px' }}
                className={`pointer mt-4 max-h-[200px] overflow-y-scroll`}
                pt={{
                    root: { className: `bg-white border w-[500px] border-gray-300 rounded-md shadow-md` },
                    menu: { className: 'transition-all' },
                    menuitem: { className: 'text-[var(--titleColor)] text-[14px] py-1 hover:shadow-xl border-gray-200 hover:text-white hover:bg-[var(--mainColor)]' },
                    action: { className: `flex justify-center items-center gap-2` }, // для иконки + текста не работает :)
                    icon: { className: 'text-[var(--titleColor)] mx-1 hover:text-white' }
                    // submenuIcon: { className: 'text-gray-400 ml-auto' }
                }}
            />
        </div>
    );
}
