import React, { Component } from 'react';

export class EmptyPage extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <div className="ui-g">
            <div className="ui-g-12">
                <div className="card">
                    <h1>Empty Page</h1>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>
        </div>
    }
}