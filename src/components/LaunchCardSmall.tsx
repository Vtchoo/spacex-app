import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSpaceX } from '../contexts/SpaceX'
import { Launch } from '../services/spacex'
import DateUtils from '../utils/DateUtils'

interface LaunchCardSmallProps {
    launch: Launch
    style?: StyleProp<ViewStyle>
    onPress?(launch: Launch): void
}

function LaunchCardSmall({ launch, style = {}, ...props }: LaunchCardSmallProps) {

    const { colors } = useTheme()
    const { bookmarkedLaunches, bookmarkLaunch, removeLaunchBookmark } = useSpaceX()

    return (
        <View
            style={[styles.launchMiniCard, { backgroundColor: colors.card }, style]}
        >
            <TouchableOpacity
                onPress={() => props.onPress?.(launch)}
                style={{ alignItems: 'center' }}
            >
                {launch.links.patch.small ?
                    <Image width={75} height={75} source={{ uri: launch.links.patch.small }} resizeMode='contain' style={[styles.launchMiniCardBadge]} /> :
                    <Icon name='rocket-launch-outline' size={75} color='grey'/>
                }
                <Text style={[styles.launchMiniCardTitle, { color: colors.text }]} numberOfLines={1}>{launch.name}</Text>
                <Text style={[styles.launchMiniCardDate, { color: colors.text }]}>{DateUtils.format(new Date(launch.date_utc), 'dd/MM/yyyy hh:mm')}</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'stretch' }}>
                <Icon
                    name={bookmarkedLaunches.includes(launch.id) ? 'heart' : 'heart-outline'}
                    size={25}
                    color={colors.primary}
                    onPress={bookmarkedLaunches.includes(launch.id) ? () => removeLaunchBookmark(launch.id) : () => bookmarkLaunch(launch.id)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    
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

export { LaunchCardSmall }
