import React from 'react'

import {
    View,
    Text,
    Switch,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import {connect} from 'react-redux'

const Left = ({ title, value, onChange, language:{T3} }) => (
    <View style={styles.containerRow}>
        <Switch
            thumbColor="white"
            trackColor={{ true: Color.orange, false: Color.lightBack }}
            onValueChange={onChange}
            value={value}
        />
        <Text style={styles.saveAsText}>{T3(title)}</Text>
    </View>
)

const Right = ({ title, value, onChange, language:{T3} }) => (
    <View style={[styles.containerRow,{justifyContent:'space-between'}]}>
        <Text style={[styles.saveAsText, {marginLeft:0}]}>{T3(title)}</Text>
        <Switch
            thumbColor="white"
            trackColor={{ true: Color.orange, false: Color.lightBack }}
            onValueChange={onChange}
            value={value}
        />
    </View>
)

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export const LeftSwitchItem = connect(mapProps, mapDispatch)(Left)
export const RightSwitchItem = connect(mapProps, mapDispatch)(Right)

const styles = StyleSheet.create({
    containerRow: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginBottom: 5
    },
    saveAsText: {
        fontSize: 12,
        color: Color.lightText,
        marginLeft: 10,
    },
})