export class FinancialLine {

    constructor(key: string, value = 0, revised = undefined) {
        this.key = key;
        this.value = value;
        this.revised = revised;
    }

    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    key: string;
    value: number = 0;
    revised?: number;
}