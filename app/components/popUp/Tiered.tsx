'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu'; 
import useMediaQuery from '@/hooks/useMediaQuery';
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
                style={{ width: media ? '300px' : '240px', left: '10px' }}
                className={`topbar-tiered pointer mt-3 max-h-[420px] overflow-y-auto`}
            />
        </div>
    );
}
