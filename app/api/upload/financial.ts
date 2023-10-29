import {FinancialLine} from "./financialLine";


declare type FinancialPeriod = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH';
declare type FinancialType = 'BALANCE' | 'REVISED_BALANCE';

export class Financial {
    id!: string;
    year!: number;
    period: FinancialPeriod = "FOURTH";
    type: FinancialType = "BALANCE";
    bilancoLines: FinancialLine[] = [];
    gelirLines: FinancialLine[] = [];
}