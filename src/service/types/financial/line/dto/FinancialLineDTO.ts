import {FinancialLineType} from "../FinancialLineType";

export class FinancialLineDTO {

    constructor(name?: string, parentKey?: string, type: FinancialLineType = FinancialLineType.PLUS, key?: string, value = 0, revised = undefined, children: FinancialLineDTO[] = []) {
        this.type = type;
        this.name = name;
        this.key = key;
        this.parentKey = parentKey;
        this.value = value;
        this.revised = revised;
        this.children = children;
    }

    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    key?: string;
    type = FinancialLineType.PLUS;
    parentKey?: string;
    name?: string;
    value: number = 0;
    revised?: number;
    children: FinancialLineDTO[] = [];
}