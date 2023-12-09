import {Client, Account, Databases} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6547677d91c83d2afab0'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
