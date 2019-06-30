import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native'

import Color from '@common/color'
import GroupTitle from '@components/home/groupTitle'
import { hotelIco, busIco, activityIco, flightIco, transferIco, carRentalIco, packageIco } from '@common/image';
import { FontAwesome } from '@expo/vector-icons'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';
import { Actions } from 'react-native-router-flux';
const { T1, T2 } = Global.Translate

getItemIcon = (id) => {
    switch (Number(id)) {
        case 1: return hotelIco;
        case 2: return carRentalIco;
        case 3: return busIco;
        case 4: return flightIco;
        case 5: return activityIco;
        case 8: return packageIco;
        case 9: return transferIco;
    }

    return hotelIco
}
const HotelItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("MMM DD") + ' - ' + moment(item.dateInfo.endDate).format("MMM DD")
    var rooms = item.paxDetails? item.paxDetails.numberOfItems : ""
    var guests = item.paxDetails? item.paxDetails.totalPaxQuantity : ""
    var nights = moment(item.dateInfo.endDate).diff(moment(item.dateInfo.startDate), 'days')
    var suppliers = 'expedia, ehotelier, quora'
    var isB2B = Global.environment.portalType == 'B2B'
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            <Text style={styles.dark}>{date}({nights > 1 ? `${nights} nights` : `1 night`}), <Text style={styles.light}>{guests} guests</Text></Text>
            <Text style={styles.primary}>{rooms > 1 ? `${rooms} Rooms` : `${rooms} Room`}</Text>
            {isB2B && <Text style={styles.darkBold}>Suppliers:<Text style={styles.dark}>{suppliers}</Text></Text>}
        </View>
    </TouchableOpacity>)
}

const BusItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, DD MMM YYYY")
    var guests = item.paxDetails? item.paxDetails.totalPaxQuantity : 1
    var way = 'One Way'
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            <Text style={styles.dark}>{date}, <Text style={styles.light}>{guests} Person</Text></Text>
            <Text style={styles.primary}>{UtilService.getDuration(item.dateInfo.startDate, item.dateInfo.endDate)}, <Text style={styles.light}>{guests} Seats</Text></Text>
            <Text style={styles.darkBold}>{way}</Text>
        </View>
    </TouchableOpacity>)
}

const VehicleItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, DD MMM YYYY")
    var time = moment(item.dateInfo.startDate).format("HH:mm")
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            <Text style={styles.dark}>{date}</Text>
            <Text style={styles.light}>Time: <Text style={styles.primary}>{time}</Text></Text>
        </View>
    </TouchableOpacity>)
}

const ActivityItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, D MMM YYYY")
    var guests = item.paxDetails.totalPaxQuantity
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            <Text style={styles.dark}>{date}, <Text style={styles.light}>{guests} Adults</Text></Text>
            <Text style={styles.light}>Duration: <Text style={styles.primary}>{item.duration}</Text></Text>
        </View>
    </TouchableOpacity>)
}

const PackageItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, D MMM YYYY")
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            {/* <Text style={styles.dark}>{date}</Text> */}
            <Text style={styles.dark}>{date}, <Text style={styles.light}>{item.paxDetails.totalPaxQuantity} guest(s)</Text></Text>
            <Text style={styles.light}>Duration: <Text style={styles.primary}>{item.duration}</Text></Text>
        </View>
    </TouchableOpacity>)
}

const FlightItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, D MMM YYYY")
    var guests = item.paxDetails.totalPaxQuantity

    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{item.details}</Text>
            <Text style={styles.dark}>{date}, <Text style={styles.light}>{guests} Adults</Text></Text>
            <Text style={styles.light}>Departure Time: <Text style={styles.primary}>{moment(item.dateInfo.startDate).format('HH:mm')}</Text></Text>
        </View>
    </TouchableOpacity>)
}

const TransferItem = (item) => {
    var date = moment(item.dateInfo.startDate).format("ddd, D MMM YYYY")
    var guests = item.paxDetails.totalPaxQuantity
    return (<TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
        <Image source={getItemIcon(item.businessID)} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{item.bookingRefNo}</Text>
            <Text style={styles.itemTitle}>{UtilService.NormalizeTransferName(item.details)}</Text>
            <Text style={styles.dark}>{date}, <Text style={styles.light}>{guests} Adults</Text></Text>
            <Text style={styles.light}>Duration: <Text style={styles.primary}>{item.duration}</Text></Text>
        </View>
    </TouchableOpacity>)
}

const CruiseItem = ({ icon, referenceNumber, title, date, guests, rooms, onPress }) => (
    <View style={styles.itemContainer}>
        <Image source={icon} style={styles.icon} />
        <View style={styles.content}>
            <Text style={styles.referenceNumber}>{referenceNumber}</Text>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.dark}>{date}<Text style={styles.light}>{guests} guests</Text></Text>
            <Text style={styles.primary}>{rooms} Rooms</Text>
        </View>
    </View>
)

const TabBar = ({ titles, index, onSelect, language:{T4} }) => (
    <View style={styles.tabContainer}>
        {titles.map((title, idx) => <TouchableOpacity onPress={() => onSelect(idx)} key={idx} style={styles.tabItemContainer}>
            <Text style={[styles.tabTitle, index == idx ? { color: Color.lightPrimary } : {}]}>{T4(title)}</Text>
        </TouchableOpacity>)}
    </View>
)

class MyBookingsC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            pageIndex: 0,
            titles: ['UPCOMING', 'COMPLETED', 'CANCELLED', 'OTHER'],
            bookings: [
                {
                    groupNumber: 'GTA854-DF123759',
                    items: [
                        { type: 'BUS', icon: hotelIco, referenceNumber: '845-BD15203', title: 'Lapaz to Santiago', date: 'Sat, 26th Nov 2016, ', persons: 2, duration: '10hrs 55mins', seats: 25, way: 'One Way' },
                        { type: 'HOTEL', icon: hotelIco, referenceNumber: '845-BD15203', title: 'Juhmeirah AI Qasr Madinat', date: 'May 22 - May 24 (2 nights), ', guests: 4, rooms: 2, suppliers: 'expedia, ehotelier, quora' }
                    ]
                },
                {
                    groupNumber: 'GTA854-DF123759',
                    items: [
                        { type: 'FLIGHT', icon: hotelIco, referenceNumber: '845-BD15203', title: 'Specijet Airlines', date: 'Mon, 17th May 2018, ', adults: 1, info: 'Departure Time: ', value: '21:30' },
                        { type: 'ACTIVITY', icon: hotelIco, referenceNumber: '845-BD15203', title: 'Glow In The Dark 18 Hole Mini Golf Wafi Mall In Dubai', date: 'Mon, 17th May 2018, ', adults: 4, info: 'Duration: ', value: '60 mins' }
                    ]
                }
            ],
            username: 'Kalpesh Agent',
            userInfo: 'Ks 6.615, 585.115'
        }

        this.props.actions.getMyBookings('upcoming')
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: ()=>Actions.Notifications(),
            notifications: 3,
        });
    }

    goViewReservation(item) {
        Actions.Reservation({ item })
    }

    renderBookingItem(item, idx) {
        let {language} = this.props
        switch(Number(item.businessID)) {
        case 1:
            return (<HotelItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 2:
            return (<VehicleItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 3:
            return (<BusItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 4:
            return (<FlightItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 5:
            return (<ActivityItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 8:
            return (<PackageItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        case 9:
            return (<TransferItem key={idx} language={language} {...item} onPress={() => this.goViewReservation(item)} />)
        }
    }
    render() {
        let { pageIndex, titles, username, userInfo } = this.state
        let { myBooks = {}, status } = this.props.cart
        let bookings = myBooks.data || []
        let {T1} = this.props.language
        return (
            <View style={styles.container}>
                <TabBar
                    language={this.props.language}
                    titles={titles}
                    index={pageIndex}
                    onSelect={index => {
                        this.setState({ pageIndex: index })
                        switch (index) {
                            case 0: this.props.actions.getMyBookings('upcoming'); break;
                            case 1: this.props.actions.getMyBookings('completed'); break;
                            case 2: this.props.actions.getMyBookings('cancelled'); break;
                            case 3: this.props.actions.getMyBookings('other'); break;
                        }
                    }}
                />
                {status == 'LOADING' && <ActivityIndicator size="large" color={Color.primary} style={{ flex: 1 }} />}
                {status != 'LOADING' && <ScrollView>
                    {/* <View style={styles.headerContainer}>
                        <FontAwesome name="user" size={24} color={Color.primary}/>
                        <Text style={styles.headerTitle}>{username}</Text>
                        <Text style={styles.userInfo}>{userInfo}</Text>
                    </View> */}
                    {bookings.map((booking, index) => (
                        <View key={index}>
                            <GroupTitle title={Object.keys(booking)[0]} />
                            <View style={styles.groupContent}>
                                {Object.values(booking)[0].map((item, idx) =>
                                    this.renderBookingItem(item, idx)
                                )}
                            </View>
                        </View>
                    ))}
                    {bookings.length==0&&<View style={{padding:15}}><Text style={styles.light}>{T1('message31')}</Text></View>}
                </ScrollView>}
            </View>
        )
    }
}

const mapStateToProps = ({ cart, auth, language }) => ({ cart, auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default MyBookings = connect(mapStateToProps, mapDispatchToProps)(MyBookingsC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Color.lightBack,
        height: 50,
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    tabItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#ccc'
    },
    tabTitle: {
        fontSize: 12,
        color: Color.lightText
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        width: '100%',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode:'contain'
    },
    content: {
        flex: 1
    },
    referenceNumber: {
        fontSize: 12,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    itemTitle: {
        fontSize: 18,
        color: Color.lightPrimary,
        fontWeight: 'bold'
    },
    dark: {
        color: Color.darkText,
        fontWeight: 'normal'
    },
    darkBold: {
        color: Color.darkText,
        fontWeight: 'bold'
    },
    light: {
        color: Color.lightText,
        fontWeight: 'normal',
    },
    primary: {
        color: Color.primary,
        fontWeight: 'normal',
        // fontSize: 12
    },
    lightBold: {
        color: Color.lightText,
        fontWeight: 'bold'
    },
    groupContent: {
        paddingHorizontal: 15
    },
    headerContainer: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 16,
        color: Color.primary,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10
    },
    userInfo: {
        fontSize: 15,
        color: Color.lightPrimary
    }
})