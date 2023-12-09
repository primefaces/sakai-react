import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {Partnership} from "./types/company/partnership/Partnership";
import {PartnershipDuty} from "./types/company/partnership/PartnershipDuty";

export const PARTNERSHIPS_DATABASE_ID = "654769c9344dffc7dd50";
export const PARTNERSHIPS_COLLECTION_ID = "656a008434bc12bc40e1";

export const PartnershipService = {
    getDuties() {
        let list = []
        for (let partnershipDuty in PartnershipDuty) {
            list.push(partnershipDuty)
        }
        return list
    },

    async getPartnerships() {
        let res = await fetch('/demo/data/financials.json', {headers: {'Cache-Control': 'no-cache'}});
        let d: any = await res.json();
        return d.data as Partnership[];
    },

    async list(queries: string[] = []) {
        queries.push(Query.orderDesc("$createdAt"), Query.limit(10))
        return await databases.listDocuments(
            PARTNERSHIPS_DATABASE_ID,
            PARTNERSHIPS_COLLECTION_ID,
            queries
        );
    },

    async add(financial: Partnership) {
        return await databases.createDocument(
            PARTNERSHIPS_DATABASE_ID,
            PARTNERSHIPS_COLLECTION_ID,
            ID.unique(),
            financial
        );
    },

    async update(id: string, data: Partnership) {
        return await databases.updateDocument(PARTNERSHIPS_DATABASE_ID, PARTNERSHIPS_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(PARTNERSHIPS_DATABASE_ID, PARTNERSHIPS_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}


