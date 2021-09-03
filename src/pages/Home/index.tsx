import { useTheme } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NextLaunchCard } from '../../components/NextLaunchCard'
import { useAuth } from '../../contexts/AuthContext'
import { useSpaceX } from '../../contexts/SpaceX'
import SpaceX, { Launch } from '../../services/spacex'
import DateUtils from '../../utils/DateUtils'

function Home() {

    // Hooks
    const { colors } = useTheme()
    const { user } = useAuth()
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
            {nextLaunch && <NextLaunchCard nextLaunch={nextLaunch}/>}
            
            <Text style={[style.title, { color: colors.text }]}>Previous launches</Text>
            <FlatList
                data={pastLaunches}
                keyExtractor={launch => launch.id}
                renderItem={({ item, index }) =>
                    <View
                        style={[style.launchMiniCard, { backgroundColor: colors.card, marginLeft: index ? 10 : 0 }]}
                    >
                        <Image width={75} height={75} source={{ uri: item.links.patch.small }} resizeMode='contain' style={[style.launchMiniCardBadge]} />
                        <Text style={[style.launchMiniCardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                        <Text style={[style.launchMiniCardDate, { color: colors.text }]}>{DateUtils.format(new Date(item.date_utc), 'dd/MM/yyyy hh:mm')}</Text>
                        <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'stretch' }}>
                            <Icon
                                name={bookmarkedLaunches.includes(item.id) ? 'heart' : 'heart-outline'}
                                size={25}
                                color={colors.primary}
                                onPress={bookmarkedLaunches.includes(item.id) ? () => removeLaunchBookmark(item.id): () => bookmarkLaunch(item.id)}
                            />
                        </View>
                    </View>
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

    launchMiniCard: {
        alignItems: 'center',
        width: 120,
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        shadowColor: 'white'
    },
    launchMiniCardBadge: {
        width: '100%',
        aspectRatio: 1
    },
    launchMiniCardTitle: {
        marginTop: 5,
        // textAlign: 'center',
        // alignSelf: 'stretch',
        fontSize: 12,
        fontWeight: 'bold',
    },
    launchMiniCardDate: {
        textAlign: 'center',
        fontSize: 8
    }
})

export { Home }
