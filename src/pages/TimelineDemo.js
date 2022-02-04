import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import classNames from 'classnames';

const TimelineDemo = () => {
    const customEvents = [
        {
            status: 'Ordered',
            date: '15/10/2020 10:30',
            icon: 'pi pi-shopping-cart',
            color: '#9C27B0',
            image: 'game-controller.jpg'
        },
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-envelope', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];

    const horizontalEvents = [
        '2020', '2021', '2022', '2023'
    ];


    const customizedContent = (item) => {
        return (
            <Card title={item.status} subTitle={item.date}>
                { item.image && <img src={`assets/demo/images/product/${item.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.name} width={200} className="shadow-2 mb-3" />}
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
                <Button label="Read more" className="p-button-text"></Button>
            </Card>
        );
    };

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-2" style={{ backgroundColor: item.color }}>
                <i className={classNames('marker-icon', item.icon)}></i>
            </span>
        );
    };

    return <div className="grid timeline-demo">
        <div className="col-12">
            <div className="card">
                <h4>Timeline</h4>

                <h5>Custom Timeline</h5>
                <Timeline value={customEvents} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />

                <h5 style={{ marginTop: '5em' }}>Horizontal - Alternate Align</h5>
                <Timeline value={horizontalEvents} layout="horizontal" align="alternate" content={(item) => item} opposite={<span>&nbsp;</span>} />
            </div>
        </div>
    </div>
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(TimelineDemo, comparisonFn);