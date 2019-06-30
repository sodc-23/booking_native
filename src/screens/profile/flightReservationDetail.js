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
import { flight_primary, double_arrow, whiteTwoWayIcon, whiteOneWayIcon } from '@common/image'
import RoundButton from '@components/general/roundButton'
import moment from 'moment';
import { BOOKING_DETAIL } from '@store/cart/actionTypes';
import Marquee from '@components/general/react-native-text-ticker'
import {Actions} from 'react-native-router-flux'
import Global from "@utils/global";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import UtilService from '@utils/utils';

const { T1, T2 } = Global.Translate

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <Text style={styles.itemValue}>{value}</Text>
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
                { title: 'Itinerary', value: 'Bus' },
                { title: 'Status', value: 'Confirmed' },
            ],
            operator:[
                { title: 'Operated By', value: 'Saudi Arabian Airlines'},
                { title: 'Flight', value: '533'},
                { title: 'Class', value: 'Economic Standard(M)'},
                { title: 'Depart', value: moment(new Date()).format('DD/MM/YYYY hh:mm A')},
                { title: 'Arrive', value: moment(new Date()).format('DD/MM/YYYY hh:mm A')},
            ],
            travelers:[
                [
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Nationality', value: 'Egyptain'}, 
                    { title: 'Document Type', value: 'Passport'}, 
                    { title: 'Document Number', value: 'AhmedIbrahim'}, 
                    { title: 'Expiry Date', value: moment(new Date()).format('DD-MM-YYYY')}, 
                ],
                
            ],
            addOn:[
                { title: 'Seat No', value: '32'}, 
                { title: 'Name', value: 'Manoj Patil'}, 
                { title: 'Baggage', value: '25Kgs'}, 
                { title: 'Meal Preference', value: '-'}, 
                { title: 'Status', value: '-'}, 
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
            icon: flight_primary
        }
    }
    click(index) {
        this.state.closed[index] = !this.state.closed[index]
        this.setState({ closed: [...this.state.closed] })
    }

    cancelReservation() {
        let {bookDetail, item} = this.props
        Actions.CancelFirst({bookDetail, item})
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
        let {businessObject = {},travellerDetails = []}  = bookDetail

        let {items = [], tripType = "Oneway"} = businessObject
        let {item = []} = items[0]
        let startDate = item[0].dateInfo || {}
        let endDate = item[item.length - 1].dateInfo || {}
        let startLocation = item[0].locationInfo || {}
        let endLocation = item[item.length - 1].locationInfo || {}
        var fromLocation = startLocation.fromLocation.id
        var toLocation = endLocation.toLocation.id
        var prepayRate = (businessObject.displayRateInfo.find(o=>o.purpose=='8')||{}).amount||0
        var totalRate = (businessObject.displayRateInfo.find(o=>o.purpose=='10')||{}).amount||0

        let {showOnlineCancellationOption, showOnlineModificationOption, showOnlinePaxModificationOption} = bookDetail
        showOnlineCancellationOption = false
        showOnlineModificationOption = false
        showOnlinePaxModificationOption = true
        var addons = []
        travellerDetails.map((item) => {
            item.addons.map((addon)=>addons.push(addon))
        })
        var showModifyCancel = bookDetail.bookingStatusID==1 && businessObject.dateInfo.startDate > moment().format('YYYY-MM-DDT23:59:59')

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <View style={{ flexDirection: 'row', alignItems:'center' }}>
                            <Text style={styles.bigText}>{fromLocation}</Text>
                            <Image source={tripType=='Oneway'?whiteOneWayIcon :whiteTwoWayIcon} style={styles.swapIcon} />
                            <Text style={styles.bigText}>{toLocation}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <FontAwesome name="calendar" size={16} color={'white'} />
                            <Text style={styles.date}>{moment(startDate.startDate).format('ddd,Do MMM YYYY,hh:mm A')}</Text>
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
                            <Item title="Booking Date" value={moment(bookDetail.bookingDate).format('DD-MM-YYYY HH:mm')} />
                            <Item title="Booking Ref Number" value={bookDetail.bookingRefNo} />
                            <Item title="Itinerary Name" value={bookDetail.itineraryName} />
                            <Item title="Itinerary Name" value={bookDetail.itineraryRefNo} />
                            <Item title="Status" value={bookDetail.bookingStatus} />
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title='Operator Details'
                        icon={<Ionicons name="ios-airplane" size={16} color={Color.text} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            <Item title="Title" value={`${item[0].locationInfo.fromLocation.name} (${item[0].locationInfo.fromLocation.id}) – ${item[0].locationInfo.toLocation.name} (${item[0].locationInfo.toLocation.id})`}/>
                            <Item title="Operated By" value={item[0].vendors[0].item.name}/>
                            <Item title="Flight" value={item[0].code}/>
                            <Item title="Class" value={UtilService.getFieldFromList2(item[0].tpExtension, 'key', 'value', 'cabinClass')}/>
                            <Item title="Depart" value={moment(item[0].dateInfo.startDate).format('DD-MM-YYYY HH:mm')}/>
                            <Item title="Arrive" value={moment(item[0].dateInfo.endDate).format('DD-MM-YYYY HH:mm')}/>
                            <Item title="Travel Time" value={UtilService.getHourMin(item[0].journeyDuration + item[0].layOverDuration)}/>
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[2]}
                        title='Travelers Information'
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(2)}
                        content={<View style={styles.contentContainer}>
                           {travellerDetails.map((item, index) => <View key={index}>
                                <Text style={styles.guestTitle}>TRAVELER{index + 1}</Text>
                                <Item title="Name" value={item.details.firstName + ' ' + item.details.lastName} />
                                <Item title="Age" value={item.details.age} />
                                <Item title="Gender" value={item.details.genderDesc} />
                                <Item title="Traveller Type" value={item.typeString} />
                                <Item title="Address" value={item.details.location.address} />
                                <Item title="City" value={item.details.location.city} />
                                <Item title="Email" value={item.details.contactInformation.email} />
                                <Item title="Contact Phone" value={`${item.details.contactInformation.phoneNumberCountryCode||''}${item.details.contactInformation.phoneNumber||''}`} />
                                <Item title="Home Phone" value={`${item.details.contactInformation.homePhoneNumberCountryCode||''}${item.details.contactInformation.homePhoneNumber||''}`} />
                                <Item title="Document Type" value={item.details.documentType} />
                                <Item title="Document Number" value={item.details.documentNumber} />
                                <Item title="Document Expiry" value={moment(item.details.passportExpirationDate).format('DD-MM-YYYY HH:mm')} />
                                <Item title="ETicket" value={item.bookingDetails.eTicketNo} />
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
                    <ClosableGroupTitle
                        isClosed={this.state.closed[3]}
                        title='Fare Summary'
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
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = ({ }) => ({ });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch)
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
        height: 32,
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
    },
    swapIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        marginHorizontal: 5
    },
    bigText:{
        fontSize:18,
        fontWeight:'bold',
        color:'white'
    }
})