import { DependencyList, useCallback, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

function useFirestoreArray(ref: string, dependencies: DependencyList) {

    const [list, setList] = useState([])

    const add = useCallback(() => {

        firestore()
            // .collection()
    }, dependencies)
}

export { useFirestoreArray }
