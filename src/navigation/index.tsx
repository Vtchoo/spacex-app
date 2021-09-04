import React from 'react'
import { NavigationContainer, DarkTheme, useNavigation, ThemeProvider } from "@react-navigation/native"
import { CompositeNavigationProp } from '@react-navigation/core'
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
import { LaunchPage } from '../pages/Launch'
import { Profile } from '../pages/Profile'


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
                    animation: 'fade_from_bottom'
                }}
            >
                {!loggedIn ?
                    <>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='SignUp' component={SignUp} />
                    </> :
                    <>
                        <Stack.Screen name='Main' component={MainScreen} />
                        <Stack.Screen name='Settings' component={Settings} />
                        <Stack.Screen name='Launch' component={LaunchPage} />
                        <Stack.Screen name='Profile' component={Profile} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}


type ExternalRootStackParamList = {
    'SignUp': undefined
    'Login': undefined
}

type InternalStackParamList = {
    Main: undefined
    Settings: undefined
    Launch: { launchId: string }
    Profile: { userId?: string }
}

export type { ExternalRootStackParamList, InternalStackParamList }
export default Navigation
