

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    prjectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    platform: 'com.manucho.foodordering',
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userTableId: process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID
}