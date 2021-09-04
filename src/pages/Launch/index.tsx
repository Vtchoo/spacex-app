import { RouteProp, useRoute } from '@react-navigation/core'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Image, LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { InternalStackParamList } from '../../navigation'
import SpaceX, { Launch } from '../../services/spacex'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '@react-navigation/native'
import { useAuth } from '../../contexts/AuthContext'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'

function LaunchPage() {

    // Hooks
    const { user } = useAuth()
    const { colors } = useTheme()
    const { params: { launchId } } = useRoute<RouteProp<InternalStackParamList, 'Launch'>>()

    const [loading, setLoading] = useState(true)
    const [launch, setLaunch] = useState<Launch>()

    const [showDetails, setShowDetails] = useState(false)

    // Comment
    const [comment, setComment] = useState('')

    // Effects
    useEffect(() => {
        fetchLaunch()
    }, [launchId])

    // Functions
    async function fetchLaunch() {
        setLoading(true)

        try {
            const launch = await SpaceX.getLaunchById(launchId)
            setLaunch(launch)
        } catch (error) {
            console.log(error)
            ToastAndroid.show(`Error while fetching launch data`, ToastAndroid.LONG)
        }

        setLoading(false)
    }

    // Firebase
    const [loadingComments, setLoadingComments] = useState(false)
    const [comments, setComments] = useState<{ [key: string]: { user: string, comment: string } }>({})
    const [commentsPerPage, setCommentsPerPage] = useState(10)
    const [cursor, setCursor] = useState<string | null>(null)

    useEffect(() => {
        fetchComments()
    }, [launch])

    function fetchComments() {
        if (!launch) return

        setLoadingComments(true)
        
        const ref = database()
            .ref(`/spacexdata/launches/${launchId}/comments`)
            .orderByKey()
        
        if (cursor) ref.startAt(cursor)
        
        ref.limitToFirst(cursor ? commentsPerPage + 1 : commentsPerPage)
            .once('value', snapshot => {
                
                setLoadingComments(false)
                
                if (!snapshot || !snapshot.val()) return
                
                setCursor(Object.keys(snapshot.val()).pop() as string)
                setComments(comments => ({ ...comments, ...snapshot.val() }))
            })
    }

    async function addComment() {

        if (!comment || !user) return

        try {
            const ref = database().ref(`/spacexdata/launches/${launchId}/comments`).push()
            const key = ref.key
            
            await ref.set({ user: user?.uid, comment })
            
            setComment('')
            setComments({ ...comments, [key as string]: { user: user.uid, comment }})
        } catch (error) {
            console.log(error)
        }
    }

    // Render
    if (loading) return (
        <View style={[style.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name='rocket-launch' size={60} color={colors.primary}/>
            <Text style={{ color: colors.text }}>Loading launch data...</Text>
        </View>
    )

    if (!launch) return (
        <View style={[style.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name='rocket' size={60} color={colors.primary}/>
            <Text style={{ color: colors.text }}>Launch not found</Text>
        </View>
    )

    return (
        <ScrollView style={[style.container]}>
            <Image
                source={{ uri: launch.links.patch.large }}
                width={200} height={200}
                resizeMode='contain'
                style={[style.patch]}
            />
            <Text style={[style.launchName, { color: colors.text }]}>{launch.name}</Text>
            
            <TouchableOpacity
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    setShowDetails(!showDetails)
                }}
                activeOpacity={.9}
            >
                <Text
                    numberOfLines={!showDetails ? 4 : undefined}
                    style={[style.details, { color: colors.text }]}
                >
                    {launch.details}
                </Text>
                <Icon name={showDetails ? 'chevron-up' : 'dots-horizontal'} size={30} color={colors.text} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>

            <Text style={[style.title, { color: colors.text }]}>Comments</Text>
            <View style={[style.newComment, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'row' }]}>
                <View style={{ width: 50, aspectRatio: 1 }}>
                    {user?.photoURL ?
                        <Image width={50} height={50} source={{ uri: user.photoURL }} style={{ width: '100%', aspectRatio: 1 }} /> :
                        <Icon name='account-circle-outline' size={50} color='grey' />
                    }
                </View>
                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder='Add new comment...'
                    placeholderTextColor='grey'
                    style={[style.newCommentInput, { color: colors.text, borderColor: colors.border }]}
                />
                <Icon name='send-circle' size={30} color={colors.primary} style={{ alignSelf: 'flex-end' }} onPress={addComment} />
            </View>

            <View style={[style.comments]}>
                {Object.keys(comments).map((key, i) => 
                    <View
                        key={key}
                        style={[style.comment, { marginTop: i ? 10 : 0 }]}
                    >
                        <View style={{ width: 40, aspectRatio: 1 }}>
                            {user?.photoURL ?
                                <Image
                                    width={40} height={40}
                                    source={{ uri: user.photoURL }}
                                    style={{ width: '100%', aspectRatio: 1 }}
                                /> :
                                <Icon name='account-circle-outline' size={40} color='grey' />
                            }
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                                {comments[key].user.slice(0, 7)}
                            </Text>
                            <Text style={{ color: colors.text }}>
                                {comments[key].comment}
                            </Text>

                        </View>
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={[style.loadCommentsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={fetchComments}
                disabled={loadingComments}
            >
                <Text style={{ color: colors.text }}>{loadingComments ? 'Loading...' : 'Load more comments...'}</Text>
            </TouchableOpacity>

            {/* <Text style={{ color: colors.text }}>{JSON.stringify(comments)}</Text>
            <Icon name='plus-circle' size={40} color='white' onPress={fetchComments}/> */}
            
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    patch: {
        margin: 20,
        alignSelf: 'center',
        width: '75%',
        aspectRatio: 1
    },
    launchName: {
        alignSelf: 'center',
        fontSize: 40,
        textAlign: 'center'
    },
    details: {
        margin: 20
    },
    
    title: {
        marginHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 18
    },

    newComment: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 20
    },
    newCommentInput: {
        flex: 1,
        borderLeftWidth: 1,
        marginLeft: 10,
        paddingLeft: 10,
        textAlignVertical: 'top'
    },

    comments: {
        margin: 20,
        marginTop: 0
    },
    comment: {
        flexDirection: 'row'
    },
    loadCommentsButton: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        margin: 20,
        marginTop: 0
    }
})

export { LaunchPage }
