import { Client, Databases } from 'appwrite';

export const PROJECT_ID = '64eeff6c2605c79f89f3'
export const DATABASE_ID = '64ef076d3d4140f9b1c3'
export const COLLECTION_ID_MESSAGES = '64ef078ce5140f6859c2'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64eeff6c2605c79f89f3');

export const databases = new Databases(client);

export default client;