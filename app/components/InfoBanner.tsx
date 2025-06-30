'use client';

export default function InfoBanner({title}:{title:string}) {
    
  return (
    <div className="bg-[var(--titleColor)] flex flex-col justify-center items-center w-full text-white p-[50px] md:p-[100px]">
        <h1 style={{color:'white'}} className="text-[30px] md:text-[50px]">{title}</h1>
    </div>
  );
};
