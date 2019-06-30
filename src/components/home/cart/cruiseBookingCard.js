import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import Ionicons from '@expo/vector-icons/Ionicons';
import { chatIcon, removeIcon, infoIcon } from '@common/image'
import { primaryInfo } from '@common/image';
import UtilService from '@utils/utils';
import StarRating from 'react-native-star-rating';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import ContactInput from '@hotel_room/contactInput'
const { T1, T2 } = Global.Translate

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
        let { cart, onRemove, onSpecial, onPriceInfo, onPolicy, hasPolicy = false } = this.props
        let {title, rating, location, roomInfo, durationInfo, nights, price} = this.props
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.cardBottomContainer}>
                        {/* <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={rating}
                            starSize={10}
                            containerStyle={{ width: 50 }}
                            fullStarColor={'#b9b800'}
                        /> */}
                        <View style={styles.cardBottomContainer2}>
                            <ActionText
                                image={chatIcon}
                                text='Special Request'
                                onPress={() => {}}
                            />
                            <ActionText
                                image={removeIcon}
                                text='Remove'
                                onPress={() => {}}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="ios-pin" size={16} color={Color.orange} />
                        <Text style={styles.location}>{location}</Text>
                    </View>
                    <Text style={styles.roomInfo}>{roomInfo}</Text>
                    <Text style={styles.durationInfo}>{durationInfo} ( {nights > 1 ? `${nights} Nights` : '1 Night'} )</Text>
                    <View style={styles.cardContentBottom}>
                        <ActionText
                            image={infoIcon}
                            text='Booking Policies'
                            onPress={() => {}}
                        />

                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>{price}</Text>
                            <TouchableOpacity onPress={() => {}} style={styles.infoContainer}>
                                <Text style={styles.smallText}>
                                    For {nights} Nights
                                </Text>
                                <Image source={primaryInfo} style={styles.smallIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

BookingCard.defaultProps={
    title:'Norwegian Sky', 
    location:'Lorem lpsum Stree, Dolor sit amet455, Bangkok Thailand', 
    roomInfo:'1 rooms(s) | 2 people', 
    durationInfo:'12 Aug - 14 Aug', 
    nights:2, 
    price:'USD 43.6'
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
        fontSize: 20,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    cardBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },
    cardBottomContainer2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    content: {
        padding: 8,
    },
    actionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
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
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
        marginLeft: 8,
        fontSize: 12,
        color: Color.text
    },
    durationInfo: {
        fontSize: 16,
        color: Color.primary,
        fontWeight: 'bold',
        marginTop: 10
    },
    roomInfo: {
        fontSize: 14,
        color: Color.darkText,
        fontWeight: 'bold',
        marginTop: 10
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Color.middlePrimary
    },
    smallText: {
        fontSize: 12,
        color: Color.lightText,
        paddingVertical: 5
    },
    smallIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginLeft:5
    },
    infoContainer:{
        flexDirection:'row',
        alignItems:'center'
    }
})