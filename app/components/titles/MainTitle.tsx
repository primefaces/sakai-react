'use client';

export default function MainTitle({children}: {children: string}) {
    return (
        <h3 className={`text-xl sm:text-2xl font-bold mb-3 pb-2 shadow-[var(--bottom-shadow)]`}>{children}</h3>
    );
};
