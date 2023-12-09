import {ReportStatus} from "./ReportStatus";

export class Report {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;

    companyId: string = ''
    status: ReportStatus = ReportStatus.REQUESTED
    assignedUserId? : string
    requestedDate: Date = new Date()
    reportDate?: Date
    fileId? :string
}