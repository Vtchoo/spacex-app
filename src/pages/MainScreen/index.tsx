import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Home } from '../Home'
import { View } from 'react-native'

const Tabs = createBottomTabNavigator()

function MainScreen() {

    const navigation = useNavigation()

    return (
        <Tabs.Navigator
            screenOptions={{
                headerRight: ({}) => <View/>
            }}
        >
            <Tabs.Screen
                name='Home'
                component={Home}
                options={{
                    tabBarIcon: ({ color, focused, size }) => <Icon name={focused ? 'rocket' : 'rocket-outline'} color={color} size={size}/>
                }}
            />
        </Tabs.Navigator>
    )
}

export { MainScreen }
