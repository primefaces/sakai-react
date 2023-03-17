import { useEffect } from 'react';
import { useRouter, withRouter } from 'next/router';

function ScrollToTop(props) {
    const router = useRouter();

    // useEffect(() => {
    //     window.scrollTo(0, 0)
    // }, [router]);

    return props.children;
}

export default withRouter(ScrollToTop);
