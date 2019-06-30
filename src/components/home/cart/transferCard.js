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
        let { cart, onRemove, onSpecial, onPriceInfo, onPolicy } = this.props

        if (!cart || !cart.data) {
            return null
        }
        let fromLocation = cart.data.locationInfo.fromLocation.name
        let toLocation = cart.data.locationInfo.toLocation.name
        let carName = cart.data.items[0].item[0].name
        let fromDate = cart.data.dateInfo.startDate
        let toDate = cart.data.dateInfo.endDate
        let carImage = { uri: cart.data.images[0].url }
        let price = cart.data.displayAmount
        let durationText = UtilService.getFieldFromList(cart.data.tpExtension, 'duration')
        let title = moment(fromDate).format('DD MMM, YYYY')
        let travelers = UtilService.getTravellersCountFromTpExtension(cart.data.items[0].item[0].tpExtension)
        //let durationText = (duration/3600).toFixed(0)+'h '+((duration/60)%60)+'m'
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <View style={styles.cardTopContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <TouchableOpacity onPress={() => onPriceInfo()} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.smallIcon} />
                            <Text style={styles.priceText}>{price}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardBottomContainer}>
                        <Text style={styles.travelerText}>{travelers} {travelers > 1 ? 'Travelers' : 'Traveler'}</Text>
                        <ActionText
                            image={removeIcon}
                            text='Remove'
                            onPress={() => onRemove()}
                        />
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.rowDirection}>
                        <Image source={carImage} style={styles.carIcon} />
                        <Text style={styles.carName}>{carName}</Text>
                    </View>
                    <View style={styles.rowDirection}>
                        {durationText!='0 Hour'&&<View style={styles.lineContainer}>
                            <Text style={styles.durationText}>
                                <Feather name="clock" size={10} color={Color.lightText} />
                                {` ${durationText}`}
                            </Text>
                        </View>}
                        {durationText==0&&<View style={styles.line}/>}
                        <View style={styles.halfContent}>
                            <Text style={styles.lightNormal}>{moment(fromDate).format('DD/MM/YYYY')}</Text>
                            {/* <Text style={styles.lightNormal}>{moment(fromDate).format('hh:mm A')}</Text> */}
                            <Image source={transfer_green_car} style={styles.greenCar} />
                            <Text style={styles.primaryBold}>{fromLocation}</Text>
                        </View>
                        <View style={styles.halfContent}>
                            <Text style={styles.lightNormal}>{moment(toDate).format('DD/MM/YYYY')}</Text>
                            {/* <Text style={styles.lightNormal}>{moment(toDate).format('hh:mm A')}</Text> */}
                            <Image source={transfer_green_car} style={styles.greenCar} />
                            <Text style={styles.primaryBold}>{toLocation}</Text>
                        </View>

                    </View>
                    <View style={styles.cardContentBottom}>
                        <ActionText
                            image={infoIcon}
                            text='Cancellation Policy'
                            onPress={() => onPolicy()}
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
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.middlePrimary,
        marginLeft: 5
    },
    smallText: {
        fontSize: 12,
        color: Color.lightText
    },
    smallIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
    },
    boldText: {
        fontWeight: 'bold'
    },
    rowDirection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%'
    },
    halfContent: {
        flex: 1,
        alignItems: 'center'
    },
    lineContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: 13,
        width: '50%',
        left: '25%',
        borderBottomWidth: 3,
        borderBottomColor: '#ccc'
    },
    carIcon: {
        width: 40,
        height: 20,
        resizeMode: 'contain'
    },
    carName: {
        fontSize: 12,
        color: Color.darkText,
        marginLeft: 8
    },
    greenCar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginVertical: 3
    },
    lightNormal: {
        fontSize: 12,
        color: Color.lightText,
        marginVertical: 2
    },
    primaryBold: {
        fontSize: 10,
        color: Color.primary,
        fontWeight: 'bold'
    },
    travelerText: {
        fontSize: 14,
        color: Color.text
    },
    durationText: {
        marginBottom: 5,
        fontSize: 10,
        color: Color.lightText,
        marginLeft: 10,
        fontWeight: 'bold'
    },
    line:{
        position: 'absolute',
        top: 32,
        width: '50%',
        left: '25%',
        height: 3,
        backgroundColor: '#ccc'
    }
})