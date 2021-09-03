import { DependencyList, useCallback, useEffect, useState } from 'react'
import database from '@react-native-firebase/database'

function useDatabaseArray<T>(ref: string, dependencies: DependencyList) {

    const [list, setList] = useState<{ [key: string]: T }>({})

    function getObjectKey(obj: T) {
        return Object.keys(list).find(key => list[key] === obj)
    }

    useEffect(() => {
        
        const onItemAdded = database()
            .ref(ref)
            .on('child_added', (snapshot) => {
                if (!snapshot.key) return
                setList(oldList => ({ ...oldList, [snapshot.key as string]: snapshot.val() }))
            })

        const onItemRemoved = database()
            .ref(ref)
            .on('child_removed', (removedItem) => {
                setList(oldList => {
                    const newList = { ...oldList }
                    delete newList[removedItem.key as string]
                    return newList
                })
            })

        return () => {
            database().ref(ref).off('child_added', onItemAdded)
            database().ref(ref).off('child_removed', onItemRemoved)
        }

    }, dependencies)


    const add = useCallback(async (item: T) => {
        database().ref(ref).push(item)
    }, dependencies)

    function remove(item: T) {
        database().ref(`${ref}/${getObjectKey(item)}`).remove()
    }

    return {
        array: Object.values(list),
        add,
        remove
    }
}

export { useDatabaseArray }
