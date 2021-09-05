import { useTheme } from "@react-navigation/native"
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useAuth } from "../../contexts/AuthContext"

function Settings() {

    // Hooks
    const { colors } = useTheme()
    const { logout, user } = useAuth()

    // Handlers
    function handleLogout() {
        
        // TODO: Add confirmation dialog
        logout()
    }

    return (
        <View style={[styles.container]}>
            <View style={{ flex: 1 }}>

            </View>

            <TouchableOpacity
                style={[styles.option, styles.borderTop, styles.borderBottom, { borderColor: colors.border }]}
            >
                <Icon name='information-outline' color={colors.text} size={30}/>
                <Text style={[styles.optionText, { color: colors.text }]}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.option, styles.borderBottom, { borderColor: colors.border }]}
            >
                <Icon name='logout' color={colors.text} size={30}/>
                <Text style={[styles.optionText, { color: colors.text }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    option: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        // borderColor: 'lightgrey'
    },
    optionText: {
        marginLeft: 10,
    },
    // Helper styles
    borderTop: {
        borderTopWidth: 1
    },
    borderBottom: {
        borderBottomWidth: 1
    }
})

export { Settings }
