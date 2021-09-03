import { NavigationProp, useNavigation, useTheme } from "@react-navigation/native"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types"
import React, { useState } from "react"
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useAuth } from "../../contexts/AuthContext"
import { RootStackParamList } from "../../navigation"

function Login() {

    // Hooks
    const { colors } = useTheme()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignUp'>>()
    const { login } = useAuth()

    // State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Functions
    async function handleLogin() {

        try {
            await login(email, password)
        } catch (error) {
            alert(JSON.stringify(error))
        }
    }

    // Render
    return (
        <View style={[style.container]}>
            <Text style={[{ color: colors.text, textAlign: 'center' }, style.gap]}>Login</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={[style.gap, style.input, { backgroundColor: colors.card, borderColor: colors.border }]}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                style={[style.gap, style.input, { backgroundColor: colors.card, borderColor: colors.border }]}
            />
            <TouchableOpacity
                onPress={handleLogin}
                style={[style.gap, style.button, { backgroundColor: colors.primary }]}
            >
                <Text style={[{ color: colors.text }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={[style.gap, style.button]}
            >
                <Text style={[{ color: colors.text }]}>Create account</Text>
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

export { Login }
