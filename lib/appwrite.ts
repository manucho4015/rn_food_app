import { CreateUserParams, SignInParams } from "@/type"
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    prjectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: 'com.manucho.foodordering',
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userTableId: process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!
}

export const client = new Client()

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.prjectId).setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const tables = new TablesDB(client)
const avatars = new Avatars(client)

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if (!newAccount) throw Error

        await signIn({ email, password })

        const avatarUrl = avatars.getInitialsURL(name)

        return await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: ID.unique(),
            data: {
                accountId: newAccount.$id,
                email, name, avatar: avatarUrl
            }
        })

    } catch (error) {
        throw new Error(error as string)
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession({ email, password })
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error

        const currentUser = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [Query.equal('accountId', currentAccount.$id)]

        })

        if (!currentUser) throw Error

        return currentUser.rows[0]
    } catch (error) {
        console.log(error)
        throw new Error(error as string)
    }
}