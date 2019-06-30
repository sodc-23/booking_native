import React, {PureComponent} from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {
    passCheckedImage,
    hotelIco,
    activityIco,
    transferIco,
    busIco,
    trainIco,
    carRentalIco,
    flightIco,
    packageIco
} from "@common/image"
import Color from '@common/color'
import HotelInfo from '@hotel_room/hotelInfo'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';

const {T1, T2} = Global.Translate

class ReservationC extends PureComponent {

    constructor(props){
        super(props)
        this.state={
            your_intinerary_number:'AF1015-AAA0486',
            cards:[
                {title:'Paradiso Hotel', bookingRefNo:'1015-AAA0486', status:'Confirmed', totalAmount:305},
                {title:'Shiraton Bangkok Hotel', bookingRefNo:'1015-AAA0486', status:'Confirmed', totalAmount:305}
            ],
            
        }

        this.props.actions.getMyBookingDetail(this.props.item)
    }

    componentWillMount(){
        this.props.navigation.setParams({
            title: 'View Reservation'
        });
    }

    done(){
        Actions.pop()
    }

    renderBusinessType(type) {
        let {T4} = this.props.language
        switch(type) {
            case 'hotel' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={hotelIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('HOTELS')}</Text>
                    </View>
                )
            }
            case 'bus' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={busIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('BUSES')}</Text>
                    </View>
                )
            }
            case 'activity' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={activityIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('ACTIVITIES')}</Text>
                    </View>
                )
            }
            case 'package' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={packageIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('TRAVEL PACKAGE')}</Text>
                    </View>
                )
            }
            case 'transfers' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={transferIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('TRANSFERS')}</Text>
                    </View>
                )
            }
            case 'air' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={flightIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('FLIGHTS')}</Text>
                    </View>
                )
            }
            case 'vehicle' :{
                return (
                    <View style={styles.hotel}>
                        <Image source={carRentalIco} style={styles.hotelico}></Image>
                        <Text style={styles.hoteltxt}>{T4('CAR RENTAL')}</Text>
                    </View>
                )
            }
        }

        return (
            <View style={styles.hotel}>
                <Image source={hotelIco} style={styles.hotelico}></Image>
                <Text style={styles.hoteltxt}>{T4('HOTELS')}</Text>
            </View>
        )
    }
    goDetail(bookDetail, business) {
        let {item} = this.props
        switch(business) {
        case 'hotel':
            Actions.HotelReservationDetail({bookDetail, item})
            break;
        case 'bus':
            Actions.BusReservationDetail({bookDetail, item})
            break;
        case 'air':
            Actions.FlightReservationDetail({bookDetail, item})
            break;
        case 'transfers':
            Actions.TransferReservationDetail({bookDetail, item})
            break;
        case 'vehicle':
            Actions.VehicleReservationDetail({bookDetail, item})
            break;
        case 'activity':
            Actions.ActivityReservationDetail({bookDetail, item})
            break;
        case 'package':
            Actions.PackageReservationDetail({bookDetail, item})
            break;
        }
    }
    render(){
        let {cards} = this.state
        let {bookDetail = {}, status} = this.props.cart
        var businessObject = bookDetail.businessObject||{}
        let business = businessObject.business||'hotel'
        var displayRateInfo = businessObject.displayRateInfo||[]
        bookDetail.itineraryRefNo = bookDetail.itineraryRefNo||''
        if(status == cartAction.LOADING) {
            return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Color.primary} style={{flex:1}}/>
            </View>)    
        }

        var totalAmount = Global.environment.portalCurrency.isoCode + ' ' + (bookDetail.totalAmount||bookDetail.paidAmount)
        // if(business == 'hotel') {
        //     totalAmount = businessObject.displayAmount
        // } else {
        //     if(displayRateInfo && displayRateInfo.length > 0) {
        //         totalAmount = displayRateInfo[displayRateInfo.length-1].currencyCode + ' ' + businessObject.displayRateInfo[displayRateInfo.length-1].amount
        //     }
        // }

        var title = businessObject.name
        if(business=='air') {
            let {items = [], tripType = "Oneway"} = businessObject
            let {item = []} = items[0]
            let startLocation = item[0].locationInfo || {}
            let endLocation = item[item.length - 1].locationInfo || {}
            var fromLocation = startLocation.fromLocation.id
            var toLocation = endLocation.toLocation.id

            title = tripType=='Oneway'?`${fromLocation} - ${toLocation}`:`${fromLocation} - ${toLocation} - ${fromLocation}`//bookDetail.businessDetails
        } else if(business == 'transfers'){
            title = businessObject.items[0]?businessObject.items[0].item[0].name:title
        } else if(business == 'bus') {
            var fromLocation = businessObject.locationInfo.fromLocation.name
            var toLocation = businessObject.locationInfo.toLocation.name
            title = `${fromLocation} - ${toLocation}`
        }

        let {T4} = this.props.language
        return(
            <View style={styles.container}>
                <View style={styles.blueRect}>
                    <Text style={styles.tw2}>{T4('YOUR ITINERARY NUMBER')}</Text>
                    {bookDetail.itineraryReferenceNumber!=''  && <Text style={styles.tw1}> {bookDetail.itineraryRefNo||''}</Text>}
                </View>
                <ScrollView style={styles.scroll}>
                    {this.renderBusinessType(business)}
                    <View style={styles.padding}>
                        {<HotelInfo  
                            language={this.props.language}
                            title = {title}
                            totalAmount = {totalAmount}
                            status = {bookDetail.bookingStatus}
                            bookingRefNo = {bookDetail.bookingRefNo}
                            onPress = {()=>this.goDetail(bookDetail, business)}
                        />}
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

export default Reservation = connect(mapStateToProps, mapDispatchToProps)(ReservationC);

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff'
    },
    blueRect:{
        backgroundColor:'#3fafc8',
        width:'100%',
        height:110,
        justifyContent:'center',
    },
    scroll:{
        width:'100%',
        backgroundColor: '#eeeeee',
    },
    hotel:{
        marginLeft:20,
        marginTop:20,
        flexDirection:'row',
//        backgroundColor:'#eeeeee',
        height: 50,
        alignItems:'center',
    },
    hotelico:{
        margin:3,
        width:40,
        height:40,
        resizeMode:'contain'
    },
    hoteltxt:{
        fontSize:26,
        color:'#000000',
        fontWeight:'bold',
    },
    passImage:{
        width:60,
        height:60,
        margin:10,
    },
    th1:{
        fontSize: 18,
        color: '#033d5b',
        fontWeight: 'bold',
        textAlign:'center',
        margin:10,
    },
    th2:{
        fontSize: 14,
        color: '#033d5b',
        textAlign:'center',
        margin:10,
    },
    tw1:{
        fontSize:24,
        color:'#fff',
        fontWeight:'bold',
        textAlign:'center',
        margin:10,
    },
    tw2:{
        fontSize:14,
        color:'#fff',
        margin:10,
        textAlign:'center'
    },
    padding:{
        padding:15,
    },
})