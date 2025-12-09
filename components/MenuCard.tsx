import { appwriteConfig } from '@/lib/appwrite'
import { MenuItem } from '@/type'
import React from 'react'
import { Image, Platform, Text, TouchableOpacity } from 'react-native'

const MenuCard = ({ item: { image_url, name, price } }: { item: MenuItem }) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`
    const testURl = `https://fra.cloud.appwrite.io/v1/storage/buckets/6931b684002d71f893de/files/view?project=693011440016be452e2c`
    return (
        <TouchableOpacity className='menu-card' style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}>
            <Image source={{ uri: testURl }} className='size-32 absolute -top-10' resizeMode='contain' />
            <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
            <Text className='body-reglar text-gray-200 mb-4'>From ${price}</Text>
            <TouchableOpacity onPress={() => { }}>
                <Text className='paragraph-bold text-primary'>Add to Cart</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MenuCard