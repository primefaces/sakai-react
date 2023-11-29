import {Financial} from "../financial/Financial";

export class Company {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    name: string= '';
    taxNo?: string;
    userId?: string;
    financials: Financial[] = [];
}

