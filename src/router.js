import React, { PureComponent } from "react";

import { KeyboardAvoidingView, NetInfo, StyleSheet, StatusBar, View } from "react-native";
import {
    Scene,
    Router,
    Actions,
    Reducer,
    ActionConst,
    Overlay,
    Tabs,
    Modal,
    Drawer,
    Stack,
    Lightbox,
} from 'react-native-router-flux';
import { Asset, AppLoading, DangerZone } from 'expo';
import { StackViewStyleInterpolator } from 'react-navigation-stack';
import { connect } from "react-redux";
import * as commonActions from '@store/common/actions'
import * as authActions from '@store/auth/actions'
import * as langActions from '@store/language/actions'
import { bindActionCreators } from "redux";
import Global from '@utils/global'
import Color from "@common/color";

import api from "@services"
import async from 'async'

import TabBarIcon from '@components/general/tabBarIcon'
import NavBar from '@components/general/navBar'
import MyToast from '@components/general/myToast'

// General
import General from '@screens/general/general'
import Loading from '@screens/general/loading'
import ImageList from '@screens/general/imageList'
import SelectCommonLocation from '@screens/home/selectLocation'

// *********** Home ************
import Home from '@screens/home'
import SelectDate from '@screens/home/selectDate'
import FilterScreen from '@screens/home/filterScreen'
import MyBookings from '@screens/home/myBookings'
import ThankYou from '@screens/home/thankYou'
//-hotel
import SelectRoom from '@screens/home/hotel/selectRoom'
import HotelList from '@screens/home/hotel/searchResult'
import HotelDetail from '@screens/home/hotel/hotelDetail'
import RoomList from '@screens/home/hotel/roomList'
import RoomDetail from '@screens/home/hotel/roomDetail'
import Booking from '@screens/home/booking'
//import SelectLocation from '@screens/home/hotel/selectLocation'

//-Activities
import SelectPassenger from '@screens/home/activities/selectPassenger'
import ActivityList from '@screens/home/activities/searchResult'
import ActivityDetail from '@screens/home/activities/activityDetail'

//-Transfer
import TransferList from '@screens/home/transfer/searchResult'
import TransferDetail from '@screens/home/transfer/transferDetail'
import TransferTypeList from '@screens/home/transfer/typeSelect'

//-Train
import TrainList from '@screens/home/trains/searchResult'
import TrainDetail from '@screens/home/trains/seatSelect'

//-Flight
import FlightList from '@screens/home/flights/searchResult'
import FlightDetail from '@screens/home/flights/flightDetail'
import SelectPassenger2 from '@screens/home/flights/selectPassenger'

//Vehicle
import VehicleList from '@screens/home/vehicle/searchResult'
import VehicleDetail from '@screens/home/vehicle/vehicleDetail'

// Buses
import BusDetail from "@screens/home/buses/seatSelect";
import BusList from "@screens/home/buses/searchResult";

// Cruise
import CruiseList from '@screens/home/cruise/searchResult'
import CruiseDetail from '@screens/home/cruise/cruiseDetail'
import CruiseRoomList from '@screens/home/cruise/roomList'
import CruiseRoomDetail from '@screens/home/cruise/roomDetail'

// *********** Package ************
import Packages from '@screens/packages'
import PackageList from '@screens/packages/searchResult'
import PackageDetail from '@screens/packages/packageDetail'
import SelectPassenger3 from '@screens/home/package/selectPassenger'
import PackageBooking from "@screens/packages/booking";
import PackageFilter from '@screens/packages/packageFilter'

// *********** Hot Deals ************
import HotDeal from '@screens/hotDeal'

// *********** My Cart ************
import MyCart from '@screens/myCart'
import CheckOut from '@screens/myCart/checkout'
import PaymentHandler from '@screens/myCart/paymentHandler'
import PriceDetail from '@screens/myCart/priceDetail'

// *********** Profile ************
import Profile from '@screens/profile'
import Login from '@screens/auth/login'
import LoginAndProfile from '@screens/auth/loginAndProfile'
import Register from '@screens/auth/register'
import ForgotPassword from '@screens/auth/forgotPassword'
import VerifyNumber from '@screens/auth/verifyNumber'
import ChangePassword from '@screens/auth/changePassword'
import HotelReservationDetail from '@screens/profile/hotelReservationDetail'
import BusReservationDetail from '@screens/profile/busReservationDetail'
import FlightReservationDetail from '@screens/profile/flightReservationDetail'
import TransferReservationDetail from '@screens/profile/transferReservationDetail'
import VehicleReservationDetail from '@screens/profile/vehicleReservationDetail'
import ActivityReservationDetail from '@screens/profile/activityReservationDetail'
import PackageReservationDetail from '@screens/profile/packageReservationDetail'
import Reservation from '@screens/profile/reservation'
import Modify from '@screens/profile/modify'
import CancelFirst from '@screens/profile/cancelFirst'
import CancelSecond from '@screens/profile/cancelSecond'
import SuccessReservation from '@screens/profile/successReservation'
import ModifyFirst from '@screens/profile/modifyFirst'
import ModifySecond from '@screens/profile/modifySecond'
import ModifyThird from '@screens/profile/modifyThird'
import MyProfile1 from "@screens/profile/myProfile";
import CoTraveler from "@screens/profile/coTraveler";
import AboutUs from "@screens/profile/aboutUs";
import AboutApp from "@screens/profile/aboutApp";
import EditProfile from "@screens/profile/editProfile";
import EditTraveler from "@screens/profile/editCoTraveler";
import Notificatins from "@screens/profile/notifications";
import Privacy from "@screens/profile/privacy";
import LedgerBalance from '@screens/profile/ledgerBalance'



const transitionConfig = () => ({
    screenInterpolator:
        StackViewStyleInterpolator.forFadeFromBottomAndroid,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarStyle: {
        backgroundColor: '#eee',
    },
    tabBarSelectedItemStyle: {
        backgroundColor: '#ddd',
    },
});

class Root extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            setting: {},
            offlineMode: false,
        };

        this._cacheResourcesAsync.bind(this)
        console.disableYellowBox = true;
        this.scenes = null
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            hasInternetConnection => {
                this.props.commonActions.setInternetConnection(hasInternetConnection)
                if (!hasInternetConnection) {
                    this.setState({offlineMode:true}, ()=>{
                        if ( this.scenes ) Actions.Offline()
                    })
                }else{
                    this.setState({offlineMode:false}, ()=>{
                        if ( this.scenes ) Actions.pop()
                    })
                }
            }
        );

    }
    componentWillReceiveProps(next) {
        // if ( next.types==actionTypes.LOGOUT ){
        //     this.refs.toast.show('You have been logged out!');
        // }
    }
    _cacheResourcesAsync = async () => {
        let { T1, T2 } = this.props
        const images = [
            require('@images/background.png'),
            require('@images/aboutus.png'),
            require('@images/offline.jpeg'),
            require('@images/maintenance.png'),
            require('@images/transfer-loading.png'),
            require('@images/hotel-loading.png'),
            require('@images/activity-loading.png'),
            require('@images/car-loading.png'),
            require('@images/flight-loading.png'),
            require('@images/logo.png'),
            require('@images/white_logo.png'),
            require('@images/home_back.png'),
            require('@images/map-pin.png'),
            require('@images/placeholder.jpg'),
            require('@images/tabIcons/home_grey.png'),
            require('@images/tabIcons/home_primary.png'),
            require('@images/tabIcons/package_grey.png'),
            require('@images/tabIcons/package_primary.png'),
            require('@images/tabIcons/hotdeal_grey.png'),
            require('@images/tabIcons/hotdeal_primary.png'),
            require('@images/tabIcons/mycart_grey.png'),
            require('@images/tabIcons/mycart_primary.png'),
            require('@images/tabIcons/profile_grey.png'),
            require('@images/tabIcons/profile_primary.png'),
            require('@images/placeholder.jpg'),
            require('@images/location.png'),
            require('@images/hotel1.png'),
            require('@images/icons/sortIcon.png'),
            require('@images/icons/filterIcon.png'),
            require('@images/icons/mapIcon.png'),
            require('@images/icons/message_black.png'),
            require('@images/icons/message_white.png'),
            require('@images/icons/message_green.png'),
            require('@images/icons/mobile_black.png'),
            require('@images/icons/mobile_white.png'),
            require('@images/icons/mobile_green.png'),
            require('@images/icons/locked.png'),
            require('@images/icons/ios7-close-empty.png'),
            require('@images/icons/bed.png'),
            require('@images/icons/night.png'),
            require('@images/icons/calendar.png'),
            require('@images/icons/navigation.png'),
            require('@images/icons/chatIcon.png'),
            require('@images/icons/infoIcon.png'),
            require('@images/icons/primaryInfo.png'),
            require('@images/icons/removeIcon.png'),
            require('@images/icons/bank.png'),
            require('@images/icons/internet_bank.png'),
            require('@images/icons/card.png'),
            require('@images/icons/sadad.png'),
            require('@images/icons/two_way.png'),
            require('@images/icons/one_way.png'),
            require('@images/icons/nile.png'),
            require('@images/icons/oval_landing.png'),
            require('@images/icons/oval_land_off.png'),
            require('@images/icons/depart.png'),
            require('@images/icons/return.png'),
            require('@images/icons/double_arrow.png'),
            require('@images/icons/Pass.png'),
            require('@images/icons/Checked.png'),
            require('@images/icons/hotel.png'),
            require('@images/icons/transfer.png'),
            require('@images/icons/package.png'),
            require('@images/icons/cruise.png'),
            require('@images/icons/train.png'),
            require('@images/icons/car_rental.png'),
            require('@images/icons/flight.png'),
            require('@images/icons/activity.png'),
            require('@images/icons/hotel_primary.png'),
            require('@images/icons/bus_primary.png'),
            require('@images/icons/flight_primary.png'),
            require('@images/icons/transfer_primary.png'),
            require('@images/icons/vehicle_primary.png'),
            require('@images/icons/activity_primary.png'),
            require('@images/icons/man_man.png'),
            require('@images/icons/man_child.png'),
            require('@images/icons/transfer_bag.png'),
            require('@images/icons/transfer_man.png'),
            require('@images/icons/transfer_green_car.png'),
            require('@images/icons/benz.png'),
            require('@images/NoImagefound.jpg'),
            require('@images/promotion.png'),
            require('@images/notFound/vehicle.jpg'),
            require('@images/icons/facility_primary1.png'),

            //svg
            require('@images/svg/Front-desk-svg.png'),
            require('@images/svg/016-room-service-svg.png'),
            require('@images/svg/038-gym-svg.png'),
            require('@images/svg/Security-svg.png'),
            require('@images/svg/015-restaurant-svg.png'),
            require('@images/svg/disabled-svg.png'),
            require('@images/svg/pets-svg.png'),
            require('@images/svg/air-conditioner-svg.png'),
            require('@images/svg/012-atm-svg.png'),
            require('@images/svg/021-swimmer-2-svg.png'),
            require('@images/svg/Babysitting-service-svg.png'),
            require('@images/svg/003-luggage-svg.png'),
            require('@images/svg/bar-svg.png'),
            require('@images/svg/Bathrobes-svg.png'),
            require('@images/svg/026-hot-tub-svg.png'),
            require('@images/svg/039-scuba-diving-svg.png'),
            require('@images/svg/Salon-svg.png'),
            require('@images/svg/bottled-water-svg.png'),
            require('@images/svg/014-breakfast-svg.png'),
            require('@images/svg/044-wifi-svg.png'),
            require('@images/svg/Currency-exchange-svg.png'),
            require('@images/svg/007-housekeeping-svg.png'),
            require('@images/svg/bed-svg.png'),
            require('@images/svg/Dry-cleaning-svg.png'),
            require('@images/svg/Elevator-svg.png'),
            require('@images/svg/tennis-court-svg.png'),
            require('@images/svg/family-room-svg.png'),
            require('@images/svg/Refrigerator-svg.png'),
            require('@images/svg/garden-svg.png'),
            require('@images/svg/gift-svg.png'),
            require('@images/svg/hair-dryer-svg.png'),
            require('@images/svg/safety-box-svg.png'),
            require('@images/svg/004-books-svg.png'),
            require('@images/svg/car-svg.png'),
            require('@images/svg/029-river-svg.png'),
            require('@images/svg/shower-svg.png'),
            require('@images/svg/Wake-up-svg.png'),
            require('@images/svg/kids-club-svg.png'),
            require('@images/svg/009-concierge-svg.png'),
            require('@images/svg/Toiletries-svg.png'),
            require('@images/svg/027-surf-svg.png'),     
            require('@images/svg/default.png'),     
        ];

        const promises = images.map((image) => {
            return Asset.fromModule(image).downloadAsync();
        });

        promises.push(new Promise((resolve, reject) => {
            api.auth.init((err) => {
                if (err) {
                    return reject(err)
                }
                async.parallel([
                    (cb) => {
                        api.auth.getApplicationEnvironment((err, ret) => {
                            if (err) {
                                return cb(err)
                            }
                            this.setState({
                                setting: ret
                            })
                            this.setting = ret
                            cb(err)
                        })
                    },
                    (cb) => {
                        api.user.getUserDetail((err, user) => {
                            if (!err) {
                                this.props.authActions.setAuthUser(user)
                            }
                            cb(null)
                        })
                    }
                ], (err) => {
                    if (err) {
                        return reject()
                    }
                    this.props.langActions.setLang(Global.language)
                    this.scenes = Actions.create(
                        <Overlay key="overlay">
                            <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
                                <Lightbox key="lightbox">
                                    <Stack key="root" hideNavBar>
                                        <Scene navBar={NavBar}>
                                            <Tabs
                                                key="TabBar"
                                                // backToInitial
                                                onTabOnPress={() => {
                                                }}
                                                swipeEnabled
                                                tabBarStyle={styles.tabBarStyle}
                                                activeBackgroundColor="white"
                                                showLabel={false}
                                                hideNavBar
                                                inactiveTintColor={Color.lightText}
                                                activeTintColor={Color.primary}
                                                inactiveBackgroundColor="white">

                                                <Scene key="Home" tabBarLabel={T2("Home")}
                                                    icon={(props) => <TabBarIcon name="ios-home" {...props} />} navBar={NavBar}>

                                                    <Scene key="Home" component={Home} title="Home" hideNavBar/>
                                                    {/* <Scene key="SelectLocation" component={SelectLocation} title="Select Destination" hideTabBar /> */}
                                                    <Scene key="SelectDate" component={SelectDate} title="Select Dates" hideTabBar />
                                                    <Scene key="FilterScreen" component={FilterScreen} title="Filter" hideTabBar />
                                                    <Scene key="ThankYou" component={ThankYou} title="Thank You" />
                                                    <Scene key="SelectCommonLocation" component={SelectCommonLocation} title="Select Destination" hideTabBar />
                                                    <Scene key="Booking" component={Booking} title="" />
                                                    
                                                    {/* Hotel */}

                                                    <Scene key="HotelList" component={HotelList} title="Search Result" />
                                                    <Scene key="HotelDetail" component={HotelDetail} title=""  />
                                                    <Scene key="SelectRoom" component={SelectRoom} title="Guest Details" hideTabBar />
                                                    <Scene key="RoomList" component={RoomList} title="" hideTabBar />
                                                    <Scene key="RoomDetail" component={RoomDetail} title="" hideTabBar />

                                                    {/* Activity */}
                                                    <Scene key="SelectPassenger" component={SelectPassenger} title="Passengers" hideTabBar />
                                                    <Scene key="ActivityList" component={ActivityList} title="" />
                                                    <Scene key="ActivityDetail" component={ActivityDetail} title="Details" />

                                                    {/* Cruise */}
                                                    <Scene key="CruiseList" component={CruiseList} title="Cruises" />
                                                    <Scene key="CruiseDetail" component={CruiseDetail} title="Cruises" />
                                                    <Scene key="CruiseRoomList" component={CruiseRoomList} title="Cruises" />
                                                    <Scene key="CruiseRoomDetail" component={CruiseRoomDetail} title="RoomDetail" />

                                                    {/* Transfer */}
                                                    <Scene key="TransferList" component={TransferList} title="" />
                                                    <Scene key="TransferDetail" component={TransferDetail} title="Details" hideTabBar />
                                                    <Scene key="TransferTypeList" component={TransferTypeList} title="Select Type" hideTabBar />

                                                    {/* Train */}
                                                    <Scene key="TrainList" component={TrainList} title=""/>
                                                    <Scene key="TrainDetail" component={TrainDetail} title="Trains"/>

                                                    {/* Bus */}
                                                    <Scene key="BusDetail" component={BusDetail} title="Seat Select" hideTabBar/>
                                                    <Scene key="BusList" component={BusList} title="Buses List"/>
                                                    {/* Car Rental */}
                                                    <Scene key="VehicleList" component={VehicleList} title="" />
                                                    <Scene key="VehicleDetail" component={VehicleDetail} title="Details" hideTabBar />

                                                    {/* Flight */}
                                                    <Scene key="FlightList" component={FlightList} title="" />
                                                    <Scene key="FlightDetail" component={FlightDetail} title="Flight Details" />
                                                    <Scene key="SelectPassenger2" component={SelectPassenger2} title="Passengers" hideTabBar />
                                                    <Scene key="SelectPassenger3" component={SelectPassenger3} title="Passengers" hideTabBar />
                                                </Scene>

                                                <Scene key="Packages" tabBarLabel={T2("Package")}
                                                    icon={(props) => <TabBarIcon name="ios-list" {...props} />} navBar={NavBar}>

                                                    <Scene key="Packages" component={Packages} title="Travel Packages" />
                                                    <Scene key="PackageList" component={PackageList} title="Travel Packages" />
                                                    <Scene key="PackageDetail" component={PackageDetail} />
                                                    <Scene key="PackageBooking" component={PackageBooking} />
                                                    <Scene key="PackageFilter" component={PackageFilter} title="Filter" hideTabBar />
                                                </Scene>

                                                <Scene key="HotDeal" tabBarLabel={T2("Hot Deal")}
                                                    icon={(props) => <TabBarIcon name="ios-heart" {...props} />} navBar={NavBar} >

                                                    <Scene key="HotDeal" component={HotDeal} title="Hot Deals" />
                                                </Scene>

                                                {/*this.setting.isLoginRequired && */<Scene key="MyCartTab" tabBarLabel={T2("My Cart")}
                                                    icon={(props) => <TabBarIcon name="ios-notifications" {...props} />} navBar={NavBar} >

                                                    <Scene key="MyCart" component={MyCart} title="My Cart" />
                                                    <Scene key="CheckOut" component={CheckOut} title="Checkout" />
                                                    <Scene key="PriceDetail" component={PriceDetail} title="Price Details"/>
                                                    <Scene key="HomePrivacy" component={Privacy} title="Privacy and Policy"/>
                                                </Scene>}

                                                {<Scene key="MyProfile" tabBarLabel={T2("My Profile")}
                                                    onExit={()=>{
                                                        this.props.authActions.setNeedBack(false)
                                                    }}
                                                    initial
                                                    onEnter={()=>alert('Enter')}
                                                    icon={(props) => <TabBarIcon name="ios-contact" {...props} />} navBar={NavBar} >
                                                    <Scene key="LoginAndProfile" component={LoginAndProfile} title="Profile" hideNavBar/>
                                                    <Scene key="Register" component={Register} title="Sign Up" />
                                                    <Scene key="ForgotPassword" component={ForgotPassword} title="Forgot Password" />
                                                    <Scene key="ChangePassword" component={ChangePassword} title="Change Password" />
                                                    <Scene key="VerifyNumber" component={VerifyNumber} title="Verify Number" />
                                                    <Scene key="MyBookings" component={MyBookings} title="My Booking" />
                                                    <Scene key="HotelReservationDetail" component={HotelReservationDetail} title="View Reservation" />
                                                    <Scene key="BusReservationDetail" component={BusReservationDetail} title="View Reservation" />
                                                    <Scene key="FlightReservationDetail" component={FlightReservationDetail} title="View Reservation" />
                                                    <Scene key="TransferReservationDetail" component={TransferReservationDetail} title="View Reservation" />
                                                    <Scene key="VehicleReservationDetail" component={VehicleReservationDetail} title="View Reservation" />
                                                    <Scene key="ActivityReservationDetail" component={ActivityReservationDetail} title="View Reservation" />
                                                    <Scene key="PackageReservationDetail" component={PackageReservationDetail} title="View Reservation" />
                                                    <Scene key="Reservation" component={Reservation} title="" hideTabBar />
                                                    <Scene key="CancelFirst" component={CancelFirst} title="Cancel Reservation" />
                                                    <Scene key="CancelSecond" component={CancelSecond} title="Cancel Reservation" />
                                                    <Scene key="ModifyFirst" component={ModifyFirst} title="Modify Reservation" />
                                                    <Scene key="ModifySecond" component={ModifySecond} title="Modify Reservation" />
                                                    <Scene key="ModifyThird" component={ModifyThird} title="Modify Reservation" />
                                                    <Scene key="Modify" component={Modify} title="Modify" hideTabBar />
                                                    <Scene key="SuccessReservation" component={SuccessReservation} />
                                                    <Scene key="MyProfile1" component={MyProfile1} title="My Profile" />
                                                    <Scene key="CoTraveler" component={CoTraveler} title="Co-Travelers" />
                                                    <Scene key="AboutUs" component={AboutUs} title="About Us" />
                                                    <Scene key="AboutApp" component={AboutApp} title="About App" />
                                                    <Scene key="EditProfile" component={EditProfile} title="Edit Profile" />
                                                    <Scene key="EditTraveler" component={EditTraveler} title="Edit Co-Traveler" />
                                                    <Scene key="Notifications" component={Notificatins} title="Notifications" />
                                                    <Scene key="Privacy" component={Privacy} title="Privacy and Policy" />
                                                    <Scene key="LedgerBalance" component={LedgerBalance} title="Account" />
                                                </Scene>}
                                            </Tabs>
                                            <Scene key="Offline" component={() => <General screenType='offline' />} hideNavBar />
                                            <Scene key="Maintenance" component={() => <General screenType='maintenance' />} hideNavBar />
                                            
                                            
                                            
                                        </Scene>
                                    </Stack>
                                </Lightbox>
                                <Scene key="ImageList" component={ImageList} hideNavBar />
                                <Scene key="Loading" component={Loading} hideNavBar />
                                <Scene key="PaymentHandler" component={PaymentHandler} hideNavBar />
                                
                            </Modal>
                        </Overlay>
                    );
                    resolve()
                })
            })
        }))

        return Promise.all(promises)

    }

    render() {
        
        let { isReady, setting, offlineMode } = this.state
        if (!isReady) {
            return !offlineMode?(
                <AppLoading
                    startAsync={this._cacheResourcesAsync}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                />
            ):<General screenType="offline"/>;
        }

        //temporary setting until this flag sets
        setting.isLoginRequired = true
        return this.scenes?(
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{ flex: 1 }}>
                <Router hideNavBar scenes={this.scenes} onStateChange={(props) => { }} />
                <MyToast />
            </KeyboardAvoidingView>
        ):<General screenType="offline"/>;
    }
}

export default connect(
    state => ({
        T1: state.language.T1,
        T2: state.language.T2
    }),
    dispatch => ({
        commonActions: bindActionCreators(commonActions, dispatch),
        authActions: bindActionCreators(authActions, dispatch),
        langActions: bindActionCreators(langActions, dispatch),
    })
)(Root);