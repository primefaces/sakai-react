'use client';

import { useRef, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
export default function Lesson() {
    const stepperRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (e) => {
        // console.log('Переход на шаг:', e);
    //     // fetchDataForStep(e.index);
        setActiveIndex(e.index) 
    };

    return (
        <div>
            <TabView
                onTabChange={(e) => handleTabChange(e) }
                activeIndex={activeIndex}
                pt={{
                    nav: { className: 'flex flex-wrap justify-around' },
                    panelContainer: { className: 'flex-1 pl-4 '}
                }}
            >
                <TabPanel header="Header I" className="border p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel">
                    <p className="m-0">
                        laborum.
                    </p>
                </TabPanel>
                <TabPanel header="Header II" className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel header="Header III" className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
                
            </TabView>
        </div>
    );
}
