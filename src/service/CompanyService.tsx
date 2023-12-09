import {Company} from "./types/company/Company";
import {BeyannameCodes} from "./FinancialService";
import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {Financial} from "./types/financial/Financial";
import {FinancialLine} from "./types/financial/line/FinancialLine";
import {Partnership} from "./types/company/partnership/Partnership";
import {Contact} from "./types/contact/Contact";
import {PartnershipDuty} from "./types/company/partnership/PartnershipDuty";

export const COMPANIES_DATABASE_ID = "654769c9344dffc7dd50";
export const COMPANIES_COLLECTION_ID = "654769cf447df20d3035";

export const CompanyService = {
    async getCompanies() {
        let res = await fetch('/demo/data/companies.json', {headers: {'Cache-Control': 'no-cache'}});
        let d: any = await res.json();
        return d.data as Company[];
    },

    async list() {
        return await databases.listDocuments(
            COMPANIES_DATABASE_ID,
            COMPANIES_COLLECTION_ID,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        );
    },

    async add(company: Company) {
        return await databases.createDocument(
            COMPANIES_DATABASE_ID,
            COMPANIES_COLLECTION_ID,
            ID.unique(),
            company
        );
    },

    async update(id: string, data: Company) {
        return await databases.updateDocument(COMPANIES_DATABASE_ID, COMPANIES_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(COMPANIES_DATABASE_ID, COMPANIES_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },

    extractCompanyInfo(extractedText: string[]) {
        let company = new Company()
        company.taxAdministration = extractedText[1].split('|')[1]
        company.taxNo = extractedText[10]
        company.contact.email = extractedText[14]
        let splitted = extractedText[13].split('|')
        company.tradeRegisterNo = splitted[0]
        company.contact.telNo = splitted[2] + splitted[1]
        company.name = extractedText[11] + ` ` + extractedText[12]
        return company
    },
    extractCode: function (cells: string[], last2Code: string, last1Code: string, splitted: string[], i: number, gelir: { start: number; finish: number }) {
        let code = ''
        if (cells[0].startsWith('. ')) {
            last2Code = last1Code + splitted[1].trim() + '.';
            code = last2Code
            console.log("last2Code", code)
        } else if (cells[0].startsWith('.')) {
            code = last2Code + splitted[1].trim() + '.'
            console.log("last3Code", code)
        } else {
            last1Code = splitted[0].trim() + '.';
            code = last1Code
            console.log("last1Code", code)
        }
        if (i >= gelir.start) {
            code = "VI." + code
        }
        return code;
    },

    extractPartnership(extractedText: string[], ortak: { start: number; finish: number }){
        //TODO handle multiple partnership
        let partnerships: Partnership[] = []
        let cells = extractedText[ortak.start + 1].split("|")
        let partner = new Partnership()
        partner.contact = new Contact()
        partner.contact.address = extractedText[ortak.start] + " " +cells[0]
        let splitted = cells[0].split('-')
        if(splitted.length == 1){
            splitted = cells[0].split('/')
        }
        partner.contact.city = splitted[splitted.length-1].trim()
        partner.contact.telNo = cells[1]
        partner.surname = cells[6]
        partner.name = cells[7]
        partner.duties = []
        if(cells[2] == "*"){
            partner.duties.push(PartnershipDuty.MANAGER)
        }
        if(cells[3] == "*"){
            partner.duties.push(PartnershipDuty.BOARD_MEMBER)
        }
        if(cells[4] == "*"){
            partner.duties.push(PartnershipDuty.PARTNER)
        }
        if(cells[5] == "*"){
            partner.duties.push(PartnershipDuty.LEGAL_REPRESENTATIVE)
        }

        partner.shareRatio = parseFloat(cells[9].replaceAll('.', '').replaceAll(',', '.'))
        partner.tckn = cells[8]
        partnerships.push(partner)

        return partnerships
    },

    extractBilanco(extractedText: string[], bilanco: { start: number; finish: number }, gelir: { start: number; finish: number }) {
        let last1Code = ''
        let last2Code = ''
        let years = extractedText[bilanco.start - 1].split("|")
        let financial = new Financial(Number(years[0].substring(1, 5)))
        let financialPrev = new Financial(Number(years[1].substring(1, 5)))

        for (let i = bilanco.start; i < gelir.finish; i++) {
            let cells = extractedText[i].split("|")
            let splitted = cells[0].split('.')
            if (splitted.length == 1 || cells.length == 1) {
                continue;
            }
            console.log(splitted, i)
            let code = this.extractCode(cells, last2Code, last1Code, splitted, i, gelir);
            let number = parseFloat(cells[1].replaceAll('.', '').replaceAll(',', '.'))
            if (isNaN(number)) {
                continue
            }
            let codeSplitted = code.split(`.`)
            if (codeSplitted.length < 4) {
                continue
            }

            if (number != 0) {
                financial.lines.push(new FinancialLine(BeyannameCodes[code].accountCode, number))
            }
            if (cells.length >= 3) {
                let numberPrev = parseFloat(cells[2].replaceAll('.', '').replaceAll(',', '.'))
                if (isNaN(numberPrev)) {
                    continue
                }
                if (numberPrev != 0) {
                    financialPrev.lines.push(new FinancialLine(BeyannameCodes[code].accountCode, numberPrev))
                }
            }
        }
        return {financial, financialPrev}
    },
}


