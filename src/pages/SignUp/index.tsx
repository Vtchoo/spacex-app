import React, { useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation'
import { useAuth } from '../../contexts/AuthContext'

function SignUp() {

    // Hooks
    const { colors } = useTheme()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>()
    const { signup } = useAuth()

    // State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hidePassword, setHidePassword] = useState(true)

    // Functions
    async function createAccount() {

        if (password !== confirmPassword) return alert('Passwords don\'t match')

        try {
            await signup(email, password)
        } catch (error) {
            alert(JSON.stringify(error))
        }
    }

    // Render
    return (
        <View style={[style.container]}>
            <Text style={[{ color: colors.text, textAlign: 'center' }, style.gap]}>Create new account</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='Email'
                placeholderTextColor='grey'
                keyboardType='email-address'
                autoCapitalize='none'
                style={[style.gap, style.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Password'
                placeholderTextColor='grey'
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                style={[style.gap, style.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                />
            <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder='Confirm your password'
                placeholderTextColor='grey'
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                style={[style.gap, style.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            />
            <TouchableOpacity
                onPress={createAccount}
                style={[style.gap, style.button, { backgroundColor: colors.primary }]}
            >
                <Text style={[{ color: colors.text }]}>Create account</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={[style.gap, style.button]}
            >
                <Text style={[{ color: colors.text }]}>Back to login</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    input: {
        borderWidth: 1,
        borderRadius: 5
    },
    button: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },

    gap: {
        marginBottom: 20
    }
})

export { SignUp }
