import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import {Ionicons, Feather} from '@expo/vector-icons';
import { chatIcon, removeIcon, infoIcon, benz, transfer_man, transfer_bag } from '@common/image'
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
        //console.log('cart', JSON.stringify(cart))
        if(!cart || !cart.data) {
            return null
        }
        let items = cart.data.items[0]
        let title = cart.data.name
        let activityDate = moment(cart.data.dateInfo.startDate).format('DD MMM, YYYY')
        let activityTime = moment(cart.data.dateInfo.startDate).format('hh:mm a')
        let price = cart.data.displayAmount
        let passengerQuantity = UtilService.getFieldFromList(cart.data.tpExtension, 'passengerQuantity')
        let baggageQuantity = UtilService.getFieldFromList(cart.data.tpExtension, 'baggageQuantity')

        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeaderContainer}>
                    <View style={styles.cardTopContainer}>
                        <Text style={styles.cardTitle}>{activityDate}</Text>
                        <TouchableOpacity onPress={() => onPriceInfo()} style={styles.priceContainer}>
                            <Image source={primaryInfo} style={styles.smallIcon} />
                            <Text style={styles.priceText}>{price||' '}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardBottomContainer}>
                        <Text>{activityTime||' '}</Text>
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
                    <View style={styles.rowDirection}>
                        {/* <Image source={benz} style={styles.carIcon} /> */}
                        <Text style={styles.carName}>{title||' '}</Text>
                    </View>
                    <View style={styles.rowDirection}>
                        <Image source={transfer_man} style={styles.icon} />
                        <Text style={styles.number}>{passengerQuantity||' '}</Text>
                        <Text style={styles.darkBold}>Passengers</Text>
                    </View>        
                    <View style={styles.rowDirection}>
                        <Image source={transfer_bag} style={styles.icon} />
                        <Text style={styles.number}>{baggageQuantity||' '}</Text>
                        <Text style={styles.darkBold}>Bags</Text>
                    </View>
                    {
                        items && items.item.map((item, index)=>{
                            return (
                                <View key={index} style={styles.rowDirection}>
                                    <Text style={styles.textLabel}>{item.name}</Text>
                                    <Text style={styles.textvalue}>: {item.quantity>0?'Yes':'No'}</Text>
                                </View>
                            )
                        })
                    }
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
    cardTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        resizeMode: 'contain'
    },
    number: {
        color: Color.orange,
        fontWeight: 'bold',
        fontSize: 10,
        marginLeft: 5
    },
    darkBold: {
        fontSize: 10,
        color: Color.text,
        fontWeight: 'bold',
        marginLeft: 5
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
        justifyContent:'space-between',
        marginVertical:10
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
    smallIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        marginRight:5,
    },
    boldText: {
        fontWeight: 'bold'
    },
    rowDirection:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5,
        width:'100%'
    },
    textLabel: {
        width:'40%',
        textAlign:'left',
        fontSize:12,
        color:Color.darkText,
    },
    textValue: {
        width:'60%',
        textAlign:'left',
        fontSize:12,
        color:Color.darkText,
    },
    halfContent:{
        flex:1,
        alignItems:'center'
    },
    lineContainer:{
        position:'absolute',
        alignItems:'center',
        top:35,
        width:'50%',
        left:'25%',
        borderBottomWidth:3,
        borderBottomColor:'#ccc'
    },
    carIcon:{
        width:20,
        height:20,
    },
    carName:{
        fontSize:12,
        color:Color.darkText,
    },
    greenCar:{
        width:24,
        height:24,
        borderRadius:12,
        marginVertical:3
    },
    lightNormal:{
        fontSize:12,
        color:Color.lightText,
        marginVertical:2
    },
    primaryBold:{
        fontSize:10,
        color:Color.primary,
        fontWeight:'bold'
    },
    travelerText:{
        fontSize:14,
        color:Color.text
    },
    durationText:{
        marginBottom:5,
        fontSize:10,
        color:Color.lightText,
        marginLeft:10,
        fontWeight:'bold'
    },
    boldText:{
        fontWeight:'bold'
    }
})