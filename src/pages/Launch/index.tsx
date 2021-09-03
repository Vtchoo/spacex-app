import { RouteProp, useRoute } from '@react-navigation/core'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'
import { InternalStackParamList } from '../../navigation'

function LaunchPage() {

    const { params: { launchId } } = useRoute<RouteProp<InternalStackParamList, 'Launch'>>()

    

    return (
        <View>

        </View>
    )
}

export { LaunchPage }
