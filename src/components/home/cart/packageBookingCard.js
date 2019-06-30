import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import {Ionicons, FontAwesome} from '@expo/vector-icons';
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
import Feather from '@expo/vector-icons/Feather';
const {T1, T2} = Global.Translate

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
        //console.log('cart', JSON.stringify(cart))
        if(!cart || !cart.data) {
            return null
        }
        let roomItem = cart.data.items[0]
        let title = cart.data.name
        let activityDate = moment(cart.data.dateInfo.startDate).format('DD-MM-YYYY')
        var forString = UtilService.getPaxSummary2(roomItem.properties.pax)
        let price = cart.data.displayAmount
        let location = cart.data.locationInfo.fromLocation.address
        let duration = UtilService.getFieldFromList(cart.data.tpExtension, 'duration')
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.cardBottomContainer}>
                        {duration != null && <Text>{duration}</Text>}
                        <View style={styles.cardBottomContainer2}>
                            <ActionText
                                image={removeIcon}
                                text='Remove'
                                onPress={() => onRemove()}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.locationContainer}>
                        <FontAwesome name="map-marker" size={16} color={Color.orange} style={{width:15, textAlign:'center'}} />
                        <Text style={styles.location}>Location: <Text style={styles.boldText}>{location}</Text></Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <FontAwesome name="clock-o" size={16} color={Color.orange} style={{width:15, textAlign:'center'}}/>
                        <Text style={styles.location}>Package Date: <Text style={styles.boldText}>{activityDate}</Text></Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <FontAwesome name="user" size={16} color={Color.orange} style={{width:15, textAlign:'center'}} />
                        <Text style={styles.location}>For: <Text style={styles.boldText}>{forString}</Text></Text>
                    </View>
                    <View style={styles.cardContentBottom}>
                        <ActionText
                            image={infoIcon}
                            text='Booking Policies'
                            onPress={() => onPolicy()}
                        />
                        <TouchableOpacity onPress={()=>{onPriceInfo()}} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.smallIcon}/>
                            <Text style={styles.priceText}> {price}</Text>
                        </TouchableOpacity>
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
        marginTop:10,
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
        marginTop:8
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
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    actionText: {
        color: Color.orange,
        fontSize: 12,
        marginLeft:8
    },
    content: {
        padding: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems:'center',
        marginVertical:3
    },
    cardContentBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent:'space-between'
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: Color.lightText
    },
    smallIcon:{
        width:12,
        height:12,
        resizeMode:'contain',
    },
    boldText:{
        fontWeight:'bold'
    }
})