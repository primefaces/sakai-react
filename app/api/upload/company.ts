import {Financial} from "./financial";

export class Company {
    id: string | undefined;
    name: string | undefined;
    establishmentDate?: Date;
    financials: Financial[] = [];
    taxNo: string | undefined;
}