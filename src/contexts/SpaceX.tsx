import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database'
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

    const {
        array: bookmarkedLaunches,
        add: bookmarkLaunch,
        remove: removeLaunchBookmark
    } = useDatabaseArray<string>(`/spacexdata/users/${user?.uid}/launches`, [user])

    return (
        <SpaceXContext.Provider
            value={{
                bookmarkedLaunches,
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
