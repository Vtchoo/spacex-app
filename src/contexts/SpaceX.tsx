import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { useAuth } from './AuthContext'
import { useDatabaseArray } from '../hooks/firebase/useDatabaseArray'

interface SpaceXContextData {
    bookmarkedLaunches: string[]
    bookmarkLaunch(launchId: string): void
    removeLaunchBookmark(launchId: string): void
}

interface SpaceXProviderProps {
    children: ReactNode
}

const SpaceXContext = createContext({} as SpaceXContextData)

function SpaceXProvider({ children }: SpaceXProviderProps) {

    const { user } = useAuth()

    // const {
    //     array: bookmarkedLaunches,
    //     add: bookmarkLaunch,
    //     remove: removeLaunchBookmark
    // } = useDatabaseArray<string>(`/spacexdata/users/${user?.uid}/launches`, [user])

    //
    // Firestore
    // 
    const [bookmarkedLaunches, setBookmarkedLaunches] = useState<{ [key: string]: { launchId: string } }>({})

    useEffect(() => {

        if (!user) return

        firestore()
            .collection('userdata')
            .doc(user.uid)
            .collection('launches')
            .get()
            .then(values => {
                values.forEach(value => {
                    setBookmarkedLaunches(launches => ({
                        ...launches,
                        [value.id]: value.data() as { launchId: string }
                    }))
                })
            })

    }, [user])

    const bookmarkLaunch = useCallback((launchId: string) => {

        if (!user) return

        firestore()
            .collection('userdata')
            .doc(user.uid)
            .collection('launches')
            .add({ launchId })
            .then(async value => {
                setBookmarkedLaunches(launches => ({
                    ...launches,
                    [value.id]: { launchId }
                }))
            })
            
        }, [user])
        
        function removeLaunchBookmark(launchId: string) {
            
            if (!user) return
            
            firestore()
                .collection('userdata')
                .doc(user.uid)
                .collection('launches')
                .where('launchId', '==', launchId)
                .get()
                .then(values => {
                    values.forEach(value => {
                        value.ref.delete().then(v => {
                            setBookmarkedLaunches(launches => {
                                const newLaunches = { ...launches }
                                delete newLaunches[value.id]
                                return newLaunches
                            })
                        })
                    })
                })

    }

    return (
        <SpaceXContext.Provider
            value={{
                bookmarkedLaunches: Object.values(bookmarkedLaunches).map(l => l.launchId),
                bookmarkLaunch,
                removeLaunchBookmark
            }}
        >
            {children}
        </SpaceXContext.Provider>
    )
}

function useSpaceX() {
    return useContext(SpaceXContext)
}

export { SpaceXProvider, useSpaceX }
