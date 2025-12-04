import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const { email, password, name } = form

    const submit = async () => {
        if (!name || !email || !password) return Alert.alert('Error', 'Please enter valid email address & password')

        setIsSubmitting(true)

        try {
            await createUser({
                email, password, name
            })

            router.replace('/')
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

            <CustomInput
                placeholder='Enter your full name'
                value={name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                label='Full Name' />

            <CustomInput
                placeholder='Enter your email'
                value={email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                label='Email'
                keyboardType='email-address' />

            <CustomInput
                placeholder='Enter your password'
                value={password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                label='Password'
                secureTextEntry={true} />

            <CustomButton
                title='Sign Up'
                isLoading={isSubmitting}
                onPress={submit} />

            <View className='flex justify-center mt-5  flex-row gap-2'>
                <Text className='base-regular text-gray-100'>Already have an account?</Text>
                <Link href='/sign-in' className='base-bold text-primary'>Sign In</Link>
            </View>
        </View>
    )
}

export default SignUp