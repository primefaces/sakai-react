import React from 'react';
import MySkeleton from '../skeleton/MySkeleton';

export default function PrototypeCard({ value }: { value: string }) {

    return (
        <div className={`w-[210px] h-[110px] shadowAnimate rounded-sm p-2 bg-gray-400`}>
            <div className="flex items-center justify-between">
                <MySkeleton size={{width:'50px', height:'15px'}}/>
                <MySkeleton size={{width:'12px', height:'15px'}}/>
            </div>
            <div className=''>
                <div className="flex items-center justify-between my-2">
                    <MySkeleton size={{width:'100%', height:'15px'}}/>
                </div>
                <div className="text-center">{value ? value : <i className='pi pi-plus'></i>}</div>
            </div>
        </div>
    );
}
