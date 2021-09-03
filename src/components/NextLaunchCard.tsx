import { useTheme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Launch } from '../services/spacex'
import DateUtils from '../utils/DateUtils'

interface NextLaunchCardProps {
    nextLaunch: Launch
}

function NextLaunchCard({ nextLaunch }: NextLaunchCardProps) {

    const { colors } = useTheme()

    const [countdown, setCoundown] = useState(Math.floor((new Date(nextLaunch.date_utc).getTime() - new Date().getTime()) / 1000))

    useEffect(() => {
        setTimeout(() => {
            setCoundown(countdown - 1)
        }, 1000)
    }, [countdown])

    const days = Math.floor(countdown / (24 * 60 * 60))
    const hours = Math.floor(countdown / (24 * 60)) % (24)
    const minutes = Math.floor(countdown / 60) % (60)
    const seconds = countdown % 60

    return (
        <View style={{ padding: 20 }}>
            <View style={[style.nextLaunchCard, { backgroundColor: colors.card }]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[{ color: colors.text }]}>Next launch</Text>
                        <Text style={[style.nextLaunchTitle, { color: colors.text }]}>{nextLaunch.name}</Text>
                        <Text style={[{ color: colors.text }]}>{nextLaunch.tdb ? 'Date yet to be defined' : DateUtils.format(new Date(nextLaunch.date_utc), 'dd/MM/yyyy')}</Text>
                    </View>
                    <Image width={100} height={100} source={{ uri: nextLaunch.links.patch.small }} style={{ width: 100, height: 100 }} />
                </View>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[style.countdownText, { color: colors.text }]}>{days.toString().padStart(2, '0')}</Text>
                        <Text style={[style.countdownTextSmall, { color: colors.text }]}>d</Text>
                    </View>
                    <Text style={[style.countdownText, { color: colors.text }]}>:</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[style.countdownText, { color: colors.text }]}>{hours.toString().padStart(2, '0')}</Text>
                        <Text style={[style.countdownTextSmall, { color: colors.text }]}>h</Text>
                    </View>
                    <Text style={[style.countdownText, { color: colors.text }]}>:</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[style.countdownText, { color: colors.text }]}>{minutes.toString().padStart(2, '0')}</Text>
                        <Text style={[style.countdownTextSmall, { color: colors.text }]}>m</Text>
                    </View>
                    <Text style={[style.countdownText, { color: colors.text }]}>:</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[style.countdownText, { color: colors.text }]}>{seconds.toString().padStart(2, '0')}</Text>
                        <Text style={[style.countdownTextSmall, { color: colors.text }]}>s</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
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
    },

    countdownText: {
        fontSize: 24
    },
    countdownTextSmall: {
        fontSize: 12
    }
})

export { NextLaunchCard }
