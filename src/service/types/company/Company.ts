import {Financial} from "../financial/Financial";
import {Contact} from "../contact/Contact";
import {Partnership} from "./partnership/Partnership";

export class Company {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    name: string= '';
    establishmentDate?: Date
    activityAreaCodes? : string[]
    userId?: string;
    taxNo: string = ''
    taxAdministration: string = ''
    tradeRegisterNo?: string
    contact: Contact = new Contact();
    financials: Financial[] = [];
    partnerships: Partnership[] = []
}