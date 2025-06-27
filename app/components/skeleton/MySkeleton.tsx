import React, { useState } from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function MySkeleton({ size }:{size:{width:string,height:string}}) {
    return <Skeleton width={size.width} height={size.height} className="m-1"></Skeleton>;
}
