import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import Ionicons from '@expo/vector-icons/Ionicons';
import { checkedIco } from '@common/image'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

const ActionText = ({ image, text, onPress }) => (
    <View style={styles.actionTextContainer}>
        <Text style={styles.actionText}>{text}</Text>
        <Image source={image} style={styles.icon} />
    </View>
)

export default HotelInfo = ({ title, bookingRefNo, status, totalAmount, onPress, language:{T3} }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.splitLine} />
        <View style={styles.content}>
            <View style={styles.locationContainer}>
                <Text style={styles.location}>{T3('Booking Ref No')} </Text>
                <Text style={styles.delimiter}>:</Text>
                <Text style={styles.durationInfo}>{bookingRefNo}</Text>
            </View>
            <View style={styles.locationContainer}>
                <Text style={styles.location}>{T3('Status')} </Text>
                <Text style={styles.delimiter}>:</Text>
                <ActionText
                    image={checkedIco}
                    text={status}
                />
            </View>
        </View>
        <View style={styles.splitLine} />
        <View style={styles.content}>
            <View style={styles.locationContainer}>
                <Text style={styles.location}>{T3('Total Amount')}</Text>
                <Text style={styles.delimiter}>:</Text>
                <Text style={styles.totalAmount}>{totalAmount}</Text>
            </View>
        </View>
    </TouchableOpacity>
)


const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10
    },
    cardHeaderContainer: {
        padding: 8,
        backgroundColor: '#fff'
    },
    cardTitle: {
        fontSize: 18,
        color: Color.primary,
        fontWeight: 'bold'
    },
    cardBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        marginTop: 8
    },
    content: {
        width: '100%'
    },
    actionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex:3,
        marginLeft:20,
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    actionText: {
        color: Color.text,
        fontSize: 14,
        fontWeight: 'bold',
        marginRight:10
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%',
        height:28
    },
    cardContentBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    priceContainer: {
        alignItems: 'flex-end',
        marginTop: 10
    },
    location: {
        fontSize: 14,
        color: Color.lightText,
        flex:2
    },
    delimiter:{
        fontSize: 14,
        color: Color.lightText,
    },
    durationInfo: {
        fontSize: 14,
        color: Color.text,
        fontWeight: 'bold',
        flex:3,
        marginLeft:20
    },
    totalAmount: {
        fontSize: 18,
        color: Color.orange,
        fontWeight: 'bold',
        flex:3,
        marginLeft:20
    },
    splitLine: {
        width: '100%',
        height: 0.5,
        backgroundColor: '#ccc',
        marginVertical: 5
    }
})