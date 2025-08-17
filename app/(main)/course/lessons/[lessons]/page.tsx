'use client';

import { useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';

export default function Lesson() {
    const stepperRef = useRef(null);

    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (e) => {
        setActiveStep(e.index);
        // 👉 Здесь можешь загружать данные
        console.log('Переход на шаг:', e);
        // fetchDataForStep(e.index);
    };

    return (
        <div className="flex justify-center">
            <Stepper ref={stepperRef} activeStep={activeStep} onChangeStep={handleStepChange} style={{ flexBasis: '50rem' }}>
                <StepperPanel header="Header I" key='step1'>
                    <div className="flex flex-column h-12rem">
                        <div className="flex justify-center items-center border-2 rounded bg-gray-100 border-gray-300 flex-auto font-medium">Content I</div>
                    </div>
                    <div className="flex pt-4 justify-content-end">
                        <Button label="" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header II" key='step2'>
                    lreo
                    {/* <div className="flex flex-column h-12rem">
                        <div className="flex justify-center items-center border-2 rounded bg-gray-100 border-gray-300 flex-auto font-medium">Content II</div>
                    </div> */}
                    <div className="flex pt-4 justify-between">
                        <Button label="" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header III" key='step3'>
                    <div className="flex flex-column h-12rem">
                        <div className="flex justify-center items-center border-2 rounded bg-gray-100 border-gray-300 flex-auto font-medium">Content II</div>
                    </div>
                    <div className="flex pt-4 justify-between">
                        <Button label="" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header IV" key='step4'>
                    <div className="flex flex-column h-12rem">
                        <div className="flex justify-center items-center border-2 rounded bg-gray-100 border-gray-300 flex-auto font-medium">Content II</div>
                    </div>
                    <div className="flex pt-4 justify-between">
                        <Button label="" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header v" key='step5'>
                    <div className="flex flex-column h-12rem">
                        <div className="flex justify-center items-center border-2 rounded bg-gray-100 border-gray-300 flex-auto font-medium">Content III</div>
                    </div>
                    <div className="flex pt-4 justify-start">
                        <Button label="" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
