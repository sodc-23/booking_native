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
import { bus_primary } from '@common/image'
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
            closed: [false, false, false],
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
                { title: 'Bus Type', value: 'AC Bus'},
                { title: 'Status', value: 'Confirmed'},
            ],
            travelers:[
                [
                    { title: 'Seat No', value: '32'}, 
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Boarding Point', value: 'Ahmedabad Central'}, 
                    { title: 'Dropping Point', value: '32'}, 
                ],
                [
                    { title: 'Seat No', value: '32'}, 
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Boarding Point', value: 'Ahmedabad Central'}, 
                    { title: 'Dropping Point', value: '32'}, 
                ]
            ],
            addOn:[
                { title: 'Seat No', value: '32'}, 
                { title: 'Name', value: 'Manoj Patil'}, 
                { title: 'Baggage', value: '25Kgs'}, 
                { title: 'Meal Preference', value: 'AC Bus'}, 
                { title: 'Status', value: 'Baby Infant Meal'}, 
            ],
            leadPassenger:[
                { title: 'Name', value: 'Ahmed'}, 
                { title: 'Cell Phone', value: '123456789'}, 
                { title: 'Email', value: 'Ahmed@gmail.com'}, 
                { title: 'Meal Preference', value: 'AC Bus'}, 
                { title: 'Status', value: 'Baby Infant Meal'}, 
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
            icon: bus_primary,
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

    cancel() {
        let {bookDetail, item} = this.props
        var request = {
            Travellers:bookDetail.travellerDetails,
            Itinerary:item,
        }
        this.setState({
            cancelFareLoading:true
        })
        this.props.actions.cancelBooking(request).then(({error, result})=>{
            this.setState({
                cancelFareLoading:false
            })
            console.log('cancel', error, result)
            if(!error) {
                this.cancellationModal.hide()
                this.props.commonAction.showToast('Cancellation Done.')
                this.props.actions.getMyBookings('upcoming')
                Actions.popTo('MyBookings')
            } else {
                this.props.commonAction.showToast('Cancellation Failed.')
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
        let { details, summary, operator, travelers, addOn, icon, busName,cancelFareLoading, 
            cancelAmount, discountCancel, refundAmount, refundFee } = this.state
        let { bookDetail } = this.props
        let {businessObject, travellerDetails} = bookDetail
        let {items, tpExtension, locationInfo, dateInfo, policies, vendors, displayRateInfo} = businessObject
        var prepayRate = (businessObject.displayRateInfo.find(o=>o.purpose=='8')||{}).amount||0
        var totalRate = (businessObject.displayRateInfo.find(o=>o.purpose=='10')||{}).amount||0

        let {showOnlineCancellationOption, showOnlineModificationOption, showOnlinePaxModificationOption} = bookDetail
         showOnlineCancellationOption = false
         showOnlineModificationOption = false
         showOnlinePaxModificationOption = true
        let leadPassenger = travellerDetails.find((o)=>o.isMainPax)
        var policy = businessObject.policies.map((item)=>UtilService.decodeHtmlEntity(item.description)).join('\n\r')
        var addons = []
        travellerDetails.map((item) => {
            item.addons.map((addon)=>addons.push(addon))
        })
        var vendor = vendors.find(o=>o.type=='default')
        var title = `${locationInfo.fromLocation.name} To ${locationInfo.toLocation.name}`
        var showModifyCancel = bookDetail.bookingStatusID==1 && businessObject.dateInfo.startDate > moment().format('YYYY-MM-DDT23:59:59')
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Marquee style={styles.headerTitle}>{title}</Marquee>
                        <View style={styles.dateContainer}>
                            <FontAwesome name="bus" size={16} color={'white'} />
                            <Text style={styles.date}>{vendor.item.name}</Text>
                        </View>
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
                        title='Reservation Details'
                        icon={<FontAwesome name="calendar" size={16} color={Color.text} />}
                        onPress={() => this.click(0)}
                        content={<View style={styles.contentContainer}>
                            <Item title="Booking Date" value={moment(bookDetail.bookingDate).format('DD-MM-YYYY HH:MM')} />
                            <Item title="Booking Ref NO" value={bookDetail.bookingRefNo} />
                            <Item title="Itinerary Name" value={bookDetail.itineraryName} />
                            <Item title="Status" value={bookDetail.bookingStatus} />
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title='Operator Details'
                        icon={<Ionicons name="md-bus" size={16} color={Color.text} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            {/* <Item title="Title" value={`${locationInfo.fromLocation.name} to ${locationInfo.toLocation.name}`} /> */}
                            <Item title="Operated By" value={vendor.item.name} />
                            <Item title="Schedule" value={UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'scheduleCode')} />
                            <Item title="Journey Date" value={moment(dateInfo.startDate).format('DD-MM-YYYY')} />
                            <Item title="Bus Type" value={businessObject.type} />
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[2]}
                        title='Travelers Information'
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(2)}
                        content={<View style={styles.contentContainer}>
                            {travellerDetails.map((item, index) => <View key={index}>
                                <Text style={styles.guestTitle}>TRAVELER {index + 1}</Text> 
                                <Item title="Seat No" value={item.bookingDetails.seatNo} />
                                <Item title="Name" value={item.details.firstName + ' ' + item.details.lastName} />
                                <Item title="Age" value={item.age} />
                                <Item title="Gender" value={item.details.genderDesc} />
                                <Item title="Boarding Point" value={item.locationInfo.fromLocation.name} />
                                <Item title="Dropping Point" value={item.locationInfo.toLocation.name} />
                            </View>)}
                        </View>}
                    />
                    {addons.length > 0 && <ClosableGroupTitle
                        isClosed={this.state.closed[3]}
                        title='Add On Details'
                        // icon={<Ionicons name="md-bus" size={16} color={Color.text} />}
                        onPress={() => this.click(3)}
                        content={<View style={styles.contentContainer}>
                            {travellerDetails.map((item, index) => {
                                if(item.addons.length == 0) return
                                return (
                                    <View key={index}>
                                        <Item title="Seat No" value={item.bookingDetails.seatNo} />
                                        {
                                            item.addons.map((addon, idx)=><View key={index + ':' + idx}>
                                                <Item title="Name" value={addon.name} />
                                                <Item title={addon.type} value={addon.quantity} />
                                            </View>)
                                        }
                                    </View>    
                                )
                            })}
                        </View>}
                    />}
                    {leadPassenger != null && <ClosableGroupTitle
                        isClosed={this.state.closed[4]}
                        title='Lead Passenger'
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(4)}
                        content={<View style={styles.contentContainer}>
                            <Item title="Name" value={leadPassenger.details.firstName + ' ' + leadPassenger.details.lastName} />
                            <Item title="Cell Phone" value={`${leadPassenger.details.contactInformation.phoneNumberCountryCode||''}${leadPassenger.details.contactInformation.phoneNumber||''}`} />
                            <Item title="Email" value={leadPassenger.details.contactInformation.email} />
                        </View>}
                    />}
                    <ClosableGroupTitle
                        isClosed={this.state.closed[5]}
                        title='Fare Summary'
                        icon={<FontAwesome name="money" size={16} color={Color.text} />}
                        onPress={() => this.click(5)}
                        content={<View style={styles.contentContainer}>
                            {
                                businessObject.displayRateInfo.map( (obj, index) => {
                                    if(obj.purpose == '10') return null
                                    if(obj.purpose == '8') return null
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
                    <ClosableGroupTitle
                        isClosed={this.state.closed[6]}
                        title='Policy'
                        icon={<FontAwesome name="info-circle" size={16} color={Color.text} />}                        onPress={() => this.click(6)}
                        content={<View style={styles.contentContainer}>
                            <ItemText title="Vehicle Policies" value={policy}/>
                        </View>}
                    />
                    <View style={styles.bottomContainer}>
                        {showModifyCancel&&showOnlineCancellationOption === true && <View style={styles.buttonContainer}>
                            <RoundButton
                                title="Cancel"
                                onPress={() => this.cancelReservation(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineCancellationOption === false && <View style={styles.buttonContainer}>
                            <RoundButton
                                title="Cancel Request"
                                onPress={() => this.cancelRequest(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineModificationOption=== true &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title="Modify"
                                onPress={() => this.modifyReservation(bookDetail)}
                                style={{ backgroundColor: Color.primary }}
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
                    <TwoButtonModal
                        ref={e => this.cancellationModal = e}
                        title={'Cancellation Charges'}
                        isLoading={cancelFareLoading}
                        buttons={[
                            { title: 'Abort', onPress: () => this.cancellationModal.hide() },
                            { title: 'Confirm', onPress: () => this.cancel() }
                        ]}
                        items={[
                            { title: 'Cancellation Charge', value: cancelAmount },
                            { title: 'Discount Cancelled', value: discountCancel },
                            { title: 'Refund Amount', value: refundAmount },
                            { title: 'Refund Fee', value: refundFee },
                        ]}
                        type={1}
                    >
                    </TwoButtonModal>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = ({ language }) => ({ language});

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
    date: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10
    },
    bottomContainer: {
        padding: 10,
        flexDirection:'row'
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