import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { User } from '../models/User'
import firestore from '@react-native-firebase/firestore'

interface CommentProps {
    userId: string
    comment: string
    style?: StyleProp<ViewStyle>
}

function Comment({ userId, comment, style = {}, ...props }: CommentProps) {

    // Hooks
    const { colors } = useTheme()

    // State
    const [user, setUser] = useState<User>()

    // Effects
    useEffect(() => {

        firestore()
            .collection('users')
            .doc(userId)
            .get()
            .then(snapshot => {
                setUser(snapshot.data() as User)
            })

    }, [userId])

    // Render
    return (
        <View
            style={[styles.comment, style]}
        >
            <View style={{ width: 40, aspectRatio: 1 }}>
                {user?.photoURL ?
                    <Image
                        width={40} height={40}
                        source={{ uri: user.photoURL }}
                        style={{ width: '100%', aspectRatio: 1, borderRadius: 1000 }}
                        resizeMode='cover'
                    /> :
                    <Icon name='account-circle-outline' size={40} color='grey' />
                }
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                    {user?.displayName || userId.slice(0, 6)}
                </Text>
                <Text style={{ color: colors.text }}>
                    {comment}
                </Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        flexDirection: 'row'
    },
})

export { Comment }
