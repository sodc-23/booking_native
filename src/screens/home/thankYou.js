import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {
    passCheckedImage,
    hotelIco,
    transferIco,
    packageIco,
    cruiseIco,
    trainIco,
    carRentalIco,
    flightIco,
    activityIco,
} from "@common/image"
import HotelInfo from '@hotel_room/hotelInfo'
import Color from '@common/color'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';

const {T1, T2} = Global.Translate

class ThankYouC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            your_intinerary_number: 'AF1015-AAA0486',
            cards: [
                { title: 'Paradiso Hotel', bookingRefNo: '1015-AAA0486', status: 'Confirmed', totalAmount: 305 },
                { title: 'Shiraton Bangkok Hotel', bookingRefNo: '1015-AAA0486', status: 'Confirmed', totalAmount: 305 }
            ],
            phone: '58854768766',
            email: 'Reservation@tripshop.com',
            businessName: 'HOTEL'
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Thank You',
            goBack:()=>{
                Actions.popTo('Home')
            }
        });

        setTimeout(()=>{
            Global.currentCart = null
        }, 1000)
    }

    done() {
        Actions.pop()
    }

    renderInfo(cart, index) {
        var business = cart.data.business
        var item = {
            title: cart.data.name,
            bookingRefNo: cart.bookingReferenceCode,
            status: UtilService.getBookingStatus(cart.bookingStatus),
            totalAmount: cart.data.displayAmount
        }
        

        if(business == 'air') {
            var { config, tripType}  = cart.data
            var tripLocations = UtilService.getFieldFromList2(config, 'key', 'value', 'tripLocation').split('-')
            var fromLocation = tripLocations[0].trim()
            var toLocation = tripLocations[1].trim()
            item.title = (tripType == 'Oneway' ? `${fromLocation} - ${toLocation}` : `${fromLocation} - ${toLocation} - ${fromLocation}`)
        } else if(business == 'transfers') {
            if(cart.data.items[0] && cart.data.items[0].item[0])
                item.title = cart.data.items[0].item[0].name
        } else if(business == 'bus') {
            var fromLocation = cart.data.locationInfo.fromLocation
            var toLocation = cart.data.locationInfo.toLocation
            item.title = `${fromLocation.name} - ${toLocation.name}`
        }
        return (
            <HotelInfo
                language={this.props.language}
                key={index}
                onPress={()=>{}}
                {...item}
            />
        )
    }

    render() {
        let { result } = this.props.cart
        result = result || {}
        result.items = result.items || []
        var { paymentTransaction = {} } = result
        var AppSetting = Global.environment
        var business = ''
        if(result.items.length > 0) {
            business = result.items[0].data.business
        }
        if(business == '') return null
        let {T1, T2, T3, T4}= this.props.language
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.imageContianer}>
                        <Image source={passCheckedImage} style={styles.passImage}></Image>

                        <Text style={styles.th1}>{T1('message35')}</Text>
                        <Text style={styles.th2}>{T1('message36')}</Text>
                        <Text style={styles.th2}>{T1('message37')}</Text>
                    </View>
                    <View style={styles.blueRect}>
                        <Text style={styles.tw2}>{T4('YOUR ITINERAY NUMBER')}</Text>
                        <Text style={styles.tw1}> {result.itineraryReferenceNumber || ''}</Text>
                    </View>
                    <View style={styles.padding}>
                        {business != '' && <View style={styles.rowDirection}>
                            <Image source={UtilService.getBusinessIcon(business)} style={styles.hotelico}></Image>
                            <Text style={styles.hoteltxt}>{UtilService.getBusinessName(business)}</Text>
                        </View>}
                        {result.items.map((card, index) => (
                            this.renderInfo(card, index)
                        ))}
                        <View style={styles.cardContainer}>
                            <Text style={styles.th3}>{AppSetting.portalName}</Text>
                            <Text style={styles.th4}>{T1('message38')}</Text>
                            <Text style={styles.th5}>{T3('Call Us')} : {AppSetting.portalPhone}</Text>
                            <Text style={styles.th5}>{T3('Email')} : {AppSetting.customerCareEmail}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ cart, auth, language }) => ({ cart, auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default ThankYou = connect(mapStateToProps, mapDispatchToProps)(ThankYouC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    cardContainer: {
        borderWidth: 1,
        borderColor: Color.lightText,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 10,
    },

    blueRect: {
        backgroundColor: '#3fafc8',
        width: '100%',
        height: 110,
        justifyContent: 'center',
    },
    rowDirection: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    hotelico: {
        margin: 3,
        width: 32,
        height: 32,
        resizeMode:'contain'
    },
    hoteltxt: {
        fontSize: 20,
        color: Color.text,
        fontWeight: 'bold',
    },
    passImage: {
        width: 100,
        height: 100,
        margin: 10,
    },
    th1: {
        fontSize: 18,
        color: '#033d5b',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    th2: {
        fontSize: 14,
        color: '#033d5b',
        textAlign: 'center',
        margin: 10,
    },
    th3: {
        fontSize: 14,
        color: '#033d5b',
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 3,
    },
    th4: {
        fontSize: 10,
        color: Color.text,
        textAlign: 'center',
        margin: 3,
    },
    th5: {
        fontSize: 12,
        color: Color.text,
        textAlign: 'center',
        margin: 3,
    },

    tw1: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    tw2: {
        fontSize: 14,
        color: '#fff',
        margin: 10,
        textAlign: 'center'
    },
    padding: {
        padding: 15,
        backgroundColor:Color.lightBack
    },
    imageContianer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
    }

})