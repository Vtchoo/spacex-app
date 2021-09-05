import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Home } from '../Home'
import { Image, TouchableOpacity, View } from 'react-native'
import { Profile } from '../Profile'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InternalStackParamList } from '../../navigation'

const Tabs = createBottomTabNavigator()

function MainScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<InternalStackParamList>>()
    const { colors } = useTheme()
    const { user } = useAuth()

    return (
        <Tabs.Navigator
            screenOptions={{
                headerRight: ({ tintColor, pressColor }) =>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={{ flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon name='cog' size={35} color='grey'/>
                    </TouchableOpacity>
            }}
        >
            <Tabs.Screen
                name='Home'
                component={Home}
                options={{
                    tabBarIcon: ({ color, focused, size }) => <Icon name={focused ? 'earth' : 'earth'} color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ color, focused, size }) =>
                        user?.photoURL ?
                            <View style={{ overflow: 'hidden', borderWidth: 2, borderColor: color, borderRadius: size }}>
                                <Image
                                    source={{ uri: user.photoURL }}
                                    width={size} height={size}
                                    resizeMode='cover'
                                    style={{ height: size, width: size }}
                                />
                            </View> :
                            <Icon name={focused ? 'account-circle' : 'account-circle-outline'} color={color} size={size} />
                }}
            />
        </Tabs.Navigator>
    )
}

export { MainScreen }
