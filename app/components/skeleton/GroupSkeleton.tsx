import React, { useState } from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function GroupSkeleton({ count, size }:{count:number, size:{width:string, height: string}}) {
    const usingSkeleton = (i:number) => {
        return (
            <div key={i}>
                <Skeleton width={size.width} height={size.height} className="mb-2"></Skeleton>
            </div>
        );
    };

    return <div className="flex flex-col gap-1">{Array.from({ length: count }).map((_, i) => usingSkeleton(i))}</div>;
}
