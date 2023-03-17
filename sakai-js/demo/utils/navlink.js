import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';

export { NavLink };

NavLink.propTypes = {
    href: PropTypes.string.isRequired,
    activeclassname: PropTypes.string,
    exact: PropTypes.bool,
    role: PropTypes.string
};

NavLink.defaultProps = {
    exact: false
};

function NavLink({ href, exact, children, role, target, ariaLabel, ...props }) {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        props.className += ' active-route';
    }

    return (
        <Link href={href} role={role} target={target}>
            <a aria-label={ariaLabel} {...props}>
                {children}
            </a>
        </Link>
    );
}
