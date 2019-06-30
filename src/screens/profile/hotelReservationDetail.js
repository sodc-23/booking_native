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
import { FontAwesome } from '@expo/vector-icons'
import Color from '@common/color'
import { hotel_primary } from '@common/image'
import RoundButton from '@components/general/roundButton'
import moment from 'moment';
import { BOOKING_DETAIL } from '@store/cart/actionTypes';
import Marquee from '@components/general/react-native-text-ticker'
import Global from "@utils/global";
import TwoButtonModal from '@components/home/twoButtonModal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';

import { Actions } from 'react-native-router-flux';
import UtilService from '@utils/utils';

const { T1, T2, } = Global.Translate

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
)
const ItemImage = ({ title, url }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <View style={styles.itemImage}>
            <Image source={{uri:url}} style={styles.imageItem} />
        </View>
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
            closed: [false, false, false, false, false, false],
            details: [
                { title: 'Booking Rate', value: '16-11-2016 13:06' },
                { title: 'Booking Ref NO', value: '1116-aa00724' },
                { title: 'Itinerary', value: 'Hotel' },
                { title: 'Status', value: 'Confirmed' },
            ],
            summary: [
                { title: 'Original Price', value: '$500.50' },
                { title: 'Service Tax', value: '$82.58' },
                { title: 'Instant Discount', value: '$7.00' },
                { title: 'Meal Preference', value: '$5.00' },
            ],
            guest: [
                {
                    title: 'Guest 1',
                    items: [
                        { title: 'Name', value: 'Ahmed Ibrahim' },
                        { title: 'Age', value: '32' },
                        { title: 'Gender', value: 'Male' },
                    ]
                },
                {
                    title: 'Guest 2',
                    items: [
                        { title: 'Name', value: 'Ahmed Ibrahim' },
                        { title: 'Age', value: '32' },
                        { title: 'Gender', value: 'Male' },
                    ]
                }
            ],
            title: 'Paradiso Hotel',
            date: 'Sat, 26th Nov 2016, 07:25 AM',
            icon: hotel_primary,
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
        let { details, summary, guest, title, date, icon, cancelFareLoading, 
            cancelAmount, discountCancel, refundAmount, refundFee } = this.state
        let { bookDetail } = this.props
        let businessObject = bookDetail.businessObject
        let travellerDetails = bookDetail.travellerDetails
        var prepayRate = (businessObject.displayRateInfo.find(o=>o.purpose=='8')||{}).amount||0
        var totalRate = (businessObject.displayRateInfo.find(o=>o.purpose=='10')||{}).amount||0
        let {showOnlineCancellationOption, showOnlineModificationOption, showOnlinePaxModificationOption} = bookDetail
        // showOnlineCancellationOption = true
        // showOnlineModificationOption = true
        // showOnlinePaxModificationOption = true
        var nights = moment(businessObject.dateInfo.endDate).diff(moment(businessObject.dateInfo.startDate), 'days');
        var policy = businessObject.policies.map((item)=>UtilService.decodeHtmlEntity(item.description)).join('\n\r')
        var showModifyCancel = bookDetail.bookingStatusID==1 && businessObject.dateInfo.startDate > moment().format('YYYY-MM-DDT23:59:59')

        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Marquee style={styles.headerTitle}>{businessObject.name}</Marquee>
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
                            <Item title={T3("Hotel Name")} value={businessObject.name} />
                            <ItemImage title={T3("Image")} url={businessObject.images[0].url} />
                            <Item title={T3("Rating")} value={businessObject.rating} />
                            <Item title={T3("Address")} value={businessObject.locationInfo.fromLocation.address} />
                            <Item title={T3("Checkin")} value={moment(businessObject.dateInfo.startDate).format('DD-MM-YYYY HH:MM')} />
                            <Item title={T3("Checkout")} value={moment(businessObject.dateInfo.endDate).format('DD-MM-YYYY HH:MM')} />
                            <Item title={T3("Night(s)")} value={nights} />
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title={T3('Guest Information')}
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            {travellerDetails.map((item, index) => <View key={index}>
                                <Text style={styles.guestTitle}>Guest{index + 1}</Text>
                                <Item title={T3("Name")} value={`${item.details.firstName} ${item.details.lastName}`} />
                                {item.details.age > 0 && <Item title={T3("Age")} value={item.details.age} />}
                                <Item title={T3("Gender")} value={item.details.genderDesc} />
                                <Item title={T3("Address")} value={item.details.location.address} />
                                <Item title={T3("City")} value={item.details.location.city} />
                                <Item title={T3("Email")} value={item.details.contactInformation.email} />
                                <Item title={T3("Contact Phone")} value={`${item.details.contactInformation.phoneNumberCountryCode||''}${item.details.contactInformation.phoneNumber||''}`} />
                                <Item title={T3("Home Phone")} value={`${item.details.contactInformation.homePhoneNumberCountryCode||''}${item.details.contactInformation.homePhoneNumber||''}`} />
                            </View>)}
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title={T3('Room Detail')}
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            {businessObject.items[0].item.map((item, index) => <View key={index}>
                                <Text style={styles.guestTitle}>Room {index + 1}</Text>
                                <Item title={T3("Room Type")} value={item.description} />
                                <Item title={T3("Board Type")} value={item.boardTypes[0].type} />
                                <Item title={T3("Adult(s)")} value={UtilService.getFieldFromList2(item.tpExtension, 'key', 'value', 'adults')} />
                                <Item title={T3("Children(s)")} value={UtilService.getFieldFromList2(item.tpExtension, 'key', 'value', 'children')} />
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
                                    if(obj.purpose == '10' || obj.amount == 0) return null
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
                    <ClosableGroupTitle
                        isClosed={this.state.closed[5]}
                        title={T3('Policy')}
                        icon={<FontAwesome name="info-circle" size={16} color={Color.text} />}                        onPress={() => this.click(6)}
                        onPress={() => this.click(5)}
                        content={<View style={styles.contentContainer}>
                            <ItemText title={T3("Hotel Policies")} value={policy}/>
                        </View>}
                    />
                    <View style={styles.bottomContainer}>
                        {showModifyCancel && showOnlineCancellationOption === true && <View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Cancel")}
                                onPress={() => this.cancelReservation(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel && showOnlineModificationOption=== true &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Modify")}
                                onPress={() => this.modifyReservation(bookDetail)}
                                style={{ backgroundColor: Color.primary }}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel && showOnlineCancellationOption === false && <View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Cancel Request")}
                                onPress={() => this.cancelRequest(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel && showOnlineModificationOption === false &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Modify Request")}
                                onPress={() => this.modifyRequest(bookDetail)}
                                style={{ backgroundColor: Color.primary }}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                    </View>
                    <TwoButtonModal
                        ref={e => this.cancellationModal = e}
                        title={T3('Cancellation Charges')}
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

const mapStateToProps = ({ language }) => ({ language });

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
    itemImage: {
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
    imageItem: {
        width: '100%',
        height: 150,
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
    itemValueText : {
        color: Color.primary,
        fontSize: 12,
        flex: 2,
        marginLeft: 20
    },
})