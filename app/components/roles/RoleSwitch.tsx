'use client';

// переключатель роли (только отображение, обработчик передаётся снаружи)
export default function RoleSwitch({ isActive, disabled, onClick }: { isActive: boolean; disabled: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={isActive}
            disabled={disabled}
            onClick={onClick}
            // размеры заданы inline, чтобы глобальные стили button/primeflex их не перебивали
            style={{
                position: 'relative',
                display: 'inline-block',
                flexShrink: 0,
                width: 38,
                height: 22,
                padding: 0,
                border: 'none',
                borderRadius: 999,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                backgroundColor: isActive ? 'var(--mainColor)' : '#dfe4ea',
                boxShadow: isActive ? '0 2px 6px -2px rgba(8,169,230,0.6)' : 'inset 0 1px 2px rgba(0,0,0,0.08)',
                transition: 'background-color .2s, box-shadow .2s'
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    transform: isActive ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform .2s ease'
                }}
            />
        </button>
    );
}
