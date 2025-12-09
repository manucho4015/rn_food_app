import { ID } from "react-native-appwrite";
import { appwriteConfig, storage, tables } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(tableId: string): Promise<void> {
    const list = await tables.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId
    });

    await Promise.all(
        list.rows.map((row) =>
            tables.deleteRow({ databaseId: appwriteConfig.databaseId, tableId, rowId: row.$id })
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles({ bucketId: appwriteConfig.bucketId });

    await Promise.all(
        list.files.map((file: any) =>
            storage.deleteFile({ bucketId: appwriteConfig.bucketId, fileId: file.$id })
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    console.log('start file processing')
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    console.log('fileObj: ', fileObj)

    let fileId = ''

    const file = await storage.createFile({
        bucketId: appwriteConfig.bucketId,
        fileId: ID.unique(),
        file: fileObj
    }).then((rowFile) => { console.log('file created'); fileId = rowFile.$id }).catch((err) => console.log('Error creating file: ', err));

    console.log('file: ', file)

    return storage.getFileViewURL(appwriteConfig.bucketId, fileId);
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesTableId).then(() => console.log('categories table cleared'));
    await clearAll(appwriteConfig.customizationsTableId).then(() => console.log('customizations table cleared'));
    await clearAll(appwriteConfig.menuTableId).then(() => console.log('menu table cleared'));
    await clearAll(appwriteConfig.menuCustomizationsTableId).then(() => console.log('menu customizations table cleared'));
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesTableId,
            rowId: ID.unique(),
            data: cat
        }).then((doc) => {
            console.log(`${doc.name} category added`)
            categoryMap[cat.name] = doc.$id;
        }).catch((err) => console.error('Error adding category', err));
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.customizationsTableId,
            rowId: ID.unique(),
            data: {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        }).then((row) => {
            customizationMap[cus.name] = row.$id;
            console.log(`${row.name} customization created`)
        }).catch((err) => console.error('Error creating menu item: ', err));
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {

        const uploadedImage = await uploadImageToStorage(item.image_url);
        let rowId: string = ''

        console.log('url: ', uploadedImage)

        await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.menuTableId,
            rowId: ID.unique(),
            data: {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        }).then((row) => {
            menuMap[item.name] = row.$id;
            rowId = row.$id
            console.log(`${item.name} Menu item created`)
        }).catch((err) => console.log('Error creating menu item: ', err));


        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await tables.createRow({
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.menuCustomizationsTableId,
                rowId: ID.unique(),
                data: {
                    menu: rowId,
                    customizations: customizationMap[cusName],
                }
            }).then((row) => {
                console.log('Menu customization created')
            }).catch((err) => console.error('Error creating menu customization item: ', err));
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;