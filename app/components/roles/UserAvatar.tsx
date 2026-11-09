'use client';

// аватар с инициалами
export default function UserAvatar({ user }: { user: { last_name?: string; name?: string } }) {
    return (
        <span className="flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-bold uppercase">
            {`${user?.last_name?.[0] ?? ''}${user?.name?.[0] ?? ''}` || <i className="pi pi-user text-[0.8125rem]"></i>}
        </span>
    );
}
