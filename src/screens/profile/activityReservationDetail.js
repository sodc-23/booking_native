import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Alert,
} from 'react-native'

import ClosableGroupTitle from '@components/profile/closableGroupTitle'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Color from '@common/color'
import { activity_primary, activityIco } from '@common/image'
import RoundButton from '@components/general/roundButton'
import moment from 'moment';
import { BOOKING_DETAIL } from '@store/cart/actionTypes';
import Marquee from '@components/general/react-native-text-ticker'
import Global from "@utils/global";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';
import { Actions } from 'react-native-router-flux';
import UtilService from '@utils/utils';
import TwoButtonModal from '@components/home/twoButtonModal';

const { T1, T2 } = Global.Translate

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
)

const ItemText = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <Text style={styles.itemValueText}>
            {value}
        </Text>
    </View>
)

class ReservationDetailC extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            closed: [false, false, false, false, false],
            details: [
                { title: 'Booking Rate', value: '16-11-2016 13:06' },
                { title: 'Booking Ref NO', value: '1116-aa00724' },
                { title: 'Itinerary', value: 'Bus' },
                { title: 'Status', value: 'Confirmed' },
            ],
            operator:[
                { title: 'Operated By', value: 'Bus Operator - Tvc4'},
                { title: 'Schedule', value: '1116-aa00724'},
                { title: 'Jorney Date', value: 'Bus'},
                { title: 'Status', value: 'Confirmed'},
            ],
            travelers:[
                [
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Address', value: 'Ahmedabad Central'}, 
                    { title: 'City', value: 'City Name'}, 
                    { title: 'Cell Phone', value: '0123456789'}, 
                ],
                [
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Address', value: 'Ahmedabad Central'}, 
                    { title: 'City', value: 'City Name'}, 
                    { title: 'Cell Phone', value: '0123456789'}, 
                ],
            ],
            summary: [
                { title: 'Base Price', value: '$500.50' },
                { title: 'Service Tax', value: '$82.58' },
                { title: 'Baggage', value: '$7.00' },
                { title: 'Meal Preference', value: '$5.00' },
                { title: 'Transaction', value: '$59.51' },
            ],
            
            title: 'Lapaz To Savtiago',
            busName : 'LITORAL MIRAMAR',
            date: 'Sat, 26th Nov 2016, 07:25 AM',
            icon: activity_primary,
            cancelFareLoading:false,
        }
    }
    click(index) {
        this.state.closed[index] = !this.state.closed[index]
        this.setState({ closed: [...this.state.closed] })
    }

    cancelReservation() {
        let {bookDetail, item} = this.props
        //Actions.CancelFirst({bookDetail, item})
        this.setState({
            cancelFareLoading:true,
            cancelAmount:0,
            discountCancel:0,
            refundAmount:0,
            refundFee:0,
        })
        var request = {
            Travellers:bookDetail.travellerDetails,
            Itinerary:item,
        }
        this.cancellationModal.show()
        this.props.actions.cancelFares(request).then(({error, result})=>{
            console.log('cancelfare', error, result)
            this.setState({
                cancelFareLoading:false
            })
            if(!error) {
                this.setState({
                    cancelAmount:Global.environment.portalCurrency.isoCode + ' ' + UtilService.getFieldFromList2(result, 'purpose', "amount", "11"),
                    discountCancel:Global.environment.portalCurrency.isoCode + ' ' + "0",
                    refundAmount:Global.environment.portalCurrency.isoCode + ' ' + UtilService.getFieldFromList2(result, 'purpose', "amount", "12"),
                    refundFee:Global.environment.portalCurrency.isoCode + ' ' + "0",
                })
            }
        })
    }

    cancelRequest() {
        let {bookDetail} = this.props
        Actions.CancelSecond({bookDetail})         
    }

    modifyReservation() {
        let {bookDetail, item} = this.props
        Actions.ModifySecond({bookDetail, item})
    }

    modifyRequest() {
        let {bookDetail, item} = this.props
        Actions.ModifyThird({bookDetail})
    }
    
    render() {
        let { details, summary, operator, travelers, addOn, leadPassenger, icon, busName } = this.state
        let { bookDetail } = this.props
        let businessObject = bookDetail.businessObject
        let tpExtension = businessObject.tpExtension
        let travellerDetails = bookDetail.travellerDetails
        var prepayRate = (businessObject.displayRateInfo.find(o=>o.purpose=='8')||{}).amount||0
        var totalRate = (businessObject.displayRateInfo.find(o=>o.purpose=='10')||{}).amount||0
        let {showOnlineCancellationOption, showOnlineModificationOption, showOnlinePaxModificationOption} = bookDetail
        showOnlineCancellationOption = false
        showOnlineModificationOption = false
        showOnlinePaxModificationOption = true

        var bookingFor = businessObject.paxInfo.map(item=>item.quantity + ' : ' + item.typeString).join(',')
        var showModifyCancel = bookDetail.bookingStatusID==1 && businessObject.dateInfo.startDate > moment().format('YYYY-MM-DDT23:59:59')

        let {T3}= this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Marquee style={styles.headerTitle}>{businessObject.name}</Marquee>
                        {/* <View style={styles.dateContainer}>
                            <FontAwesome name="bus" size={16} color={'white'} />
                            <Text style={styles.date}>{busName}</Text>
                        </View> */}
                        <View style={styles.dateContainer}>
                            <FontAwesome name="calendar" size={16} color={'white'} />
                            <Text style={styles.date}>{moment(businessObject.dateInfo.startDate).format('ddd,Do MMM YYYY,hh:mm A')}</Text>
                        </View>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={icon} style={styles.image} />
                    </View>
                </View>
                <ScrollView>
                    <ClosableGroupTitle
                        isClosed={this.state.closed[0]}
                        title={T3('Reservation Details')}
                        icon={<FontAwesome name="calendar" size={16} color={Color.text} />}
                        onPress={() => this.click(0)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Booking Date")} value={moment(bookDetail.bookingDate).format('DD-MM-YYYY HH:MM')} />
                            <Item title={T3("Booking Reference Number")} value={bookDetail.bookingRefNo} />
                            <Item title={T3("Itinerary Name")} value={bookDetail.itineraryName} />
                            <Item title={T3("Itinerary Number")} value={bookDetail.itineraryRefNo} />
                            <Item title={T3("Status")} value={bookDetail.bookingStatus} />
                            <Item title={T3("Booking For")} value={bookingFor} />
                            <Item title={T3("Activity Name")} value={businessObject.name} />
                            <Item title={T3("Operator Name")} value={UtilService.getFieldFromList2(businessObject.tpExtension, 'key', 'value', 'operatorName')} />
                            <Item title={T3("Contact Phone")} value={`${businessObject.contactInformation.phoneNumberCountryCode||''}${businessObject.contactInformation.phoneNumber||''}`} />
                            <Item title={T3("Meeting Place")} value={UtilService.getFieldFromList2(businessObject.tpExtension, 'key', 'value', 'meetingPlace')} />
                            <Item title={T3("Email")} value={businessObject.contactInformation.workEmail} />
                            <Item title={T3("Duration")} value={UtilService.getFieldFromList2(businessObject.tpExtension, 'key', 'value', 'duration')} />                            
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title={T3('Operator Detail')}
                        icon={<Image source={activityIco} style={styles.imageIcon} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Operated By")} value={UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'operatorName')}/>
                            <Item title={T3("Schedule")} value={UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'scheduleCode')}/>
                            <Item title={T3("Journey Date")} value={moment(businessObject.dateInfo.startDate).format(Global.dateFormat)}/>
                            <Item title={T3("Status")} value={bookDetail.bookingStatus}/>
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[2]}
                        title={T3('Travelers Information')}
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(2)}
                        content={<View style={styles.contentContainer}>
                            {travellerDetails.map((item, index) => <View key={index}>
                                {/* <Text style={styles.guestTitle}>Customer{index + 1}</Text> */}
                                <Item title={T3("Name")} value={item.details.firstName + ' ' + item.details.lastName} />
                                <Item title={T3("Age")} value={item.age} />
                                <Item title={T3("Gender")} value={item.details.genderDesc} />
                                <Item title={T3("Address")} value={item.details.location.address} />
                                <Item title={T3("City")} value={item.details.location.city} />
                                <Item title={T3("Cell Number")} value={`${item.details.contactInformation.phoneNumberCountryCode||''}${item.details.contactInformation.phoneNumber||''}`} />
                            </View>)}
                        </View>}
                    />
                    
                    <ClosableGroupTitle
                        isClosed={this.state.closed[3]}
                        title={T3('Fare Summary')}
                        icon={<FontAwesome name="money" size={16} color={Color.text} />}
                        onPress={() => this.click(3)}
                        content={<View style={styles.contentContainer}>
                            {
                                businessObject.displayRateInfo.map( (obj, index) => {
                                    if(obj.purpose == '10') return null
                                    if(obj.purpose == '8' && prepayRate == totalRate) return null
                                    return (<Item key={index} title={UtilService.getChargeType(obj.purpose)} value={obj.currencyCode + ' ' + obj.amount} />)
                                })
                            }
                            {
                                businessObject.displayRateInfo.map( (obj, index) => {
                                    if(obj.purpose != '10') return null
                                    return (<Item key={index} title={UtilService.getChargeType(obj.purpose)} value={obj.currencyCode + ' ' + obj.amount} />)
                                })
                            }
                        </View>}
                    />
                    <View style={styles.bottomContainer}>
                        {showModifyCancel&&showOnlineCancellationOption === false && <View style={styles.buttonContainer}>
                            <RoundButton
                                title="Cancel Request"
                                onPress={() => this.cancelRequest(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineModificationOption === false &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title="Modify Request"
                                onPress={() => this.modifyRequest(bookDetail)}
                                style={{ backgroundColor: Color.primary }}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = ({ language}) => ({language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default ReservationDetail = connect(mapStateToProps, mapDispatchToProps)(ReservationDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical:5,
    },
    itemTitle: {
        fontSize: 12,
        color: Color.text,
        flex: 1
    },
    delimiter: {
        fontSize: 12,
        color: Color.text,
    },
    itemValue: {
        color: Color.primary,
        fontSize: 12,
        flex: 2,
        marginLeft: 20
    },
    itemValueText : {
        color: Color.primary,
        fontSize: 12,
        flex: 2,
        marginLeft: 20
    },
    contentContainer: {
        padding: 20
    },
    guestTitle: {
        fontSize: 10,
        color: 'black',
        fontWeight: 'bold',
        lineHeight: 32
    },
    headerContainer: {
        backgroundColor: Color.lightPrimary,
        padding: 20,
        flexDirection: 'row'
    },
    headerTitleContainer: {
        flex: 1
    },
    headerTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold'
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    imageContainer: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    imageIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
    },
    date: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10
    },
    bottomContainer: {
        padding: 10,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom:10,
    },
    buttonText: {
        fontWeight: 'bold'
    },
    traveler:{
        fontSize:10, 
        fontWeight:'bold',
        color:'black',
        marginTop:10,
    }
})