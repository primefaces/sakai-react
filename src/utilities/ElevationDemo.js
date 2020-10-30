import React from 'react';

export const ElevationDemo = () => {
    let cols = [];

    for (let i = 1; i < 25; i++) {
        let col = (
            <div key={i} className="p-col">
                <div className={`box p-shadow-${i}`}>
                    p-shadow-{i}
                </div>
            </div>
        );

        cols.push(col);
    }

    return (
        <div className="p-grid elevation-demo">
            <div className="p-col-12">
                <div className="card">
                    <h4>Shadow</h4>
                    <p>Elevation is used to specify the separation between surfaces and elements along the z-axis. There are 24 style classes (<mark>.p-shadow-{`{level}`}</mark>) to define the elevation layers.</p>

                    <div className="shadow-container">
                        {cols}
                    </div>
                </div>
            </div>
        </div>
    )
}
