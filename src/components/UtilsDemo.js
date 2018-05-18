import React, { Component } from 'react';
import './UtilsDemo.css';

export class UtilsDemo extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return(
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card">
                        <h1>Card</h1>
                        <p>Card is a section to group content and layout provides a built-in css for it. Apply .card style class to your container to use it. If the
                            card has a title defined with h1 tag, add card-w-title to adjust paddings.</p>
                            
                    <pre>
&lt;div className="card"&gt;<br/>
&emsp;&emsp;Content here<br/>
&lt;/div&gt;<br/>
<br/>

&lt;div className="card card-w-title"&gt;<br/>
&emsp;&emsp;&lt;h1&gt;Card with Title&lt;h1&gt;<br/>
&emsp;&emsp;Content here<br/>
&lt;/div&gt;
</pre>

                    <h1>Shadows</h1>
                    <p>5 levels of shadows are provided varying from ui-shadow-1 to ui-shadow-5 to define the level of depth.</p>

                    <div className="ui-g">
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box"></div>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box ui-shadow-1"></div>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box ui-shadow-2"></div>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box ui-shadow-3"></div>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box ui-shadow-4"></div>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <div className="shadow-box ui-shadow-5"></div>
                        </div>
                    </div>
                    <pre>
&lt;div className="ui-g"&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box ui-shadow-1"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box ui-shadow-2"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box ui-shadow-3"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box ui-shadow-4"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&emsp;&lt;div className="ui-g-12 ui-md-2"&gt;<br/>
&emsp;&emsp;&lt;div className="shadow-box ui-shadow-5"&gt;&lt;/div&gt;<br/>
&emsp;&lt;/div&gt;<br/>
&lt;/div&gt;
</pre>

                </div>
            </div>
        </div>
    )
    }
}