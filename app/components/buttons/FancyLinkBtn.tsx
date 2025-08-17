'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FancyLinkBtn({ btnWidth, backround, effectBg, title }) {
    const [position, setPosition] = useState(false);

    return (
        <div className="relative">
            <button
                onMouseEnter={() => setPosition(true)}
                onMouseLeave={() => setPosition(false)}
                className="default-btn p-[7px] md:p-[15px]"
                onClick={() => setPosition((prev) => !prev)}
                style={{
                    backgroundColor: `var(${backround})`,
                    width: `${ btnWidth }`,
                }}
                type='submit'
            >
                {/* <Link href={'/auth/login'} style={{ color: 'white' }} className='text-[14px] sm:text-[16px]'> */}
                    {title}
                {/* </Link> */}
                <span
                    className={`${position ? 'fancyAfter' : 'fancyBefore'}`}
                    style={{ position: 'absolute', top: '0', bottom: '0', left: '50%', width: '550px', height: '550px', margin: 'auto', borderRadius: '50%', zIndex: '-1', backgroundColor: `var(${effectBg})` }}
                ></span>
            </button>
        </div>
    );
}
