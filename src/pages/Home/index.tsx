import { useTheme } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NextLaunchCard } from '../../components/NextLaunchCard'
import { useAuth } from '../../contexts/AuthContext'
import { useSpaceX } from '../../contexts/SpaceX'
import SpaceX, { Launch } from '../../services/spacex'
import DateUtils from '../../utils/DateUtils'
import { useNavigation } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InternalStackParamList } from '../../navigation'
import { LaunchCardSmall } from '../../components/LaunchCardSmall'

function Home() {

    // Hooks
    const { colors } = useTheme()
    const { user } = useAuth()
    const navigation = useNavigation<NativeStackNavigationProp<InternalStackParamList>>()
    const { bookmarkedLaunches, bookmarkLaunch, removeLaunchBookmark } = useSpaceX()

    // Next launch
    const [nextLaunch, setNextLaunch] = useState<Launch>()

    // Past launches
    const [pastLaunches, setPastLaunches] = useState<Launch[]>([])
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)

    useEffect(() => {
        fetchNextLaunch()
        fetchPastLaunches()
    }, [])
    
    const fetchNextLaunch = useCallback(async () => {
        try {
            const nextLaunch = await SpaceX.getNextLaunch()
            setNextLaunch(nextLaunch)
        } catch (error) {
            alert(JSON.stringify(error))
        }
    }, [])

    async function fetchPastLaunches() {

        if (!hasNextPage) return

        try {
            const result = await SpaceX.queryLaunches({ upcoming: false }, { limit, page, sort: { flight_number: 'desc' } })
            setHasNextPage(result.hasNextPage)
            setPage(result.nextPage)
            setPastLaunches([...pastLaunches, ...result.docs])
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <ScrollView style={[style.container]}>
            {nextLaunch &&
                <View style={{ padding: 20 }}>
                    <NextLaunchCard
                        nextLaunch={nextLaunch}
                        onPress={launch => navigation.navigate('Launch', { launchId: launch.id })}
                    />
                </View>
            }
            
            <Text style={[style.title, { color: colors.text }]}>Previous launches</Text>
            <FlatList
                data={pastLaunches}
                keyExtractor={launch => launch.id}
                renderItem={({ item, index }) =>
                    <LaunchCardSmall
                        launch={item}
                        onPress={launch => navigation.navigate('Launch', { launchId: launch.id })}
                        style={{ marginLeft: index ? 20 : 0 }}
                    />
                }
                horizontal
                contentContainerStyle={{ padding: 20 }}

                onEndReachedThreshold={.1}
                onEndReached={fetchPastLaunches}
            />
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },

    title: {
        marginHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 18
    },

    nextLaunchCard: {
        padding: 20,
        borderRadius: 10,

        elevation: 20,
        shadowColor: 'cyan',
    },
    nextLaunchTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },

    // launchMiniCard: {
    //     alignItems: 'center',
    //     width: 120,
    //     padding: 20,
    //     borderRadius: 10,
    //     elevation: 10,
    //     shadowColor: 'white'
    // },
    // launchMiniCardBadge: {
    //     width: '100%',
    //     aspectRatio: 1
    // },
    // launchMiniCardTitle: {
    //     marginTop: 5,
    //     // textAlign: 'center',
    //     // alignSelf: 'stretch',
    //     fontSize: 12,
    //     fontWeight: 'bold',
    // },
    // launchMiniCardDate: {
    //     textAlign: 'center',
    //     fontSize: 8
    // }
})

export { Home }
