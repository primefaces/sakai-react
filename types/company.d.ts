
declare namespace CompanyModule {
    declare class Company {
        id: string;
        name: string;
        establishmentDate?: Date;
        status?: string;
        comments?: string;
        attachments?: string;
        financials?: Financial[];
        reports?: Report[];
    }

    declare type FinancialPeriod = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH';

    declare type FinancialType = 'BALANCE' | 'REVISED_BALANCE';

    declare class Financial {
        id: string;
        name: string;
        year: number;
        period: FinancialPeriod;
        type: FinancialType;
        lines?: FinancialLine[];
    }

    declare class  FinancialLine {
        name: string;
        code: string;
        value: number;
        lines?: FinancialLine[];
    }

    declare type ReportType = 'COMPANY_VALUATION' | 'COMPANY_FINANCIALS'

    declare class Report {
        id: string;
        type: ReportType;
        companyId: string;
        requestedDate: Date;
        completeDate?: Date;
    }
}
