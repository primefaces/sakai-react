import  {Company} from "./types/company/company";
import {BeyannameCodes} from "./FinancialService";
import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {Financial} from "./types/financial/Financial";
import {FinancialLine} from "./types/financial/line/FinancialLine";

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
        company.taxNo = extractedText[10]
        company.name = extractedText[11] + ` ` + extractedText[12]
        return company
    },
    extractBilanco(extractedText: string[], bilancoStart: number, gelirStart: number, gelirFinish: number) {
        let last1Code = ''
        let last2Code = ''
        let years = extractedText[bilancoStart -1].split("|")
        let financial = new Financial(Number(years[0].substring(1, 5)))
        let financialPrev = new Financial( Number(years[1].substring(1, 5)))

        for (let i = bilancoStart; i < gelirFinish; i++) {
            let cells = extractedText[i].split("|")
            let splitted = cells[0].split('.')
            if (splitted.length == 1 || cells.length == 1) {
                continue;
            }
            console.log(splitted, i)
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
            if( i >= gelirStart){
                code = "VI." + code
            }
            let number = parseFloat(cells[1].replaceAll('.', '').replaceAll(',', '.'))
            if (isNaN(number)) {
                continue
            }
            let codeSplitted = code.split(`.`)
            if(codeSplitted.length < 4){
                continue
            }

            if (number != 0 ) {
                financial.lines.push(new FinancialLine(BeyannameCodes[code].accountCode, number) )
            }
            if (cells.length >= 3) {
                let numberPrev = parseFloat(cells[2].replaceAll('.', '').replaceAll(',', '.'))
                if (isNaN(numberPrev)) {
                    continue
                }
                if (numberPrev != 0 ) {
                    financialPrev.lines.push( new FinancialLine(BeyannameCodes[code].accountCode, numberPrev) )
                }
            }
        }
        debugger
        return {financial, financialPrev}
    },
}


