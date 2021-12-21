import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';

const AppCodeHighlight = (props) => {

    const codeElement = useRef(null);

    useEffect(() => {
        if (Prism) {
            Prism.highlightElement(codeElement.current);
        }
    }, []);

    return (
        <pre style={props.style}>
            <code ref={codeElement} className={`language-${props.lang}`}>
                {props.children}&nbsp;
                </code>
        </pre>
    );
}

AppCodeHighlight.defaultProps = {
    lang: 'jsx',
    style: null
};

export default AppCodeHighlight;
