import {NextRequest, NextResponse} from 'next/server'; // To handle the request and response
import PDFParser, {Output} from 'pdf2json';
import {BeyannameCodes} from "../../../demo/service/FinancialService";
import {Financial} from "../../../types/financial";
import {Company} from "../../../types/company";
import {FinancialLine} from "../../../types/financialLine";

export const runtime = 'nodejs'; // 'nodejs' is the default

function extractMap(pdfData: Output) {
    let retVal = '';
    let lines: any[] = []

    pdfData.Pages.forEach((page, index) => {
        let prevText: any = null;
        page.Texts.forEach((textObj, idx) => {
            if (prevText) {
                if (Math.abs(textObj.y - prevText.y) <= 0) {
                    prevText.R[0].T += '%7C' + textObj.R[0].T;
                } else {
                    let text = decodeURIComponent(prevText.R[0].T).trim()
                    retVal += text + '\r\n';
                    lines.push(text.split('|'))
                    prevText = textObj;
                }
            } else {
                prevText = textObj;
            }
        });
        if (prevText) {
            retVal += decodeURIComponent(prevText.R[0].T);
        }
    });
    return lines
}

function retrieveCompanyInfo(list: any[]) {
    let company = new Company()
    company.taxNo = list[12]
    company.name = list[13]
    return company;
}

function createBilancoTable(bilancoStart: number, bilancoFinish: number, list: any[]) {
    let last1Code = ''
    let last2Code = ''
    let financialPrevs: FinancialLine[] = []
    let financials: FinancialLine[] = []
    for (let i = bilancoStart; i < bilancoFinish; i++) {
        let splitted = list[i][0].split('.')
        if (splitted.length == 1) {
            continue;
        }
        console.log(splitted, i)
        if (list[i][0].startsWith('.   ')) {
            let last3Code = last2Code + splitted[1].trim() + '.';
            console.log("last3Code", last3Code)
            financials[BeyannameCodes[last3Code].accountCode] = new FinancialLine(list[i][1], last3Code, BeyannameCodes[last3Code].accountCode)
            financialPrevs[BeyannameCodes[last3Code].accountCode] = new FinancialLine(list[i][2], last3Code, BeyannameCodes[last3Code].accountCode)
        } else if (list[i][0].startsWith('. ')) {
            last2Code = last1Code + splitted[1].trim() + '.';
            console.log("last2Code", last2Code)
            financials[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][1], last2Code, BeyannameCodes[last2Code].accountCode)
            financialPrevs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][2], last2Code, BeyannameCodes[last2Code].accountCode)
        } else {
            last1Code =  splitted[0].trim() + '.';
            console.log("last1Code", last1Code)
            financials[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][1], last1Code, BeyannameCodes[last1Code].accountCode)
            financialPrevs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][2], last1Code, BeyannameCodes[last1Code].accountCode)
        }
    }
    return {financials, financialPrevs}
}

function createGelirTable(gelirStart: number, gelirFinish: number, list: any[]) {
    let last1Code = ''
    let last2Code = ''
    let gelirPrevs: FinancialLine[] = []
    let gelirs: FinancialLine[] = []
    for (let i = gelirStart; i < gelirFinish; i++) {
        let splitted = list[i][0].split('.')
        if (splitted.length == 1) {

        }
        console.log(splitted, i)
        if (list[i][0].startsWith('.   ')) {
            let last3Code = last2Code + splitted[1].trim() + '.';
            console.log("last3Code", last3Code)
            gelirs[BeyannameCodes[last3Code].accountCode] = new FinancialLine(list[i][1], last3Code, BeyannameCodes[last3Code].accountCode)
            gelirPrevs[BeyannameCodes[last3Code].accountCode] = new FinancialLine(list[i][2], last3Code, BeyannameCodes[last3Code].accountCode)
        } else if (list[i][0].startsWith('. ')) {
            last2Code = last1Code + splitted[1].trim() + '.';
            console.log("last2Code", last2Code)
            gelirs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][1], last2Code, BeyannameCodes[last2Code].accountCode)
            gelirPrevs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][2], last2Code, BeyannameCodes[last2Code].accountCode)
        } else {
            last1Code = 'VI.' + splitted[0].trim() + '.';
            console.log("last1Code", last1Code)
            gelirs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][1], last1Code, BeyannameCodes[last1Code].accountCode)
            gelirPrevs[BeyannameCodes[last2Code].accountCode] = new FinancialLine(list[i][2], last1Code, BeyannameCodes[last1Code].accountCode)
        }
    }
    return {gelirs, gelirPrevs}
}

function createFinancial(list: any[]) {
    let financial = new Financial()
    let year: number = list[5][1] as number
    financial.year = year
    let financialPrev = new Financial()
    financialPrev.year = year - 1
    let bilancoStart = 0
    let bilancoFinish = 0
    let gelirStart = 0
    let gelirFinish = 0
    for (let i = 0; i < list.length; i++) {
        if (list[i] == "E K L E R") {
            bilancoStart = i + 6
        } else if (list[i] == "DİPNOT") {
            if (bilancoFinish == 0) {
                bilancoFinish = i - 2
                gelirStart = i + 7
            } else
                gelirFinish = i - 1
        }
    }
    console.log(bilancoStart, bilancoFinish, gelirStart, gelirFinish)

    let {financials, financialPrevs} = createBilancoTable(bilancoStart, bilancoFinish, list);
    financial.bilancoLines = financials
    financialPrev.bilancoLines = financialPrevs
    createGelirTable(gelirStart, gelirFinish, list);

    return {financialPrev, financial};
}

export async function POST(req: NextRequest) {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll('cenk1');
    let fileName = '';
    let parsedText = '';
    if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0];
        console.log('Uploaded file:', uploadedFile);

        // Convert ArrayBuffer to Buffer
        const fileBuffer = Buffer.from(await (uploadedFile as File).arrayBuffer());
        const pdfParser = new (PDFParser as any)(null, 1);

        // See pdf2json docs for more info on how the below works.
        pdfParser.on('pdfParser_dataError', (errData: any) =>
            console.log(errData.parserError)
        );

        pdfParser.on("pdfParser_dataReady", (pdfData: Output) => {
            let list = extractMap(pdfData);
            let company: Company = retrieveCompanyInfo(list)
            let {financialPrev, financial} = createFinancial(list)
            company.financials.push(financialPrev)
            company.financials.push(financial)
            console.log(financial)
        });

        pdfParser.parseBuffer(fileBuffer);
    } else {
        console.log('No files found.');
    }

    const response = new NextResponse(parsedText);
    response.headers.set('FileName', fileName);
    return response;
}