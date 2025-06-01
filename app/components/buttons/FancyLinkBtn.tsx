'use client';

import Link from "next/link";
import { useState } from "react";

export default function FancyLinkBtn({backround, effectBackround, title}) {
    const [position, setPosition] = useState(false);

  return (
    <div className="relative">
        <button
            onMouseEnter={()=> setPosition(true)}
            onMouseLeave={()=> setPosition(false)}
            className="default-btn"
            onClick={()=> setPosition(prev => !prev)}
            style={{
                backgroundColor:`var(${backround})`,
            }}
        >
           <Link href={'/login'}>{title}</Link>
            <span className={`${position ? 'fancyAfter' : 'fancyBefore'}`}
                style={{position:'absolute',top:'0',bottom:'0', left:'50%', width: "550px", height: "550px", 
                    margin:'auto', borderRadius:'50%', zIndex:'-1', backgroundColor:`var(${effectBackround})`
                }}
            ></span>
        </button>
    </div>
  )
}