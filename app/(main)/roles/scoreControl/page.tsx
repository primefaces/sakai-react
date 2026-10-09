'use client';

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { fetchCourseOpenStatus } from '@/services/courses';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';
import { useLocalization } from '@/layout/context/localizationcontext';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'; // Import InputText
import { InputTextarea } from 'primereact/inputtextarea';
import { courseStatusControl } from '@/services/roles/roles';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation'; // Import InputTextarea

interface ForLinkRole {
    name: string;
    id: number | null;
    active: boolean;
    read: boolean;
}

/**
 * Компонент управления диапазоном баллов для конкретной строки
 * Адаптирован для использования в модальном окне
 */
const ScoreRangeInputs = ({ min, max, onChange, disabled }: { min: number; max: number; onChange: (type: 'min' | 'max', val: number) => void; disabled?: boolean }) => {
    return (
        <div className="flex align-items-center gap-1 sm:gap-2 bg-secondary-faded p-1 border-round shadow-1 surface-50">
            <div className="flex flex-column align-items-center">
                <span className="text-xs font-medium text-500 mb-1">Мин</span>
                <InputNumber
                    value={min}
                    onChange={(e) => onChange('min', Number(e.value) || 0)}
                    min={0}
                    max={max}
                    inputClassName="w-3rem sm:w-4rem text-center p-1 text-sm border-none bg-transparent"
                    showButtons
                    buttonLayout="vertical"
                    incrementButtonClassName="hidden"
                    decrementButtonClassName="hidden"
                    disabled={disabled}
                />
            </div>
            <div className="text-400 font-bold self-end mb-1">-</div>
            <div className="flex flex-column align-items-center">
                <span className="text-xs font-medium text-500 mb-1">Макс</span>
                <InputNumber
                    value={max}
                    onChange={(e) => onChange('max', Number(e.value) || 0)}
                    min={min}
                    inputClassName="w-3rem sm:w-4rem text-center p-1 text-sm border-none bg-transparent"
                    showButtons
                    buttonLayout="vertical"
                    incrementButtonClassName="hidden"
                    decrementButtonClassName="hidden"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

/**
 * Компонент строки таблицы (или карточки на мобилке)
 */
const ScoreRow = ({ item, typesFetchProp }: { item: AudenceType; typesFetchProp: () => void }) => {
    const { setMessage } = useContext(LayoutContext);
    const [displayEditModal, setDisplayEditModal] = useState(false);
    const [editableScores, setEditableScores] = useState({ min: item.min_score, max: item.max_score });
    const [editableTitle, setEditableTitle] = useState(item.title);
    const [editableDescription, setEditableDescription] = useState(item.description);
    const [loading, setLoading] = useState(false);
    const {translations} = useLocalization();

    const handleScoreChange = (type: 'min' | 'max', val: number) => {
        if (typeof val === 'number') {
            setEditableScores((prev) => ({ ...prev, [type]: val }));
        }
    };

    const handleSaveScores = async () => {
        setLoading(true);
        // Simulate API call
        const data = await courseStatusControl(editableTitle, editableDescription, editableScores.min, editableScores.max, item.id);
        if(data){
            typesFetchProp(); // Refresh data after saving
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.updateSuccess, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: data.response.data.cause }
            });
        }
        console.log(`Saving for ${item.id}:`, {
            min_score: editableScores.min,
            max_score: editableScores.max,
            title: editableTitle,
            description: editableDescription
        });
        // In a real application, you would make an API call here to update the scores, title, and description
        // e.g., updateCourseDetails(item.id, editableScores.min, editableScores.max, editableTitle, editableDescription);
        setLoading(false);
        setDisplayEditModal(false);
    };

    // const handleDelete = (id: number)=> {
    //     console.log(id);
    // }

    useEffect(() => {
        setEditableScores({ min: item.min_score, max: item.max_score });
        setEditableTitle(item.title);
        setEditableDescription(item.description);
    }, [item.min_score, item.max_score, item.title, item.description]);

    const isChanged =
        Number(editableScores.min) !== Number(item.min_score) ||
        Number(editableScores.max) !== Number(item.max_score) ||
        editableTitle !== item.title ||
        editableDescription !== item.description;

    return (
        <tr className="border-bottom-1 surface-border transition-colors hover:surface-100">
            <td className="py-4 px-3">
                <div className="flex flex-column gap-1">
                    <div className="flex align-items-center gap-1">
                        <div className="p-2 border-round-circle surface-200 flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                            <i className={classNames('pi', item.icon || 'pi-tag', 'text-primary')}></i>
                        </div>
                        <span
                            className={`block font-bold text-900 line-height-1 p-1 rounded ${
                                item.name === 'open'
                                    ? 'bg-[var(--greenColor)] text-white'
                                    : item.name === 'wallet'
                                    ? 'bg-[var(--amberColor)] text-white'
                                    : item.name === 'extra'
                                    ? 'bg-[var(--noAuditColor)] text-white'
                                    : item.name === 'lock'
                                    ? 'bg-[var(--redColor)] text-white'
                                    : ''
                            }`}
                        >
                            {item.title}
                        </span>
                    </div>
                    <p className="m-0 mt-2 text-600 text-sm line-height-2 max-w-30rem">{item.description}</p>
                </div>
            </td>
            <td className="py-4 px-3 text-right">
                <div className="flex align-items-center justify-content-end gap-2">
                    <div className="flex align-items-center gap-1 sm:gap-2 bg-secondary-faded p-1 border-round shadow-1 surface-50">
                        <div className="flex flex-column align-items-center">
                            <span className="text-xs font-medium text-500 mb-1">Мин</span>
                            <span className="w-3rem sm:w-4rem text-center p-1 text-sm">{item.min_score}</span>
                        </div>
                        <div className="text-400 font-bold self-end mb-1">-</div>
                        <div className="flex flex-column align-items-center">
                            <span className="text-xs font-medium text-500 mb-1">Макс</span>
                            <span className="w-3rem sm:w-4rem text-center p-1 text-sm">{item.max_score}</span>
                        </div>
                    </div>
                    <i className={'pi pi-pencil p-2 rounded-full shadow-1 cursor-pointer text-white bg-[var(--mainColor)]'} onClick={() => setDisplayEditModal(true)}></i>
                    {/*<i className={'pi pi-trash p-2 rounded-full shadow-1 cursor-pointer bg-[var(--redColor)] text-white'} onClick={(e)=> {*/}
                    {/*    confirmDialog(getConfirmOptions(Number(), () => handleDelete(item.id)));*/}
                    {/*}}></i>*/}
                </div>
            </td>

            <Dialog
                header={translations.edit + ': ' + item.title}
                visible={displayEditModal}
                className="max-w-xl sm:w-full"
                onHide={() => setDisplayEditModal(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label={translations.cancel || "Отмена"} size={'small'} icon="pi pi-times" onClick={() => setDisplayEditModal(false)} className="p-button-text reject-button" />
                        <Button label={translations.save || "Сохранить"} size={'small'} icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'} onClick={handleSaveScores} disabled={!isChanged || loading} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field mb-4">
                        <label htmlFor="editableTitle" className="font-bold mb-2 block">{translations.courseAudienceType}</label>
                        <InputText
                            id="editableTitle"
                            value={editableTitle}
                            onChange={(e) => setEditableTitle(e.target.value)}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    <div className="field mb-4">
                        <label htmlFor="editableDescription" className="font-bold mb-2 block">{translations.description}</label>
                        <InputTextarea
                            id="editableDescription"
                            value={editableDescription}
                            onChange={(e) => setEditableDescription(e.target.value)}
                            rows={3}
                            cols={30}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    <div className="field mb-4">
                        <label className="font-bold mb-2 block">{translations.scoreDiapazon}</label>
                        <ScoreRangeInputs min={editableScores.min} max={editableScores.max} onChange={handleScoreChange} disabled={loading} />
                    </div>
                </div>
            </Dialog>
        </tr>
    );
};

/**
 * Заглушка загрузки
 */
const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4].map((i) => (
            <tr key={i} className="border-bottom-1 surface-border">
                <td className="py-4 px-3">
                    <Skeleton width="40%" height="1.2rem" className="mb-2" />
                    <Skeleton width="90%" height="3rem" />
                </td>
                <td className="py-4 px-3">
                    <div className="flex justify-content-end gap-2">
                        <Skeleton width="100px" height="40px" borderRadius="8px" />
                        <Skeleton shape="circle" size="35px" />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

/**
 * Основной компонент страницы
 */
export default function ScoreControl() {
    const {user} = useContext(LayoutContext);
    const { translations } = useLocalization();
    const [data, setData] = useState<AudenceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoreControlInfo, setScoreControlInfo] = useState(false);
    const router = useRouter();

    const handleFetchTypes = async () => {
        try {
            const res = await fetchCourseOpenStatus();
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchTypes();

        const roles = user?.roles;
        const forRole: ForLinkRole[] = [];
        if(roles){
            roles.forEach((role) => {
                if (role?.pivot?.active) {
                    const timeRole: ForLinkRole = {
                        name: role.title,
                        id: role.id,
                        active: true,
                        read: role?.pivot?.read
                    };

                    forRole.push(timeRole);
                }
            });
            const forScoreControl = forRole?.find((item) => item.id === 5);
            if(!forScoreControl) {
                router.push('/');
            }
        } else {
            router.push('/');
        }
        console.log(roles);
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card border-none shadow-4 p-0 overflow-hidden">
                    <div className={'mt-3 mx-2 pb-2 flex justify-between items-center gap-2 shadow-[var(--bottom-shadow)]'}>
                        <h3 className={`text-xl sm:text-2xl m-0 font-bold`}>{translations.scoreControle}</h3>
                        <i onClick={() => setScoreControlInfo(true)} className={'cursor-pointer pi pi-info-circle text-lg text-[var(--titleColor)]'}></i>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="surface-50 border-bottom-1 surface-border">
                                <tr>
                                    <th className="text-left py-3 px-3 text-600 font-medium uppercase text-xs tracking-wider">{translations.courseAudienceType}</th>
                                    <th className="text-right py-3 px-3 text-600 font-medium uppercase text-xs tracking-wider">{translations.scoreDiapazon}</th>
                                </tr>
                            </thead>
                            <tbody>{loading ? <TableSkeleton /> : data.map((item) => <ScoreRow key={item.id} item={item} typesFetchProp={handleFetchTypes} />)}</tbody>
                        </table>
                    </div>

                    {!loading && data.length === 0 && (
                        <div className="p-5 text-center text-500">
                            <i className="pi pi-info-circle text-2xl mb-2"></i>
                            <p>Данные не найдены</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                header={'Управление баллами по типам курсов'}
                visible={scoreControlInfo}
                className={'max-w-xl'}
                onHide={() => {
                    if (!scoreControlInfo) return;
                    setScoreControlInfo(false);
                }}
            >
                <div>Здесь вы можете гибко настроить диапазон баллов (минимум и максимум) для каждого типа курса</div>
            </Dialog>

            <style jsx global>{`
                @media screen and (max-width: 640px) {
                    .p-inputnumber-input {
                        width: 2.5rem !important;
                        font-size: 0.8rem !important;
                    }
                    td {
                        padding: 1rem 0.5rem !important;
                    }
                }
                .bg-secondary-faded {
                    background-color: rgba(0, 0, 0, 0.03);
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}
