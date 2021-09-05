import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Dimensions, GestureResponderEvent, Modal, NativeTouchEvent, PermissionsAndroid, Platform, ScaledSize, StatusBar, StyleSheet, Text, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { BarCodeReadEvent, Point, RNCamera, TakePictureOptions, TakePictureResponse } from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface CameraProps {
    onTakePicture?(picture: TakePictureResponse): void
    onRequestClose(): void
    onBarCodeRead?(e: BarCodeReadEvent): void
}

//
// TODO: Implement pinch gesture handler
// Doesn't work with Modal, find workaround
//

function Camera({ ...props }: CameraProps) {

    // Refs
    const cameraRef = useRef<RNCamera>(null)

    // Hooks
    
    // State
    const [isLandscape, setIsLandscape] = useState(false)

    const [ratios, setRatios] = useState<string[]>([])
    const [ratio, setRatio] = useState<string>('4:3')
    
    const [flashMode, setFlashMode] = useState<"on" | "off" | "torch" | "auto">(RNCamera.Constants.FlashMode.off)
    
    const [autoFocusPointOfInterest, setAutoFocusPointOfInterest] = useState<{ x: number, y: number }>()
    
    // Effects
    useEffect(() => {
        
        // Detect first orientation
        const { width, height } = Dimensions.get('screen')
        setIsLandscape(width > height)

        // Add event listener to detect next changes
        const handler = ({ screen }: {screen: ScaledSize, window: ScaledSize}) => {
            setIsLandscape(screen.width > screen.height)
        }
        
        Dimensions.addEventListener('change', handler)
        
        return () => Dimensions.removeEventListener('change', handler)
    }, [])

    // Functions
    const toast = (message: string) => ToastAndroid.show(message, ToastAndroid.LONG)
    
    async function hasAndroidPermission() {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE

        const hasPermission = await PermissionsAndroid.check(permission)
        if (hasPermission) return true

        const status = await PermissionsAndroid.request(permission)
        return status === 'granted'
    }

    async function getCameraInfo() {

        try {
            const ratios = await cameraRef.current?.getSupportedRatiosAsync()
            setRatios(ratios || [])
            // alert(JSON.stringify(cameraIds))
        } catch (error) {

        }
    }

    function getRatioFromString() {
        const [ratioWidth, ratioHeight] = ratio.split(':').map(str => parseInt(str))
        return ratioWidth / ratioHeight
    }

    // Handlers
    async function handleTakePicture() {

        if (!cameraRef.current) return

        try {
            const options: TakePictureOptions = {
                fixOrientation: true,
                pauseAfterCapture: true
            }

            const picture = await cameraRef.current.takePictureAsync(options)

            // alert(JSON.stringify(picture))

            // // Check permission
            // if (Platform.OS === "android" && !(await hasAndroidPermission())) return
            // // Save using camera roll
            // CameraRoll.save(picture.uri)

            props.onTakePicture?.(picture)
            props.onRequestClose()
        } catch (error) {
            console.log(error)
        }
        
    }
    //
    // How to save picture
    //  
    // // Check permission
    // if (Platform.OS === "android" && !(await hasAndroidPermission())) return
    // // Save using camera roll
    // CameraRoll.save(picture.uri)

    function handleBarCodeRead(event: BarCodeReadEvent) {
        props.onBarCodeRead?.(event)
    }

    function handleAutoFocus(point: Point<number>) {

        const { width, height } = Dimensions.get('window')

        const containerWidth = isLandscape ? height * getRatioFromString() : width
        const containerHeight = isLandscape ? height : width * getRatioFromString() // Check if this is correct

        const x0 = point.x / containerWidth
        const y0 = point.y / containerHeight

        const x = isLandscape ? x0 : y0
        const y = isLandscape ? y0 : -x0 + 1

        setAutoFocusPointOfInterest({ x, y })
    }
    
    function handleChangeAspectRatio() {
        
        if (ratios.length === 0) return;

        const nextIndex = ratios.indexOf(ratio) + 1
        const nextRatio = ratios[(nextIndex + ratios.length) % ratios.length]
        
        setRatio(nextRatio)
    }

    function handleChangeFlashMode() {

    
        const flashModes = Object.values(RNCamera.Constants.FlashMode)
        
        const nextIndex = flashModes.indexOf(flashMode) + 1
        const nextFlash = flashModes[(nextIndex + flashModes.length) % flashModes.length]

        setFlashMode(nextFlash)
    }


    const { width, height } = Dimensions.get('window')
    const [ratioWidth, ratioHeight] = ratio.split(':').map(str => parseInt(str))
    
    // Render
    return (
        <Modal
            transparent
            presentationStyle='overFullScreen'
            onRequestClose={props.onRequestClose}
            statusBarTranslucent
        >
            <StatusBar hidden showHideTransition='slide' />
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.95)', flexDirection: isLandscape ? 'row' : 'column', width: '100%' }}>
                
                
                {/* Filler view */}
                <View style={{ flex: 1 }} />
                
                {/* Camera */}
                <RNCamera
                    ref={cameraRef}
                    ratio={ratio}
                    flashMode={flashMode}
                    autoFocusPointOfInterest={autoFocusPointOfInterest}
                    useNativeZoom
                    // useCamera2Api={true}
                    onCameraReady={getCameraInfo}
                    onTap={handleAutoFocus}
                    onBarCodeRead={handleBarCodeRead}
                    style={{ maxWidth: '100%', maxHeight: '100%', aspectRatio: isLandscape ? ratioWidth / ratioHeight : ratioHeight / ratioWidth }}
                >
                    {/* View area container */}
                    {/* <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={handleAutoFocus}>
                        
                    </TouchableOpacity> */}
                </RNCamera>

                {/* Filler view */}
                <View style={{ flex: 1 }} />

                {/* Top buttons */}
                <View
                    style={[
                        styles.buttonsContainer,
                        // { backgroundColor: 'hsla(0, 100%, 75%, .5)' },
                        isLandscape ? { left: 0, height: '100%' } : { top: 0, width: '100%' },
                        { flexDirection: isLandscape ? 'column-reverse' : 'row', alignItems: 'center' }
                    ]}
                >
                    <TouchableOpacity
                        onPress={handleChangeAspectRatio}
                        style={[{ alignItems: 'center'}]}
                    >
                        <Icon name='aspect-ratio' size={30} color='white' />
                        <Text style={{ fontSize: 12, color: 'white', backgroundColor: 'black' }}>{ratio}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        // onPress={handleTakePicture}
                    >
                        <Icon name='camera' size={30} color='black' />
                    </TouchableOpacity>
                </View>

                {/* Bottom buttons */}
                <View
                    style={[
                        styles.buttonsContainer,
                        // { backgroundColor: 'hsla(0, 100%, 75%, .5)' },
                        isLandscape ? { right: 0, height: '100%' } : { bottom: 0, width: '100%' },
                        { flexDirection: isLandscape ? 'column-reverse' : 'row' }
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => toast('Pressione dois dedos na tela e afaste ou aproxime-os para mudar o zoom')}
                    >
                        <Icon name='magnify' size={30} color='white' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleTakePicture}
                        style={[{ padding: 15, borderRadius: 1000, borderWidth: 1, borderColor: 'white' }]}
                    >
                        <Icon name='camera' size={30} color='white' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleChangeFlashMode}
                    >
                        <Icon name={flashModeIcon[flashMode]} size={30} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        position: 'absolute',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

const flashModeIcon: { [x: string]: string } = {
    [RNCamera.Constants.FlashMode.auto]: 'flash-auto',
    [RNCamera.Constants.FlashMode.off]: 'flash-off',
    [RNCamera.Constants.FlashMode.on]: 'flash',
    [RNCamera.Constants.FlashMode.torch]: 'flashlight'
}

export { Camera }
