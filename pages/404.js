import React from 'react';
import UnFound from '../pages/pages/notfound/index';
const Custom404 = () => {
    return <UnFound />;
};

Custom404.getLayout = function getLayout(page) {
    return page;
};

export default Custom404;
