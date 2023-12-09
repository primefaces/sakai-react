import {FinancialPeriod} from "./FinancialPeriod";
import {FinancialType} from "./FinancialType";
import {FinancialLine} from "./line/FinancialLine";

export class Financial {

    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;

    year?: number;
    companyId?: string;
    period: FinancialPeriod = FinancialPeriod.FOURTH
    type: FinancialType = FinancialType.BILANCO
    lines : FinancialLine[] = []
    private _actualLines?: { [key: string]: {value:number, id:string} }
    private _revisedLines?: { [key: string]: {value:number, id:string} }

    constructor(year: number, companyId?: string, period: FinancialPeriod = FinancialPeriod.FOURTH, type: FinancialType = FinancialType.BILANCO, lines: FinancialLine[] = []) {
        this.year = year;
        this.companyId = companyId;
        this.period = period;
        this.type = type;
        this.lines = lines;
    }

    get revisedLines(): { [key: string]: {value:number, id:string} } {
        if (this._revisedLines == undefined){
            this._revisedLines = {};
            this.lines.filter(line => line.revised != undefined).forEach(line => {
                this._revisedLines![line.key!] = {value : line.revised!, id: line.$id!};
            })
        }
        return <{[key: string]: {value:number, id:string}}>this._revisedLines;
    }
    get actualLines(): { [key: string]: {value:number, id:string} } {
        if(this._actualLines == undefined){
            this._actualLines = {};
            this.lines.filter(line => line.value != 0).forEach(line => {
                this._actualLines![line.key!] = {value:line.value, id:line.$id!};
            })
        }
        return <{[key: string]: {value:number, id:string}}>this._actualLines;
    }

    set actualLines(value: { [key: string]: {value:number, id:string} }) {
        this._actualLines = value;
    }

    set revisedLines(value: { [key: string]: {value:number, id:string} }) {
        this._revisedLines = value;
    }
}