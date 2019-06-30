import React from 'react'


import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet
} from 'react-native'
const borderColor = '#555'
const borderWidth = 1
const seatHeight = 40
const space = 10
import Color from '@common/color'
import {MaterialCommunityIcons} from '@expo/vector-icons'

const icons = {
    door1: 'stairs',
    TV: 'youtube-tv',
    driver: 'steering',
    toilet: 'toilet',
}

const seatStyles = {
    Available: {},
    curseat: {},
    available: {},
    Selected: { backgroundColor: 'rgb(56,121,187)', borderColor: 'white', borderTopColor: 'white' },
    selected: { backgroundColor: 'rgb(56,121,187)', borderColor: 'white', borderTopColor: 'white' },
    Taken: { backgroundColor: 'rgb(240,223,56)', borderColor: 'white', borderTopColor: 'white' },
    booked: { backgroundColor: 'rgb(240,223,56)', borderColor: 'white', borderTopColor: 'white' },
    hold: { backgroundColor: 'rgb(240,223,56)', borderColor: 'white', borderTopColor: 'white' },
    Ladies: { backgroundColor: 'rgb(192,57,189)', borderColor: 'white', borderTopColor: 'white' },
    Blocked: { backgroundColor: 'rgb(166,166,166)', borderColor: 'white', borderTopColor: 'white' },
    block: { backgroundColor: 'rgb(166,166,166)', borderColor: 'white', borderTopColor: 'white' },
}

export default class BusItem extends React.Component {
    render() {
        let { title, style, onPress, type, selected, status, armSize, gender } = this.props
        let backClass = selected?'selected':(status=='booked'&&gender=='F'?'Ladies':status)
        let backStyle = seatStyles[backClass]
        if (type == null || type == 'empty') return null
        return (
            <View style={{ padding: space / 2 }}>
                {(type == 'toilet' || type == 'TV' || type == 'driver' || type == 'door1') ?
                    <MaterialCommunityIcons name={icons[type]} color={Color.lightText} size={30} style={[styles.container, {textAlign:'center'}]} /> :
                    <TouchableOpacity disabled={onPress==null||(status!='available'&&status!='cutseat')} onPress={onPress} style={[styles.container, type == 'Sleeper' ? { height: 2 * seatHeight + space } : {}, { ...style }]}>
                        <View style={[styles.body, backStyle, armSize?{marginHorizontal:(armSize-1)/2, borderRadius:armSize/2}:{}]}>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.title, (backClass=='selected'||backClass=='Ladies') ? { color: 'white' } : {color:'grey'}]}>{title}</Text>
                                {false && <View style={styles.marker} />}
                            </View>
                            <View style={[styles.bottom, backStyle, armSize?{height:armSize-1}:{}]} />
                        </View>
                        <View style={[styles.left, backStyle, armSize?{height:armSize*3, width:armSize}:{}]} />
                        <View style={[styles.right, backStyle, armSize?{height:armSize*3, width:armSize}:{}]} />
                    </TouchableOpacity>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: seatHeight
    },
    body: {
        flex: 1,
        marginHorizontal: 3.5,
        borderRadius: 4,
        backgroundColor: 'white',
        borderColor: borderColor,
        borderWidth,
        overflow: 'hidden'
    },
    left: {
        width: 8,
        height: 24,
        borderRadius: 3,
        borderWidth,
        borderColor: borderColor,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: 'white'
    },
    right: {
        width: 8,
        height: 24,
        borderRadius: 3,
        borderWidth,
        borderColor: borderColor,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'white'
    },
    bottom: {
        width: '100%',
        height: 7,
        borderTopWidth: borderWidth,
        borderTopColor: borderColor
    },
    title: {
        fontSize: 9,
        color: Color.lightText,
        textAlign: 'center'
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    marker: {
        width: 10,
        height: 10,
        backgroundColor: 'rgb(251,12,27)',
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        right: -5,
        top: -5
    }
})