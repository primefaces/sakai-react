import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {Contact} from "./types/contact/Contact";

export const CONTACTS_DATABASE_ID = "654769c9344dffc7dd50";
export const CONTACTS_COLLECTION_ID = "656a00d52804694b6704";

export const ContactService = {

    async list(queries: string[] = []) {
        queries.push(Query.orderDesc("$createdAt"), Query.limit(10))
        return await databases.listDocuments(
            CONTACTS_DATABASE_ID,
            CONTACTS_COLLECTION_ID,
            queries
        );
    },

    async getByCompanyId(companyId: string) {
        return await databases.listDocuments(
            CONTACTS_DATABASE_ID,
            CONTACTS_COLLECTION_ID,
            [
                Query.equal("companyId", companyId),
                Query.orderDesc("$createdAt"), Query.limit(1)
            ]
        );
    },

    async add(contact: Contact) {
        return await databases.createDocument(
            CONTACTS_DATABASE_ID,
            CONTACTS_COLLECTION_ID,
            ID.unique(),
            contact
        );
    },

    async update(id: string, data: Contact) {
        return await databases.updateDocument(CONTACTS_DATABASE_ID, CONTACTS_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(CONTACTS_DATABASE_ID, CONTACTS_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}


