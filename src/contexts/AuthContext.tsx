import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

interface AuthContextData {
    login(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>
    signup(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>
    logout(): Promise<void>
    user: FirebaseAuthTypes.User | null
    loggedIn: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setUser(user)
        })

        return () => unsubscribe()
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        return await auth().signInWithEmailAndPassword(email, password)
    }, [])

    const signup = useCallback(async (email: string, password: string) => {
        return await auth().createUserWithEmailAndPassword(email, password)
    }, [])

    const logout = useCallback(async () => {
        return await auth().signOut()
    }, [])

    return (
        <AuthContext.Provider value={{ login, signup, logout, user, loggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    return useContext(AuthContext)
}

export { AuthProvider, useAuth }
