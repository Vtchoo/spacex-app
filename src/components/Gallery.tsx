import React, { useCallback, useEffect, useState } from 'react'
import { Platform, PermissionsAndroid, Dimensions, FlatList, Image, ImageBackground, Modal, NativeScrollEvent, NativeSyntheticEvent, ToastAndroid, TouchableOpacity, View } from 'react-native'
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet } from 'react-native'

interface GalleryProps {
    selectMode: 'one' | 'many'
    onSelect(photos: PhotoIdentifier[]): void
    onRequestClose(): void
}

function Gallery({ ...props }: GalleryProps) {

    // Hooks

    // State
    const [loading, setLoading] = useState(false)

    const [cursor, setCursor] = useState<string | undefined>('0')
    const [maxCount, setMaxCount] = useState(10)
    const [items, setItems] = useState<PhotoIdentifier[]>([])
    const [selectedItems, setSelectedItems] = useState<PhotoIdentifier[]>([])

    const [scrollIndex, setScrollIndex] = useState(0)

    // Effects
    useEffect(() => { fetchItems() }, [])

    async function hasAndroidPermission() {
        const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE

        const hasPermission = await PermissionsAndroid.check(permission)
        if (hasPermission) return true

        const status = await PermissionsAndroid.request(permission)
        return status === 'granted'
    }

    // Functions
    async function fetchItems() {

        if (loading) return

        if (Platform.OS === "android" && !(await hasAndroidPermission())) return

        try {
            setLoading(true)
            
            const results = await CameraRoll.getPhotos({
                first: 10,
                after: cursor,
                assetType: 'Photos',
                include: ['filename', 'imageSize']
            })

            setItems(items => [...items, ...results.edges])
            setCursor(results.page_info.end_cursor)

        } catch (error) {
            console.log(error)
        }

        setLoading(false)

    }

    // Events
    function handleScroll({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) {
        const index = Math.round(nativeEvent.contentOffset.x / nativeEvent.contentSize.width * selectedItems.length)
        
        if (index !== scrollIndex)
            setScrollIndex(index)
    }

    // Handlers
    const handleSelectItem = useCallback((item: PhotoIdentifier) => {
        setSelectedItems(items => {
            
            if (items.includes(item)) return items.filter(i => i !== item)
            

            if (props.selectMode === 'one') return [item]
            
            return [...items, item]
        })
    }, [props.selectMode])

    function handleSelectItems() {

        props.onSelect(selectedItems)
        props.onRequestClose()
    }

    // Render
    return (
        <Modal
            transparent
            presentationStyle='overFullScreen'
            onRequestClose={props.onRequestClose}
        // statusBarTranslucent
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.95)', width: '100%' }}>
                <FlatList
                    data={selectedItems}
                    horizontal
                    keyExtractor={(item) => item.node.image.uri}
                    style={{ flex: 1 }}
                    contentContainerStyle={{}}
                    // contentContainerStyle={{ width: `100%` }}
                    pagingEnabled
                    
                    renderItem={({ item, index }) =>
                        <View
                            // key={item.node.image.uri}
                            style={{ width: Dimensions.get('window').width }}
                        >
                            <Image
                                source={{ uri: item.node.image.uri }}
                                resizeMode='contain'
                                style={{ width: '100%', height: '100%', }}
                            />
                        </View>
                    }
                    onScroll={handleScroll}
                />
                {/* <ScrollView
                    style={{ flex: 1 }}
                    horizontal
                    contentContainerStyle={{ width: `${selectedItems.length * 100}%` }}
                    pagingEnabled
                    onScroll={handleScroll}
                >
                    {selectedItems.map((item, i) =>
                        <View
                            key={item.node.image.uri}
                            style={{ flex: 1 }}
                        >
                            <Image
                                source={{ uri: item.node.image.uri }}
                                resizeMode='contain'
                                style={{ width: '100%', height: '100%', }}
                            />
                        </View>
                    )}
                </ScrollView> */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                    {selectedItems.map((_, i) =>
                        <Icon
                            key={i}
                            name={scrollIndex === i ? 'circle' : 'circle-outline'}
                            size={10}
                            color='white'
                            style={{ marginLeft: i > 0 ? 5 : 0 }}
                        />
                    )}
                </View>
                <View>
                    <FlatList
                        data={items}
                        horizontal
                        contentContainerStyle={{ padding: 20 }}
                        keyExtractor={item => item.node.image.uri}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                style={{ width: 100, aspectRatio: 1 }}
                                onPress={() => handleSelectItem(item)}
                            >
                                <ImageBackground
                                    source={{ uri: item.node.image.uri }}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <Icon
                                        name={selectedItems.includes(item) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        color={selectedItems.includes(item) ? 'green' : 'white'}
                                        size={25}
                                        style={{ backgroundColor: 'rgba(0,0,0,.05)', elevation: 10, alignSelf: 'flex-start' }}
                                    // style={[styles.checkBox]}
                                    />
                                </ImageBackground>
                            </TouchableOpacity>
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                        onEndReached={fetchItems}
                        onEndReachedThreshold={.1}
                    />
                </View>
                <View style={{ flexDirection: 'row', margin: 20, marginTop: 0 }}>
                    <TouchableOpacity
                        onPress={props.onRequestClose}
                        style={{ flex: 1, backgroundColor: 'white', padding: 5, alignItems: 'center' }}
                    >
                        <Icon name='close' size={25} color='red' />
                    </TouchableOpacity>
                    {selectedItems.length > 0 &&
                        <TouchableOpacity
                            onPress={() => handleSelectItems()}
                            style={{ flex: 1, backgroundColor: 'white', padding: 5, alignItems: 'center', marginLeft: 10  }}
                        >
                            <Icon name='check' size={25} color='green' />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    checkBox: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        alignSelf: 'flex-end',
        margin: 5
    }
})

export { Gallery }
