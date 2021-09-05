import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RouteProp, useRoute } from '@react-navigation/core'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { InternalStackParamList } from '../../navigation'
import { useAuth } from '../../contexts/AuthContext'
import { User } from '../../models/User'
import { useTheme } from '@react-navigation/native'
import { Camera } from '../../components/Camera'
import { Gallery } from '../../components/Gallery'
import { TakePictureResponse } from 'react-native-camera'
import { PhotoIdentifier } from '@react-native-community/cameraroll'

function Profile() {

    // Hooks
    const { colors } = useTheme()
    const { user } = useAuth()
    const { params } = useRoute<RouteProp<InternalStackParamList, 'Profile'>>()

    // State
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User>()

    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [username, setUsername] = useState('')

    const [newProfilePic, setNewProfilePic] = useState<string>()
    const [showCamera, setShowCamera] = useState(false)
    const [showGallery, setShowGallery] = useState(false)

    // Constants
    const userId = params?.userId

    // Effects
    useEffect(() => {

        setLoading(true)

        firestore()
            .collection('users')
            .doc(userId || user?.uid)
            .get()
            .then(snapshot => {
                if (!snapshot.data()) return
                setSelectedUser(snapshot.data() as User)
                setUsername((snapshot.data() as User).displayName || '')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // Functions

    // Handlers
    async function handleEditUsername() {

        if (!username || !selectedUser) return

        try {
            await auth().currentUser?.updateProfile({
                displayName: username
            })

            firestore()
                .collection('users')
                .doc(user?.uid)
                .set({
                    displayName: username
                }, { merge: true })

            setSelectedUser({ ...selectedUser, displayName: username })
            setIsEditingUsername(false)
            
        } catch (error) {
            console.log(error)
        }
    }

    function handleTakePicture(picture: TakePictureResponse) {
        console.log(picture)
        setNewProfilePic(picture.uri)
    }
    
    function handleSelectPicture(picture: PhotoIdentifier) {
        console.log(picture)
        setNewProfilePic(picture.node.image.uri)
    }

    function handleUploadProfilePicture() {

        if (!user || !newProfilePic) return

        storage()
            .ref(`users/${user?.uid}.${newProfilePic.split('.').pop()}`)
            .putFile(newProfilePic)
            .then(async snapshot => {
                try {
                    const photoURL = await storage().ref(snapshot.metadata.fullPath).getDownloadURL()
                    auth().currentUser?.updateProfile({ photoURL })
                    setNewProfilePic(undefined)
                } catch (error) {
                    console.log(error)
                }
            })
    }

    // Render
    if (loading) return (
        <View style={[style.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon name='rocket-launch-outline' size={60} color={colors.text} />
            <Text style={[{ color: colors.text }]}>Loading...</Text>
        </View>
    )

    if (!selectedUser) return (
        <View style={[style.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon name='account-remove' size={60} color={colors.text} />
            <Text style={[{ color: colors.text }]}>User not found</Text>
        </View>
    )

    const isCurrentUser = selectedUser.uid === user?.uid

    return (
        <View style={[style.container]}>
            <View style={[style.profileHeader]}>
                <View style={{ alignItems: 'center' }}>
                    {newProfilePic ?
                        <Image source={{ uri: newProfilePic }} width={100} height={100} style={{ width: 100, height: 100, borderRadius: 1000 }} resizeMode='cover' /> :
                        selectedUser?.photoURL ?
                            <Image source={{ uri: selectedUser.photoURL }} width={100} height={100} style={{ width: 100, height: 100, borderRadius: 1000 }} resizeMode='cover' /> :
                            <Icon name='account-circle-outline' size={100} color={colors.text} />
                    }
                    {isCurrentUser &&
                        <View style={{ flexDirection: 'row' }}>
                            <Icon
                                name={newProfilePic ? 'close' : 'folder-multiple-image'}
                                onPress={newProfilePic ? () => setNewProfilePic(undefined) : () => setShowGallery(true)}
                                color={colors.text}
                                size={30}
                            />
                            <Icon
                                name={newProfilePic ? 'check' : 'camera'}
                                onPress={newProfilePic ? () => handleUploadProfilePicture() : () => setShowCamera(true)}
                                color={colors.text}
                                size={30}
                                style={{ marginLeft: 10 }}
                            />
                        </View>
                    }
                </View>
                <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }]}>
                    {isEditingUsername ?
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder='Your display name...'
                            placeholderTextColor='grey'
                            style={[style.username, style.usernameInput, { color: colors.text }]}
                        /> :
                        <Text style={[style.username, { color: colors.text }]}>
                            {selectedUser?.displayName || selectedUser.uid.slice(0, 6)}
                        </Text>
                    }
                    {isCurrentUser && <Icon name={isEditingUsername ? 'close' : 'pencil'} color={colors.text} size={30} onPress={() => setIsEditingUsername(!isEditingUsername)}/>}
                    {isCurrentUser && isEditingUsername && <Icon name='check' color={colors.text} size={30} onPress={() => handleEditUsername()}/>}
                    
                </View>
            </View>

            {showCamera &&
                <Camera
                    onTakePicture={photo => handleTakePicture(photo)}
                    onRequestClose={() => setShowCamera(false)}
                />
            }
            {showGallery &&
                <Gallery
                    selectMode='one'
                    onSelect={([photo]) => handleSelectPicture(photo)}
                    onRequestClose={() => setShowGallery(false)}
                />
            }
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20
    },
    username: {
        flex: 1,
        marginLeft: 20,
        fontSize: 30,
        fontWeight: 'bold',
    },
    usernameInput: {
        fontSize: 20
    }
})

export { Profile }
