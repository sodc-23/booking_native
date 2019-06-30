import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import { Ionicons, Feather } from '@expo/vector-icons';
import { chatIcon, removeIcon, infoIcon, benz, transfer_green_car } from '@common/image'
import { primaryInfo } from '@common/image';
import UtilService from '@utils/utils';
import StarRating from 'react-native-star-rating';
import Global from "@utils/global";
import moment from 'moment'

const ActionText = ({ image, text, onPress }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.actionTextContainer}>
        <Image source={image} style={styles.icon} />
        <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
)

export default class BookingCard extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let { cart, onRemove, onSpecial, onPriceInfo, onPolicy } = this.props
        let {trainNo, price, trainName, departFrom, goingTo} = cart
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <View style={styles.cardTopContainer}>
                        <Text style={styles.cardTitle}>Train No - {trainNo}</Text>
                        <TouchableOpacity onPress={() => {}} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.smallIcon} />
                            <Text style={styles.priceText}>{price}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardBottomContainer}>
                        <Text style={styles.travelerText}>Train Name - {trainName}</Text>
                        <ActionText
                            image={removeIcon}
                            text='Remove'
                            onPress={() =>{}}
                        />
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.primary}>Departs From:</Text>
                    <Text style={styles.normal}>{departFrom}</Text>
                    <Text style={styles.primary}>Going To:</Text>
                    <Text style={styles.normal}>{goingTo}</Text>

                    <View style={styles.cardContentBottom}>
                        <ActionText
                            image={infoIcon}
                            text='Cancellation Policy'
                            onPress={() => {}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: Color.lightText,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 10,
    },
    cardHeaderContainer: {
        borderBottomColor: Color.lightText,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 8,
        backgroundColor: Color.lightBack
    },
    cardTitle: {
        fontSize: 18,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    cardBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
    cardTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        padding: 8,
    },
    actionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    actionText: {
        color: Color.orange,
        fontSize: 12,
    },
    content: {
        padding: 8,
    },
    cardContentBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.middlePrimary,
        marginLeft: 5
    },
    smallIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
    },
    
    primary:{
        color:Color.primary,
        fontSize:12,
        marginTop:10,
        fontWeight:'bold'
    },
    normal:{
        color:Color.text,
        fontSize:12,
        marginTop:10
    }
})