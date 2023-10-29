import {BeyannameCodes} from "../../../demo/service/FinancialService";

export class FinancialLine {
    constructor(value: number, code: string, accountCode?: string) {
        this.value = value;
        this.code = code;
        this.accountCode = accountCode;

    }

    code?: string;
    accountCode?: string;
    value: number;
}