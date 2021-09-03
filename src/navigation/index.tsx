import React from 'react'
import { NavigationContainer, DarkTheme, useNavigation, ThemeProvider } from "@react-navigation/native"
import { useAuth } from "../contexts/AuthContext"
import { Login } from "../pages/Login"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SignUp } from "../pages/SignUp"
import { Home } from '../pages/Home'
import { Settings } from '../pages/Settings'
import { StatusBar, ToolbarAndroidComponent, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MainScreen } from '../pages/MainScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const Stack = createNativeStackNavigator()

function Navigation() {

    const { loggedIn } = useAuth()

    return (
        <NavigationContainer
            theme={DarkTheme}
        >
            <StatusBar backgroundColor={DarkTheme.colors.card} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!loggedIn ?
                    <>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='SignUp' component={SignUp} />
                    </> :
                    <>
                        <Stack.Screen name='Main' component={MainScreen} />
                        <Stack.Screen name='Settings' component={Settings}/>
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}


type RootStackParamList = {
    'SignUp': undefined
    'Login': undefined
}

export type { RootStackParamList }
export default Navigation
