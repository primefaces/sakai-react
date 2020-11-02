import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { CodeHighlight } from '../components/CodeHighlight';

export const IconsDemo = () => {

    const [icons, setIcons] = useState([]);

    useEffect(() => {
        axios.get('assets/demo/data/icons.json').then(res => {
            let icons = res.data.icons;
            icons.sort((icon1, icon2) => {
                if (icon1.properties.name < icon2.properties.name)
                    return -1;
                else if (icon1.properties.name < icon2.properties.name)
                    return 1;
                else
                    return 0;
            });

            setIcons(icons);
        });
    }, []);

    return (
        <div className="card icons-demo">
            <h3>Icons</h3>
            <p>This layout uses PrimeIcons v4.0, PrimeTek's new modern icon library.</p>

            <h5>Getting Started</h5>
            <p>PrimeIcons use the pi pi-{`{icon}`} syntax such as pi pi-check. A standalone icon can be displayed using an element like i or span.</p>
<CodeHighlight>
{`
<i className="pi pi-check"></i>
<i className="pi pi-times"></i>
`}
</CodeHighlight>

            <i className="pi pi-check" style={{ marginRight: '.5rem' }}></i>
            <i className="pi pi-times"></i>

            <h5>Component Icons</h5>
            <p>Components that have icon properties accept PrimeIcons with the pi pi-{`{icon}`} syntax.</p>
<CodeHighlight>
{`
<Button type="button" label="Confirm" icon="pi pi-check"></Button>
`}
</CodeHighlight>

            <Button type="button" label="Confirm" icon="pi pi-check"></Button>

            <h5>Size</h5>
            <p>Size of the icons can easily be changed using font-size property.</p>

<CodeHighlight>
{`
<i className="pi pi-check"></i>
`}
</CodeHighlight>

            <i className="pi pi-check"></i>

<CodeHighlight>
{`
<i className="pi pi-check" style={{ fontSize: '2rem' }}></i>
`}
</CodeHighlight>

            <i className="pi pi-check" style={{ fontSize: '2rem' }}></i>

            <h5>Spinning Animation</h5>
            <p>Special pi-spin class applies continuous rotation to an icon.</p>
<CodeHighlight>
{`
<i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
`}
</CodeHighlight>

            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>

            <h5>List of Icons</h5>
            <p>Here is the current list of PrimeIcons, more icons are added periodically. You may also <a href="https://github.com/primefaces/primeicons/issues">request new icons</a> at the issue tracker.</p>

            <div className="p-grid icons-list">
                {
                    icons && icons.map(icon => {
                        return (
                            <div className="p-col-12 p-md-2" key={icon.properties.name}>
                                <i className={`pi pi-${icon.properties.name}`}></i>
                                <div>pi-{icon.properties.name}</div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}
