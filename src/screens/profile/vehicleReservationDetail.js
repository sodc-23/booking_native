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
import { vehicle_primary } from '@common/image'
import RoundButton from '@components/general/roundButton'
import moment from 'moment';
import { BOOKING_DETAIL } from '@store/cart/actionTypes';
import Marquee from '@components/general/react-native-text-ticker'
import Global from "@utils/global";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
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
            closed: [false, false, false, false, false],
            details: [
                { title: 'Booking Rate', value: '16-11-2016 13:06' },
                { title: 'Booking Ref NO', value: '1116-aa00724' },
                { title: 'Itinerary', value: 'Mercedes Benz C Class' },
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
                    { title: 'Name', value: 'Ahmed Ibrahim'}, 
                    { title: 'Age', value: '32'}, 
                    { title: 'Gender', value: 'Male'}, 
                    { title: 'Anniversary Date', value: 'Ahmedabad Central'}, 
                    { title: 'Document Type', value: 'Passport'}, 
                    { title: 'Document Number', value: 'Ahmed Ibrahim'}, 
                    { title: 'Expiry Date', value: moment(new Date()).format('DD-MM-YYYY')}, 
                    { title: 'Mobile', value: '0123456789'}, 
                    { title: 'Email', value: 'Ahmed@gmail.com'}, 
                ],
            ],
            addOn:[
                { title: 'Passengers', value: 5}, 
                { title: 'Bags', value: 2},
            ],
            leadPassenger:[
                { title: 'Name', value: 'Ahmed'}, 
                { title: 'Cell Phone', value: '123456789'}, 
                { title: 'Email', value: 'Ahmed@gmail.com'}, 
                { title: 'Meal Preference', value: 'AC Car'}, 
            ],
            summary: [
                { title: 'Base Price', value: '$500.50' },
                { title: 'Ski Rack', value: '$82.58' },
                { title: 'Navigation System', value: '$7.00' },
                { title: 'Todler Seat', value: '$5.00' },
                { title: 'Transaction', value: '$59.51' },
            ],
            
            title: 'Lapaz To Savtiago',
            busName : 'LITORAL MIRAMAR',
            date: 'Sat, 26th Nov 2016, 07:25 AM',
            icon: vehicle_primary
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
        let {businessObject = {}, travellerDetails} = bookDetail
        let {vendors = [], tpExtension=[]} = businessObject
        var prepayRate = (businessObject.displayRateInfo.find(o=>o.purpose=='8')||{}).amount||0
        var totalRate = (businessObject.displayRateInfo.find(o=>o.purpose=='10')||{}).amount||0

        var policy = businessObject.policies.map((item)=>item.description).join('\n\r')
        var equipments = businessObject.items[0]?businessObject.items[0].item.filter(o=>(o.quantity > 0)).map((item)=>item.name + " : " + item.quantity).join('\n\r'):""

        let {showOnlineCancellationOption, showOnlineModificationOption, showOnlinePaxModificationOption} = bookDetail
        showOnlineCancellationOption = false
        showOnlineModificationOption = false
        showOnlinePaxModificationOption = true
        var showModifyCancel = bookDetail.bookingStatusID==1 && businessObject.dateInfo.startDate > moment().format('YYYY-MM-DDT23:59:59')

        var carType = []
        carType.push(businessObject.category)
        carType.push(UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'size'))
        carType.push(UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'transmissionType'))
        carType.push(UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'airConditionDesc'))

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
                            <Item title={T3("Itinerary RefNo")} value={bookDetail.itineraryRefNo} />
                            <Item title={T3("Booking Status")} value={bookDetail.bookingStatus} />
                            <Item title={T3("Date")} value={moment(bookDetail.businessObject.dateInfo.startDate).format('DD-MM-YYYY HH:MM')} />
                        </View>}
                    />
                    {/* <ClosableGroupTitle
                        isClosed={this.state.closed[1]}
                        title='Operator Details'
                        icon={<Ionicons name="md-car" size={16} color={Color.text} />}
                        onPress={() => this.click(1)}
                        content={<View style={styles.contentContainer}>
                            <Item title="Operated By" value={vendors[0]?vendors[0].item.name:''}/>
                            <Item title="Schedule" value={'1116-aa00724'}/>
                            <Item title="Journey Date" value={'2019-03-29'}/>
                        </View>}
                    /> */}
                    <ClosableGroupTitle
                        isClosed={this.state.closed[2]}
                        title={T3('Travelers Information')}
                        icon={<FontAwesome name="user-circle-o" size={16} color={Color.text} />}
                        onPress={() => this.click(2)}
                        content={<View style={styles.contentContainer}>
                            {travellerDetails.map((item, index) => <View key={index}>
                                <Item title={T3("Name")} value={item.details.firstName + ' ' + item.details.lastName} />
                                <Item title={T3("Age")} value={item.details.age} />
                                <Item title={T3("Gender")} value={item.details.genderDesc} />
                                <Item title={T3("Address")} value={item.details.location.address} />
                                <Item title={T3("Country")} value={item.details.location.country} />
                                <Item title={T3("Email")} value={item.details.contactInformation.email} />
                                <Item title={T3("Phone Number")} value={`${item.details.contactInformation.phoneNumberCountryCode||''}${item.details.contactInformation.phoneNumber||''}`} />
                                <Item title={T3("Home Phone")} value={`${item.details.contactInformation.homePhoneNumberCountryCode||''}${item.details.contactInformation.homePhoneNumber||''}`} />
                            </View>)}                            
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[3]}
                        title={T3('Pickup Details')}
                        // icon={<Ionicons name="md-bus" size={16} color={Color.text} />}
                        onPress={() => this.click(3)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Date")} value={moment(businessObject.dateInfo.startDate).format('DD-MM-YYYY')}/>
                            <Item title={T3("Time")} value={moment(businessObject.dateInfo.startDate).format('HH:mm')}/>
                            <Item title={T3("Location")} value={businessObject.locationInfo.fromLocation.name}/>
                            <Item title={T3("Address")} value={businessObject.locationInfo.fromLocation.address}/>
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[4]}
                        title={T3('Drop Off Details')}
                        // icon={<Ionicons name="md-bus" size={16} color={Color.text} />}
                        onPress={() => this.click(4)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Date")} value={moment(businessObject.dateInfo.endDate).format('DD-MM-YYYY')}/>
                            <Item title={T3("Time")} value={moment(businessObject.dateInfo.endDate).format('HH:mm')}/>
                            <Item title={T3("Location")} value={businessObject.locationInfo.toLocation.name}/>
                            <Item title={T3("Address")} value={businessObject.locationInfo.toLocation.address}/>
                        </View>}
                    />
                    <ClosableGroupTitle
                        isClosed={this.state.closed[5]}
                        title={T3('Car Details')}
                        // icon={<Ionicons name="md-bus" size={16} color={Color.text} />}
                        onPress={() => this.click(5)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Car Name")} value={businessObject.name}/>
                            <Item title={T3("Car Provider")} value={bookDetail.providerName}/>
                            <Item title={T3("Car Category")} value={businessObject.category}/>
                            <Item title={T3("Car Type")} value={carType.join(",")}/>
                        </View>}
                    />
                    {equipments.length > 0 && <ClosableGroupTitle
                        isClosed={this.state.closed[6]}
                        title={T3('Extra Equipment Details')}
                        onPress={() => this.click(6)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Get extra equipments here")} value={equipments}/>
                        </View>}
                    />}
                    <ClosableGroupTitle
                        isClosed={this.state.closed[7]}
                        title={T3('Fare Summary')}
                        icon={<FontAwesome name="money" size={16} color={Color.text} />}
                        onPress={() => this.click(7)}
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
                        isClosed={this.state.closed[8]}
                        title={T3('Policy')}
                        icon={<FontAwesome name="info-circle" size={16} color={Color.text} />}                        onPress={() => this.click(6)}
                        onPress={() => this.click(8)}
                        content={<View style={styles.contentContainer}>
                            <Item title={T3("Vehicle Policies")} value={policy}/>
                        </View>}
                    />
                    <View style={styles.bottomContainer}>
                        {showModifyCancel&&showOnlineCancellationOption === true && <View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Cancel")}
                                onPress={() => this.cancelReservation(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineCancellationOption === false && <View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Cancel Request")}
                                onPress={() => this.cancelRequest(bookDetail)}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineModificationOption=== true &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Modify")}
                                onPress={() => this.modifyReservation(bookDetail)}
                                style={{ backgroundColor: Color.primary }}
                                textStyle={styles.buttonText}
                            />
                        </View>}
                        {showModifyCancel&&showOnlineModificationOption === false &&<View style={styles.buttonContainer}>
                            <RoundButton
                                title={T3("Modify Request")}
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
const mapStateToProps = ({language }) => ({ language});

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
        minHeight : 32,
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
    }
})