import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Switch,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native'

import { Actions } from 'react-native-router-flux';
import RoundButton from '@components/general/roundButton'
import Color from '@common/color'
import HotelBookingInput from '@hotel_room/bookingInput'
import ActivityBookingInput from '@component_activity/bookingInput'
import TransferBookingInput from '@components/home/transfer/bookingInput'
import FlightBookingInput from '@components/home/flight/bookingInput'
import VehicleBookingInput from '@components/home/vehicle/bookingInput'
import PackageBookingInput from '@components/home/packages/bookingInput'
import BusBookingInput from '@components/home/bus/bookingInput'
import TrainBookingInput from '@components/home/train/bookingInput'
import CruiseBookingInput from '@components/home/cruise/bookingInput'

import HotelBookingCard from '@component_cart/hotelBookingCard'
import ActivityBookingCard from '@component_cart/activityBookingCard'
import TransferBookingCard from '@component_cart/transferCard'
import FlightBookingCard from '@component_cart/flightBookingCard'
import VehicleBookingCard from '@component_cart/vehicleCard'
import PackageBookingCard from '@component_cart/packageBookingCard'
import BusBookingCard from '@component_cart/busBookingCard'
import TrainBookingCard from '@component_cart/trainCard'
import CruiseBookingCard from '@component_cart/cruiseBookingCard'
import { TouchItem, DateItem, TimeItem } from '@components/general/bookingInput/inputItems';
import ModalSelector from '@react-native-modal-selector'

import UtilService from '@utils/utils';
import Global from "@utils/global";
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import * as commonAction from '@store/common';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as authAction from '@store/auth';
import * as packagesAction from '@store/packages';

import ContactInput from '@hotel_room/contactInput'

import PolicyModal from '@hotel_room/policyModal'
import PolicyModal2 from '@hotel_room/policyModal2'
import PriceModal from '@hotel_room/priceModal'
import SpecialModal from '@hotel_room/specialModal'
import FloatLabelTextInput from '@components/general/floatingLabelInput';

import _ from 'underscore'
import { parsePhoneNumber, getCountryCallingCode } from 'libphonenumber-js'

const { T1, T2 } = Global.Translate

const LoginTypes = {
    loggedIn: 'LOGGED_IN',
    guest: 'GUEST',
    none: 'NONE'
}

class BookingC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            cards: [
                { title: 'Paradiso Hotel', location: 'lorem lpsum Street, Dolor sit amet 455\nBangkok, Thailand', roomInfo: '1 Room | 2 people', durationInfo: '12 Aug - 14 Aug ( 2 Nights)', price: 43.6, duration: 2 },
                { title: 'Shiration Bangkok Hotel', location: 'lorem lpsum Street, Dolor sit amet 455\nBangkok, Thailand', roomInfo: '1 Room | 2 people', durationInfo: '12 Aug - 14 Aug ( 2 Nights)', price: 43.6, duration: 2 },
            ],
            loginType: LoginTypes.none,
            policyTitle: 'Room Terms & Conditions',
            policyDesc: 'Maecenas non leo pretium, vehicula sem ut commodo massa. Aenea nec hendreit nisl Duis condimentum, augue id convallis consectetur, magna risus tempus nisi, sed vehicula massa magna in purus Suspendisse ultirces, turpis sit amet sollicitudin malesuada, nisi ex luctus odio, vel henderit dolor est eget lacus. Vestibulum dapibus fells itae enim tristique rhoncus. Nulla maximus dui a augue fringrill suscipit Maceenas rutrum lectus non metus posuere luctus. Phasellus sed volutpat ipsum. Quisque viverra dignisssim elit sit amet blandit Ut dapibus imperdiet ligula ac blandit. Morbi feugiat nulla eu mattis dapibus. Sed viverra libero id libero fringlia failistis . Nulla mattis femetum tempus sed at interdum nisi Maecenas ormare commodo dolor at sollicitudin. Sed sit amet autor nibh ed efficitu mi.',
            priceTitle: 'Paradiso Hotel',
            priceList: [
                { title: 'Double Room - Superior / Room Only x 1', price: 43.6 }
            ],
            requires: [],
            contactInfo: {
                gender: 'Male',
                firstName: '',
                lastName: '',
                city: '',
                itineraryName: '',
                email: '',
                primaryContactNumber: '',
                primaryContactPhoneCode: getCountryCallingCode(Global.environment.portalCountry.code),
                homePhone: '',
                homePhoneCode: getCountryCallingCode(Global.environment.portalCountry.code),
                asAboveDetails: false,
            },
            showPriceModal: false,
            priceList: [],
            specialDescription: '',
            loadingPolicy: true,
            supplierQuestions: [],
            showError: false,
            invalidItem1:null,
            invalidItem2:null,
        }
        this.firstLoad = true
        this.specialDescriptions = []
        this.props.actions['cart'].viewCart()
    }

    componentWillMount() {
        this.props.navigation.setParams({
            goBack: this.cancelCart.bind(this),
            title: 'Details'
        });
    }

    cancelCart() {
        // let { result } = this.props.cart
        // if(result && result.cartID) {
        //     var cartID = result.cartID
        //     this.props.actions['cart'].clearCart(cartID)
        // }
        Actions.pop()
    }

    componentWillReceiveProps(props) {
        let { result, status } = props.cart
        let { currentUser = {}, isLoggedIn } = props.auth
        let {supplierQuestions} = this.state
        if (!isLoggedIn) return;
        result = result || {}
        let carts = result.items || []

        if (carts && carts.length > 0 && this.firstLoad) {
            this.firstLoad = false
            var requires = []
            requires = carts.map((cart, cartIndex) => {
                var supplierQuestion = []
                //init supplierQuestion
                if (cart.data.business == 'transfers' && cart.inputs && cart.inputs.availableInputs) {
                    cart.inputs.availableInputs.map(groupItems => {
                        groupItems.item.map(item => {
                            if (item.type == 'DatePicker') {
                                supplierQuestion.push({
                                    key: item.id,
                                    lookup: item.lookup,
                                    value: moment(item.values[0], 'MM/DD/YYYY HH:mm:ss').toDate()
                                })
                            } else if (item.type == 'TimePicker') {
                                supplierQuestion.push({
                                    key: item.id,
                                    lookup: item.lookup,
                                    value: moment(item.values[0] + ':' + item.values[1], 'HH:mm').toDate()
                                })
                            }
                        })
                    })
                }

                supplierQuestions.push(supplierQuestion)
                
                if (cart.data.business == 'hotel') {
                    let isComboMode = cart.data.flags.isComboMode
                    let people = 0, rooms = []
                    if (isComboMode) {
                        rooms = cart.data.items.map((item, index) => {
                            return {
                                roomName: item.item[0].name,
                                maxGuests: UtilService.getRoomPeopleCount(item.paxInfo),
                                gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                                guestFirstName: cartIndex == 0 && index == 0 ? currentUser.firstName : '',
                                guestLastName: cartIndex == 0 && index == 0 ? currentUser.lastName : '',
                                code: item.item[0].code,
                                token: item.item[0].token,
                                editable: index == 0 ? false : true,
                                selSaveAsTraveler: false,
                            }
                        })
                    } else {
                        rooms = cart.data.items[0].item.map((item, index) => {
                            if(!cart.data.items[0].paxInfo) return {}
                            return {
                                roomName: cart.data.items[0].type,
                                maxGuests: UtilService.getRoomPeopleCount([cart.data.items[0].paxInfo[index]]),
                                gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                                guestFirstName: cartIndex == 0 && index == 0 ? currentUser.firstName : '',
                                guestLastName: cartIndex == 0 && index == 0 ? currentUser.lastName : '',
                                code: item.code,
                                token: item.token,
                                selSaveAsTraveler: false,
                                editable: index == 0 ? false : true
                            }
                        })
                    }
                    return {
                        title: cart.data.name,
                        gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                        firstName: cartIndex == 0 ? currentUser.firstName : '',
                        lastName: cartIndex == 0 ? currentUser.lastName : '',
                        birthDate: cartIndex == 0 ? currentUser.birthDate : moment().add(-18, 'years').toDate(),
                        rooms: rooms,
                        asAboveDetails: false,
                        selSaveAsTraveler:false,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'activity') {
                    return {
                        title: cart.data.name,
                        gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                        firstName: cartIndex == 0 ? currentUser.firstName : '',
                        lastName: cartIndex == 0 ? currentUser.lastName : '',
                        birthDate: cartIndex == 0 ? currentUser.birthDate : moment().add(-18, 'years').toDate(),
                        address1: currentUser.location.address || '',
                        rooms: [],
                        country: cartIndex == 0 ? UtilService.getCountryName(currentUser.location.countryID) : '',
                        zipCode: cartIndex == 0 ? currentUser.location.zipCode : '',
                        city: cartIndex == 0 ? currentUser.location.city : '',
                        cellPhone: cartIndex == 0 ? currentUser.contactInformation.phoneNumber : '',
                        cellPhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        homePhone: '',
                        homePhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        asAboveDetails: false,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'package') {
                    return {
                        title: cart.data.name,
                        gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                        firstName: cartIndex == 0 ? currentUser.firstName : '',
                        lastName: cartIndex == 0 ? currentUser.lastName : '',
                        birthDate: cartIndex == 0 ? currentUser.birthDate : moment().add(-18, 'years').toDate(),
                        address1: currentUser.location.address || '',
                        rooms: [],
                        cca2: currentUser.location.countryID,
                        country: cartIndex == 0 ? UtilService.getCountryName(currentUser.location.countryID) : '',
                        zipCode: cartIndex == 0 ? currentUser.location.zipCode : '',
                        city: cartIndex == 0 ? currentUser.location.city : '',
                        cellPhone: cartIndex == 0 ? currentUser.contactInformation.phoneNumber : '',
                        cellPhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        homePhone: '',
                        homePhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        asAboveDetails: false,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'transfers') {
                    travelers = [{
                        isFirst: true,
                        gender: currentUser.genderDesc,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        birthDate: currentUser.birthDate || moment().add(-18, 'years').toDate(),
                        address: currentUser.location.address || '',
                        cca2: currentUser.location.countryID,
                        country: UtilService.getCountryName(currentUser.location.countryID) || '',
                        zipCode: currentUser.location.zipCode || '',
                        city: currentUser.location.city || '',
                        phoneCode: UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) || getCountryCallingCode(Global.environment.portalCountry.code),
                        mobileNumber: currentUser.contactInformation.phoneNumber || '',
                        homePhone: '',
                        homePhoneCode: UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) || getCountryCallingCode(Global.environment.portalCountry.code),
                        // isForeigner: false,
                        asAboveDetails: false,
                        selSaveAsTraveler: false,
                    }]

                    return {
                        travelers,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'bus') {
                    travelers = []
                    let departurePoints = []
                    let dropPoints = []

                    cart.data.stopInfo.map(stop=>{
                        stop.item.map(item=>{
                            if(stop.code == 'departurePoints')
                                departurePoints.push(item)
                            else
                                dropPoints.push(item)
                        })
                    })
                    cart.data.items[0].item.map((item, cartIndex)=>{
                        travelers.push({
                            gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                            firstName: cartIndex == 0 ? currentUser.firstName : '',
                            lastName: cartIndex == 0 ? currentUser.lastName : '',
                            birthDate: cartIndex == 0 ? currentUser.birthDate : null,
                            seat:item.token,
                            seatId:item.id,
                            pickupLocation:departurePoints[0],
                            dropoffLocation:dropPoints[0],
                            anniversaryDate: null,
                            documentType: '',
                            documentNumber: '',
                            rooms:[],
                            expiryDate:null,
                            cellPhone: cartIndex == 0 ? currentUser.contactInformation.phoneNumber : '',
                            cellPhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                            email:cartIndex==0?currentUser.contactInformation.email:'',
                            isForeigner: false,
                            asAboveDetails: false,
                            pickupList:departurePoints,
                            dropoffList:dropPoints,
                            selSaveAsTraveler: false,
                            business: cart.data.business,
                        })
                    })

                    return {
                        travelers,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'air') {
                    let adultsCount = UtilService.getFieldFromList2(cart.data.paxInfo, 'typeString', 'quantity', 'ADT')
                    let childrenCount = UtilService.getFieldFromList2(cart.data.paxInfo, 'typeString', 'quantity', 'CHD')
                    let infantsCount = UtilService.getFieldFromList2(cart.data.paxInfo, 'typeString', 'quantity', 'INF')
                    var tripLocations = UtilService.getFieldFromList2(cart.data.config, 'key', 'value', 'tripLocation').split('-')
                    var tripType = cart.data.tripType
                    var fromLocation = tripLocations[0].trim()
                    var toLocation = tripLocations[1].trim()

                    var travelers = []
                    for (var i = 0; i < adultsCount; i++) {
                        var isFirst = cartIndex == 0 && i == 0
                        travelers.push({
                            isFirst,
                            gender: isFirst ? currentUser.genderDesc : 'Male',
                            firstName: isFirst ? currentUser.firstName : '',
                            lastName: isFirst ? currentUser.lastName : '',
                            birthDate: isFirst ? currentUser.birthDate : moment().add(-18, 'years').toDate(),
                            nationality: isFirst ? UtilService.getCountryName(currentUser.nationalityCode || Global.environment.portalCountry.code) : UtilService.getCountryName(Global.environment.portalCountry.code),
                            documentType: '',
                            documentNumber: '',
                            issuingCountry: isFirst ? UtilService.getCountryName(currentUser.issuingCountryCode || Global.environment.portalCountry.code) : UtilService.getCountryName(Global.environment.portalCountry.code),
                            expiryDate: moment().add(6, 'months').toDate(),
                            travelNumber: '',
                            redress: '',
                            proNumber: '',
                            selSaveAsTraveler: false,
                            asAboveDetails: false,
                            typeString: 'ADT',
                            passengerType: 'Adult',
                        })
                    }
                    for (var i = 0; i < childrenCount; i++) {
                        travelers.push({
                            isFirst: false,
                            gender: 'Male',
                            firstName: '',
                            lastName: '',
                            birthDate: moment().add(-2, 'years').toDate(),
                            nationality: '',
                            documentType: '',
                            documentNumber: '',
                            issuingCountry: '',
                            expiryDate: moment().add(6, 'months').toDate(),
                            selSaveAsTraveler: false,
                            asAboveDetails: false,
                            typeString: 'CHD',
                            passengerType: 'Child',
                        })
                    }
                    for (var i = 0; i < infantsCount; i++) {
                        travelers.push({
                            isFirst: false,
                            gender: 'Male',
                            firstName: '',
                            lastName: '',
                            birthDate: moment().add(0, 'years').toDate(),
                            nationality: '',
                            documentType: '',
                            documentNumber: '',
                            issuingCountry: '',
                            expiryDate: moment().add(6, 'months').toDate(),
                            selSaveAsTraveler: false,
                            asAboveDetails: false,
                            typeString: 'INF',
                            passengerType: 'Infant',
                        })
                    }
                    return {
                        title: tripType == 'Oneway' ? `${fromLocation} - ${toLocation}` : `${fromLocation} - ${toLocation} - ${fromLocation}`,
                        travelers,
                        business: cart.data.business
                    }
                } else if (cart.data.business == 'vehicle') {
                    return {
                        gender: cartIndex == 0 ? currentUser.genderDesc : 'Male',
                        firstName: cartIndex == 0 ? currentUser.firstName : '',
                        lastName: cartIndex == 0 ? currentUser.lastName : '',
                        birthDate: cartIndex == 0 ? currentUser.birthDate : moment().add(-18, 'years').toDate(),
                        address: currentUser.location.address || '',
                        cca2: currentUser.location.countryID,
                        country: cartIndex == 0 ? UtilService.getCountryName(currentUser.location.countryID) : '',
                        zipCode: cartIndex == 0 ? currentUser.location.zipCode : '',
                        city: cartIndex == 0 ? currentUser.location.city : '',
                        cellPhone: cartIndex == 0 ? currentUser.contactInformation.phoneNumber : '',
                        cellPhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        homePhone: '',
                        homePhoneCode: cartIndex == 0 ? UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) : getCountryCallingCode(Global.environment.portalCountry.code),
                        business: cart.data.business,
                        rooms: [],
                        documentType: '',
                        documentNumber: '',
                        anniversaryDate: null,
                        expiryDate: moment().add(6, 'months').toDate(),
                    }
                }
            })

            var contactInfo = {
                gender: currentUser.genderDesc || 'Male',
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                city: currentUser.location.city || '',
                itineraryName: '',
                email: currentUser.contactInformation.email,
                primaryContactNumber: currentUser.contactInformation.phoneNumber,
                primaryContactPhoneCode: UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) || getCountryCallingCode(Global.environment.portalCountry.code),
                homePhone: '',
                homePhoneCode: UtilService.withoutSign(currentUser.contactInformation.phoneNumberCountryCode) || getCountryCallingCode(Global.environment.portalCountry.code),
                asAboveDetails: false,
            }

            this.setState({ requires, contactInfo, supplierQuestions })
        }
    }

    done() {
        Actions.pop()
    }

    removeCart(cart, title) {
        let { result, status } = this.props.cart
        let carts = result.items || []
        let cartCount = carts.length
        let { business } = this.props

        if (business != 'air') {
            Alert.alert(
                '',
                `Are you sure you wish to remove the ${title||cart.data.name}?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions['cart'].removeCart(cart.cartID, cart.token, {
                                key: cart.detailsID,
                                value: cart.data.items[0].id
                            }).then(({ error, result }) => {
                                if (!error) {
                                    if (cartCount == 1) {
                                        //no cart more
                                        //Actions.pop()
                                        if (this.props.business == 'package') {
                                            Actions.popTo('PackageList')
                                        } else {
                                            Actions.popTo('Home')
                                        }
                                    }
                                    this.props.commonAction.showToast('Cart item is removed successfully.')
                                }
                            })
                        }
                    }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                '',
                `Are you sure you wish to remove the '${title}'?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions['cart'].removeCart(cart.cartID, cart.token, {
                                key: cart.detailsID,
                                value: cart.data.token
                            }).then(({ error, result }) => {
                                if (!error) {
                                    if (cartCount == 1) {
                                        //no cart more
                                        //Actions.pop()

                                        Actions.popTo('Home')

                                    }
                                    this.props.commonAction.showToast('Cart item is removed successfully.')
                                }
                            })
                        }
                    }
                ],
                { cancelable: false }
            );
        }

    }

    LoginAndContinue() {
        let needBack = 'Home'
        if ( this.props.business == 'package') needBack = 'Packages'
        this.props.actions.auth.setNeedBack(needBack)
        Actions.jump('LoginAndProfile')
    }

    continue() {
        if(!this.validate()) {
            this.setState({showError:true})
            return
        }

        var { contactInfo, requires, supplierQuestions, invalidItem1, invalidItem2 } = this.state
        if ( invalidItem1 != null || invalidItem2 != null ) return ;
        let { result } = this.props.cart
        let { business } = this.props

        var cartID = result.cartID

        Global.itineraryName = contactInfo.itineraryName

        //console.log('contactInfo, requires', contactInfo, requires)
        try {
            var data = result.items.map((cart, index) => {
                let { business } = cart.data
                var rooms = []
                if (business == 'transfers') {
                    let {travelers} = requires[index]
                    travelers.map(traveler => {
                        rooms.push({
                            "IsMainPax": false,
                            "LocationInfo": {},
                            "Details": {
                                "EntityID": "0",
                                "UserID": "0",
                                "AgentID": "0",
                                "CustomerID": "0",
                                "FirstName": traveler.firstName,
                                "LastName": traveler.lastName,
                                "Location": {
                                    "City": traveler.city
                                },
                                "ContactInformation": {
                                    "Name": traveler.firstName + ' ' + traveler.lastName,
                                    "PhoneNumber": traveler.mobileNumber,
                                    "ActlFormatPhoneNumber": traveler.phoneCode + traveler.mobileNumber,
                                    "Email": traveler.email
                                },
                                "Age": moment().diff(traveler.birthDate, 'years'),
                                "GenderDesc": traveler.gender,
                                "Gender": traveler.gender == 'Male' ? 'M' : 'F',
                                // "ActlGender": "19",
                                "BirthDate": traveler.birthDate,
                                "OpenIDs": {}
                            },
                            "StopInfo": [], //cart.data.stopInfo,
                            "BookingDetails": {
                            },
                            "Age": moment().diff(traveler.birthDate, 'years'),
                            "Addons": [],
                            typeString: 'ADT',
                            "RateInfo": [],
                            "DisplayRateInfo": [],
                            "BreakDownRateInfo": [],
                            "PaymentGatewayChargeDetails": [],
                            flags: {
                                saveAsCoTraveler: traveler.selSaveAsTraveler ? true : false
                            },
                        })
                    })

                    rooms[0].IsMainPax = true
                } else if (business == 'vehicle') {
                    rooms.push({
                        "IsMainPax": true,
                        "LocationInfo": {
                            "FromLocation": {
                                "Address": requires[index].address
                            },
                            "ToLocation": null,
                        },
                        "Description": this.specialDescriptions[cart.id] || '',
                        "Details": {
                            "FirstName": requires[index].firstName,
                            "LastName": requires[index].lastName,
                            "Location": {
                                "City": requires[index].city,
                            },
                            "ContactInformation": {
                                "Name": requires[index].firstName + ' ' + requires[index].lastName,
                                "PhoneNumber": requires[index].cellPhone,
                                "HomePhoneNumber": requires[index].homePhone,
                                "PhoneNumberCountryCode": UtilService.withoutSign(requires[index].cellPhoneCode),
                                "HomePhoneNumberCountryCode": UtilService.withoutSign(requires[index].homePhoneCode)
                            },
                            "GenderDesc": requires[index].gender,
                            "Gender": requires[index].gender == 'Male' ? 'M' : 'F',
                            //"ActlGender": "19",
                            "BirthDate": requires[index].birthDate,
                            "OpenIDs": {},
                            "AnniversaryDate": requires[index].anniversaryDate,
                            "PassportExpirationDate": requires[index].expiryDate,
                        },
                        "Documents": [{
                            "Type": requires[index].documentType,
                            "Id": requires[index].documentNumber,
                            "DateInfo": {
                                "EndDate": requires[index].expiryDate,
                            },
                        }],
                        flags: {
                            saveAsCoTraveler: requires[index].selSaveAsTraveler ? true : false
                        },
                        "Age": moment().diff(requires[index].birthDate, 'years'),
                        // "Addons": [],
                        typeString: 'ADT'
                    })
                } else if (business == 'air') {
                    let {travelers} = requires[index]
                    travelers.map((traveler) => {
                        rooms.push({
                            "IsMainPax": false,
                            "LocationInfo": {},
                            "Details": {
                                "FirstName": traveler.firstName,
                                "LastName": traveler.lastName,
                                "ContactInformation": {
                                    "Name": traveler.firstName + ' ' + traveler.lastName
                                },
                                "GenderDesc": traveler.gender,
                                "Gender": traveler.gender == 'Male' ? 'M' : 'F',
                                "NationalityCode": traveler.nationality,
                                "BirthDate": traveler.birthDate,
                                "OpenIDs": {}
                            },
                            "BookingDetails": {
                                // "IsBoardingPassValid": true,
                                // "BusinessObjectItemCode": cart.data.items[index].item[0].code,
                                // "BusinessObjectItemID": cart.data.items[index].item[0].token,
                            },
                            "Documents": [
                                {
                                    "type": traveler.documentType,
                                    "Id": traveler.documentNumber,
                                    "DateInfo": {
                                        "EndDate": traveler.expiryDate
                                    }
                                }
                            ],
                            "Age": moment().diff(traveler.birthDate, 'years'),
                            "Addons": [],
                            typeString: traveler.typeString,
                            flags: {
                                saveAsCoTraveler: traveler.selSaveAsTraveler ? true : false
                            },
                        })
                    })

                    rooms[0].IsMainPax = true
                } else if (business == 'bus') {
                    let {travelers} = requires[index]

                    travelers.map((traveler) => {
                        rooms.push({
                            "IsMainPax": false,
                            "LocationInfo": {
                                fromLocation:traveler.pickupLocation,
                                toLocation:traveler.dropoffLocation,
                            },
                            "Details": {
                                "FirstName": traveler.firstName,
                                "LastName": traveler.lastName,
                                "ContactInformation": {
                                    "phoneNumberCountryCode":traveler.cellPhoneCode,
                                    "phoneNumber":traveler.cellPhone,
                                    "email":traveler.email,
                                    "Name": traveler.firstName + ' ' + traveler.lastName
                                },
                                "GenderDesc": traveler.gender,
                                "Gender": traveler.gender == 'Male' ? 'M' : 'F',
                                "NationalityCode": traveler.nationality,
                                "BirthDate": traveler.birthDate,
                                "AnniversaryDate": traveler.anniversaryDate,
                                "OpenIDs": {}
                            },
                            "BookingDetails": {
                                // "IsBoardingPassValid": true,
                                "BusinessObjectItemCode": traveler.seat,
                                "BusinessObjectItemID": traveler.seatId,
                            },
                            "Documents": [
                                {
                                    "type": traveler.documentType,
                                    "Id": traveler.documentNumber,
                                    "DateInfo": {
                                        "EndDate": traveler.expiryDate
                                    }
                                }
                            ],
                            "Age": moment().diff(traveler.birthDate, 'years'),
                            "Addons": [],
                            // typeString: traveler.typeString,
                            flags: {
                                saveAsCoTraveler: traveler.selSaveAsTraveler ? true : false
                            },
                        })
                    })

                    rooms[0].IsMainPax = true
                } else if (business == 'hotel') {
                    rooms.push({
                        "IsMainPax": true,
                        "LocationInfo": {},
                        "Description": this.specialDescriptions[cart.id] || '',
                        "Details": {
                            "FirstName": requires[index].firstName,
                            "LastName": requires[index].lastName,
                            "Location": {
                                "City": requires[index].city,
                                "Address": requires[index].address||requires[index].address1,
                                "CountryID": requires[index].cca2,
                                "ZipCode":requires[index].zipCode,
                            },
                            "ContactInformation": {
                                "Name": requires[index].firstName + ' ' + requires[index].lastName,
                                "PhoneNumber": requires[index].cellPhone,
                                "HomePhoneNumber": requires[index].homePhone,
                                "PhoneNumberCountryCode": UtilService.withoutSign(requires[index].cellPhoneCode),
                                "HomePhoneNumberCountryCode": UtilService.withoutSign(requires[index].homePhoneCode)
                            },
                            "GenderDesc": requires[index].gender,
                            "Gender": requires[index].gender == 'Male' ? 'M' : 'F',
                            //"ActlGender": "19",
                            "BirthDate": requires[index].birthDate,
                            "OpenIDs": {}
                        },
                        "BookingDetails": {
                            "IsBoardingPassValid": true,
                            "BusinessObjectItemCode": cart.data.items[0].item[0].code,
                            "BusinessObjectItemID": cart.data.items[0].item[0].token,
                        },
                        flags: {
                            saveAsCoTraveler: requires[index].rooms[0].selSaveAsTraveler ? true : false
                        },
                        "Age": moment().diff(requires[index].birthDate, 'years'),
                        // "Addons": [],
                        typeString: 'ADT'
                    })
                    if (requires[index].rooms && requires[index].rooms.length > 1) {
                        for (var idx = 1; idx < requires[index].rooms.length; idx++) {
                            rooms.push({
                                "IsMainPax": false,
                                "LocationInfo": {},
                                "Details": {
                                    "FirstName": requires[index].rooms[idx].guestFirstName,
                                    "LastName": requires[index].rooms[idx].guestLastName,
                                    "GenderDesc": requires[index].rooms[idx].gender,
                                    "Gender": requires[index].rooms[idx].gender == 'Male' ? 'M' : 'F',
                                    // "BirthDate": requires[index].birthDate,
                                    // "OpenIDs": {}
                                    "ContactInformation": {
                                        "Name": requires[index].rooms[idx].guestFirstName + ' ' + requires[index].rooms[idx].guestLastName
                                    },
                                },
                                "BookingDetails": {
                                    "IsBoardingPassValid": true,
                                    "BusinessObjectItemCode": requires[index].rooms[idx].code,
                                    "BusinessObjectItemID": requires[index].rooms[idx].token,
                                },
                                flags: {
                                    saveAsCoTraveler: requires[index].rooms[idx].selSaveAsTraveler ? true : false
                                },
                                // "Age": moment().diff(requires[index].birthDate, 'years'),
                                "TypeString": 'ADT'
                            })
                        }
                    }
                } else {
                    rooms.push({
                        "IsMainPax": true,
                        "LocationInfo": {},
                        "Description": this.specialDescriptions[cart.id] || '',
                        "Details": {
                            "FirstName": requires[index].firstName,
                            "LastName": requires[index].lastName,
                            "Location": {
                                "City": requires[index].city,
                                "Address": requires[index].address||requires[index].address1,
                                "CountryID": requires[index].cca2,
                                "ZipCode":requires[index].zipCode,
                            },
                            "ContactInformation": {
                                "Name": requires[index].firstName + ' ' + requires[index].lastName,
                                "PhoneNumber": requires[index].cellPhone,
                                "HomePhoneNumber": requires[index].homePhone,
                                "PhoneNumberCountryCode": UtilService.withoutSign(requires[index].cellPhoneCode),
                                "HomePhoneNumberCountryCode": UtilService.withoutSign(requires[index].homePhoneCode)
                            },
                            "GenderDesc": requires[index].gender,
                            "Gender": requires[index].gender == 'Male' ? 'M' : 'F',
                            //"ActlGender": "19",
                            "BirthDate": requires[index].birthDate,
                            "OpenIDs": {}
                        },
                        "BookingDetails": {
                            "IsBoardingPassValid": true,
                            "BusinessObjectItemCode": cart.data.items[0].item[0].code,
                            "BusinessObjectItemID": cart.data.items[0].item[0].token,
                        },
                        flags: {
                            saveAsCoTraveler: requires[index].selSaveAsTraveler ? true : false
                        },
                        "Age": moment().diff(requires[index].birthDate, 'years'),
                        // "Addons": [],
                        typeString: 'ADT'
                    })
                    if (requires[index].rooms && requires[index].rooms.length > 1) {
                        for (var idx = 1; idx < requires[index].rooms.length; idx++) {
                            rooms.push({
                                "IsMainPax": false,
                                "LocationInfo": {},
                                "Details": {
                                    "FirstName": requires[index].rooms[idx].guestFirstName,
                                    "LastName": requires[index].rooms[idx].guestLastName,
                                    "GenderDesc": requires[index].rooms[idx].gender,
                                    "Gender": requires[index].rooms[idx].gender == 'Male' ? 'M' : 'F',
                                    // "BirthDate": requires[index].birthDate,
                                    // "OpenIDs": {}
                                    "ContactInformation": {
                                        "Name": requires[index].rooms[idx].guestFirstName + ' ' + requires[index].rooms[idx].guestLastName
                                    },
                                },
                                "BookingDetails": {
                                    "IsBoardingPassValid": true,
                                    "BusinessObjectItemCode": requires[index].rooms[idx].code,
                                    "BusinessObjectItemID": requires[index].rooms[idx].token,
                                },
                                // "Age": moment().diff(requires[index].birthDate, 'years'),
                                "TypeString": 'ADT'
                            })
                        }
                    }
                }

                return {
                    "Code": cart.cartItemID,
                    "Type": cart.cartItemID,
                    "Item": rooms,
                    "Config": []
                }
            })

            var requestData = {
                "ContactDetails": {
                    "LoginName": contactInfo.firstName + ' ' + contactInfo.lastName,
                    "FirstName": contactInfo.firstName,
                    "LastName": contactInfo.lastName,
                    "Location": {
                        "City": contactInfo.city
                    },
                    "ContactInformation": {
                        "PhoneNumber": contactInfo.primaryContactNumber,
                        "PhoneNumberCountryCode": '+' + contactInfo.primaryContactPhoneCode,
                        "Email": contactInfo.email
                    },
                    "Gender": contactInfo.gender == 'Male' ? 'M' : 'F'
                },
                "Request": {
                    "CartID": result.cartID,
                    "Token": Global.searchToken[business],
                    "Data": data
                }
            }

            console.log('addTravellers requestData', JSON.stringify(requestData))
            //return;
            this.props.actions['cart'].addTravellers(requestData)
                .then(({ error, result }) => {
                    if (!error) {
                        console.log('addTravellers response', JSON.stringify(result), JSON.stringify(this.state.supplierQuestions))
                        var data = []
                        this.state.supplierQuestions.map((supplierQuestions)=>{
                            supplierQuestions.map((item) => {   
                                var key = item.key
                                var value = item.value
                                if (item.lookup == 'TIME') {
                                    value = moment(item.value).format('HH,mm')
                                } else if (item.lookup == 'DATETIME') {
                                    value = moment(item.value).format('MM/DD/YYYY 00:00:00')
                                } else if (item.lookup == 'AIRLINE' || item.lookup == 'FROMADDRESS') {
                                    value = item.value.key
                                }
                                data.push({
                                    key,
                                    value: [value]
                                })
                            })
                        })

                        if(data.length > 0) {
                            console.log('request for addInputes', JSON.stringify({
                                "Request": {
                                    "CartID": cartID,
                                    "Data": data
                                },
                                "Flags": {}
                            }))
                            //call addInputs
                            this.props.actions['cart'].addInputs({
                                "Request": {
                                    "CartID": cartID,
                                    "Data": data
                                },
                                "Flags": {}
                            }).then(({ error, result }) => {
                                if (!error) {
                                    console.log('response', JSON.stringify(result))
                                    Actions.CheckOut({ from: this.props.business })
                                }
                            })
                        } else {
                            Actions.CheckOut({ from: this.props.business })
                        }
                    }
                })
        } catch (e) {
            console.log("error", e)
            return
        }
    }

    renderTravellers(require, index, coTravelers) {
        var { requires, showError, supplierQuestions } = this.state
        var { result } = this.props.cart
        var carts = result.items
        var BookingInput = HotelBookingInput
        if (require.business == 'activity') {
            BookingInput = ActivityBookingInput
        } else if (require.business == 'package') {
            BookingInput = PackageBookingInput
        } else if (require.business == 'transfers') {
            BookingInput = TransferBookingInput
        } else if (require.business == 'air') {
            BookingInput = FlightBookingInput
        } else if (require.business == 'vehicle') {
            BookingInput = VehicleBookingInput
        } else if (require.business == 'bus'){
            BookingInput = BusBookingInput
        } else if (this.props.business == 'train'){
            BookingInput = TrainBookingInput
            require={travelers:[{}]}
        } else if (this.props.business == 'cruise'){
            BookingInput = CruiseBookingInput
            require={travelers:[{}]}
        }
        return (
            <View>
                <BookingInput
                ref={e => this.bookingInput = e}
                key={index}
                index={index}
                value={require}
                coTravelers={coTravelers}
                showError={showError}
                onChange={(require, invalidItem) => {
                    requires[index] = require
                    this.setState({ requires: [...this.state.requires] , invalidItem1:invalidItem})
                }}
                onChangeAsAboveDetails={(subIndex) => {
                    //copy content from before
                    requires.needUpdate = true
                    if (require.business == 'air') {
                        var srcData = {}

                        if (subIndex == 0) {
                            srcData = requires[index - 1].travelers[requires[index - 1].travelers.length - 1]
                        } else {
                            srcData = require.travelers[subIndex - 1]
                        }

                        let { firstName, lastName, gender, birthDate, nationality, documentType, documentNumber, issuingCountry, expiryDate } = srcData
                        require.travelers[subIndex] = { ...require.travelers[subIndex], firstName, lastName, gender, birthDate, nationality, documentType, documentNumber, issuingCountry, expiryDate }
                        this.setState({ requires: [...this.state.requires] })
                    } else {
                        if (index > 0) {
                            require.firstName = requires[index - 1].firstName
                            require.lastName = requires[index - 1].lastName
                            require.gender = requires[index - 1].gender
                            require.birthDate = requires[index - 1].birthDate
                            this.setState({ requires: [...this.state.requires] })
                        }
                    }
                }}
            />
                {require.business=='transfers' && this.renderSupplierQuestions(carts[index].inputs, supplierQuestions[index])}
            </View>
        )
    }

    renderContact(contactInfo) {
        var { requires, contactInfo, showError } = this.state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        var { business, language } = this.props
        return (
            <ContactInput
                language={language}
                value={contactInfo}
                showError={showError}
                onChange={(contactInfo, invalidItem) => {
                    this.setState({ contactInfo: { ...contactInfo }, invalidItem2:invalidItem })
                }}
                onChangeAsAboveDetails={() => {
                    if (business == 'transfers') {
                        var last = requires[0].travelers[requires[0].travelers.length - 1]
                        contactInfo.firstName = last.firstName
                        contactInfo.lastName = last.lastName
                        contactInfo.gender = last.gender
                        contactInfo.birthDate = last.birthDate
                        contactInfo.email = last.email
                        contactInfo.primaryContactNumber = last.mobileNumber
                        contactInfo.primaryContactPhoneCode = last.phoneCode
                    } else if (business == 'air') {
                        var last = requires[requires.length - 1].travelers[requires[requires.length - 1].travelers.length - 1]
                        contactInfo.firstName = last.firstName
                        contactInfo.lastName = last.lastName
                        contactInfo.gender = last.gender
                        contactInfo.birthDate = last.birthDate
                    } else {
                        var last = requires[requires.length - 1]
                        contactInfo.firstName = last.firstName
                        contactInfo.lastName = last.lastName
                        contactInfo.gender = last.gender
                        contactInfo.birthDate = last.birthDate

                        if (business == 'activity' || business == 'vehicle' || business == 'package') {
                            contactInfo.city = last.city
                            contactInfo.primaryContactNumber = last.cellPhone
                            contactInfo.primaryContactPhoneCode = last.cellPhoneCode
                            contactInfo.homePhone = last.homePhone
                            contactInfo.homePhoneCode = last.homePhoneCode
                        }
                    }
                    this.setState({ contactInfo: { ...contactInfo } })
                }}
            />
        )
    }

    validate() {
        let { requires, contactInfo } = this.state

        console.log('validation', requires, contactInfo)
        for (var i = 0; i < requires.length; i++) {
            var business = requires[i].business
            if (business == 'transfers') {
                var travelers = requires[i].travelers || []
                for (var t = 0; t < travelers.length; t++) {
                    var traveller = travelers[t]
                    if (!traveller.firstName || !traveller.lastName || !traveller.birthDate)
                        return false

                    if (traveller.firstName.length < 2 || traveller.lastName.length < 2)
                        return false

                    if (!traveller.mobileNumber || !traveller.phoneCode || !traveller.homePhone || !traveller.homePhoneCode)
                        return false

                }
            } else if (business == 'air') {
                var travelers = requires[i].travelers || []
                for (var t = 0; t < travelers.length; t++) {
                    var traveller = travelers[t]
                    if (!traveller.firstName || !traveller.lastName || !traveller.birthDate || !traveller.nationality || !traveller.documentType || !traveller.documentNumber || !traveller.issuingCountry || !traveller.expiryDate)
                        return false

                    if (traveller.firstName.length < 2 || traveller.lastName.length < 2)
                        return false
                }
            } else if (business == 'bus') {
                var travelers = requires[i].travelers || []
                for (var t = 0; t < travelers.length; t++) {
                    var traveller = travelers[t]
                    if (!traveller.firstName || !traveller.lastName || !traveller.birthDate || !traveller.documentType || !traveller.documentNumber || !traveller.expiryDate ||!traveller.email || !traveller.cellPhone )
                        return false

                    if (traveller.firstName.length < 2 || traveller.lastName.length < 2)
                        return false
                }
            } else {
                if (!requires[i].firstName || !requires[i].lastName || !requires[i].birthDate)
                    return false

                if (requires[i].firstName.length < 2 || requires[i].lastName.length < 2)
                    return false

                if (business == 'activity' || business == 'package') {
                    if (!requires[i].cellPhone || !requires[i].cellPhoneCode || !requires[i].homePhone || !requires[i].homePhoneCode)
                        return false
                }

                if (requires[i].rooms) {
                    for (var room of requires[i].rooms) {
                        if (!room.guestFirstName || !room.guestLastName)
                            return false
                    }
                }
            }
        }

        if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.city || !contactInfo.itineraryName || !contactInfo.email || !contactInfo.primaryContactNumber) {
            return false
        }

        if (contactInfo.firstName.length < 2 || contactInfo.lastName.length < 2)
            return false

        if (!UtilService.validateEmail(contactInfo.email))
            return false

        return true
    }

    getTypeName(type) {
        if (type == '0') return 'Adult'
        if (type == '1') return 'Child'

        return 'Infant'
    }

    renderRadio(item, INDEX, supplierQuestions) {
        let exist = supplierQuestions.find((o) => o.key == item.id)
        let options = item.listItems.map(o => {
            return {
                key: o.key,
                label: o.value
            }
        })
        return (
            <View key={INDEX}>
                <ModalSelector
                    data={options}
                    initValue={item.defaultValue}
                    onChange={(option) => {
                        console.log('option', option)
                        if (exist) {
                            exist.value = option
                        } else {
                            supplierQuestions.push({
                                key: item.id,
                                lookup: item.lookup,
                                value: option,
                            })
                        }
                        this.setState({
                            supplierQuestions:this.state.supplierQuestions
                        })
                        this.forceUpdate()
                    }} >
                    <TouchItem isMandatory title={item.mlLabel} value={exist ? exist.value.label : ''} />
                </ModalSelector>
            </View>
        )
    }
    normalizeLabel(label) {
        if (label.startsWith('pickup')) {
            return 'Pickup Hotel Details'
        } else if (label.startsWith('dropoff')) {
            return 'Dropoff Hotel Details'
        }

        return label
    }
    renderInput(item, index, supplierQuestions) {
        let exist = supplierQuestions.find((o) => o.key == item.id)
        let value = exist ? exist.value : ''
        return (
            <FloatLabelTextInput
                key={index}
                isError={!value}
                placeholder={item.mlLabel}
                placeholderTextColor={Color.lightText}
                style={styles.input}
                value={value}
                onChangeText={(val) => {
                    if (exist) {
                        exist.value = val
                    } else {
                        supplierQuestions.push({
                            key: item.id,
                            lookup: item.lookup,
                            value: val
                        })
                    }

                    this.setState({ supplierQuestions:this.state.supplierQuestions })
                    this.forceUpdate()
                }}
            />
        )
    }
    renderDatePicker(item, index, supplierQuestions) {
        let exist = supplierQuestions.find((o) => o.key == item.id)

        return (
            <DateItem key={index} title={item.mlLabel} value={exist ? exist.value : ''}
                isMandatory
                onChange={(date) => {
                    if (exist) {
                        exist.value = date
                    } else {
                        supplierQuestions.push({
                            key: item.id,
                            lookup: item.lookup,
                            value: date
                        })
                    }

                    this.setState({ supplierQuestions: this.state.supplierQuestions })
                    this.forceUpdate()
                }}
            />
        )
    }
    renderTimePicker(item, index, supplierQuestions) {
        let exist = supplierQuestions.find((o) => o.key == item.id)

        return (
            <TimeItem key={index} title={item.mlLabel} value={exist ? exist.value : ''}
                isMandatory
                onChange={(time) => {
                    if (exist) {
                        exist.value = time
                    } else {
                        supplierQuestions.push({
                            key: item.id,
                            lookup: item.lookup,
                            value: time
                        })
                    }

                    this.setState({ supplierQuestions: this.state.supplierQuestions })
                    this.forceUpdate()
                }}
            />
        )
    }
    renderSupplierQuestions(inputs, supplierQuestions) {
        let { availableInputs = [] } = inputs;
        console.log('availableInputs', JSON.stringify(availableInputs), supplierQuestions)
        return availableInputs.map((items, index) => {
            return (
                <View style={styles.paddingHorizontal} key={'itemGroup' + index}>
                    <Text style={styles.subTitleText}>{this.normalizeLabel(items.code)}</Text>
                    {
                        items.item.map((item, subIndex) => {
                            switch (item.type) {
                                case 'Combo':
                                    return this.renderRadio(item, `${index}-${subIndex}`, supplierQuestions)
                                case 'Textbox':
                                    return this.renderInput(item, `${index}-${subIndex}`, supplierQuestions)
                                case 'DatePicker':
                                    return this.renderDatePicker(item, `${index}-${subIndex}`, supplierQuestions)
                                case 'TimePicker':
                                    return this.renderTimePicker(item, `${index}-${subIndex}`, supplierQuestions)
                            }
                        })
                    }
                </View>
            )
        })
    }

    render() {
        let { requires, contactInfo, priceList } = this.state
        let { result, status, coTravelers } = this.props.cart
        let { currentUser, isLoggedIn } = this.props.auth
        let { business, language:{T1, T2} } = this.props
        result = result || {}
        let carts = result.items || []
        coTravelers = coTravelers || []
        //console.log('carts', carts.length)
        if ( this.props.business=='train'){
            carts = [{trainNo:'09003', price:'USD 109', trainName:'BDTS NZM NAJ SPL', 
            departFrom:'BANDRA TERMINUS (BDTS) Depart: 06 Sep 2018 At 16:05', 
            goingTo:'H NIZAMUDDIN(NZN) arrives: 07 Sep 2018 At 06:00', data:{business:'train', policies:[], items:[]}}]
            requires=[{}]
        }
        if (this.props.business=='cruise'){
            carts=[{
                data:{business:'cruise', policies:[], items:[]}
            }]
            requires=[{}]
        }
        return (
            <View style={styles.container}>
                {status == 'LOADING' && <ActivityIndicator size="large" color={Color.primary} style={{ flex: 1 }} />}
                {status != 'LOADING' && <ScrollView>

                    <View style={styles.padding}>
                        {carts.map((cart, index) => {
                            var BookingCard = HotelBookingCard
                            if (cart.data.business == 'activity') {
                                BookingCard = ActivityBookingCard
                            } else if (cart.data.business == 'package') {
                                BookingCard = PackageBookingCard
                            } else if (cart.data.business == 'transfers') {
                                BookingCard = TransferBookingCard
                            } else if (cart.data.business == 'air') {
                                BookingCard = FlightBookingCard
                            } else if (cart.data.business == 'vehicle') {
                                BookingCard = VehicleBookingCard
                            }else if (cart.data.business == 'bus'){
                                BookingCard = BusBookingCard
                            }else if (cart.data.business == 'train'){
                                BookingCard = TrainBookingCard
                            }else if (cart.data.business == 'cruise'){
                                BookingCard = CruiseBookingCard
                            }
                            var description = cart.data.policies.map(o => UtilService.decodeHtmlEntity(o.description))
                            cart.data.items.map(o => {
                                o.item.map(item => {
                                    description = description.concat(item.policies.map(o => UtilService.decodeHtmlEntity(o.description)))
                                })
                            })
                            description = _.uniq(description)
                            let inputs = cart.inputs || {}

                            return (
                                <BookingCard
                                    key={index}
                                    cart={cart}
                                    hasPolicy={description.length != 0}
                                    onPriceInfo={(title) => {
                                        var priceList = []
                                        if (business == 'air') {
                                            for (var items of cart.fareBreakup) {
                                                priceList.push({
                                                    title: items.type != '10' ? UtilService.getChargeType(items.type) : 'Total',
                                                    amount: items.type != '10' ? ' ' : items.item[0].displayTotalAmount
                                                })

                                                if (items.type != '10') {
                                                    for (var item of items.item) {
                                                        priceList.push({
                                                            title: `${item.quantity} ${this.getTypeName(item.type)} (x ${item.displayRateInfo[0].displayAmount})`,
                                                            amount: item.displayTotalAmount
                                                        })
                                                    }
                                                }
                                            }
                                        } else if (business == 'transfers' || business == 'activity' || business == 'package' || business == 'vehicle') {
                                            var totalItem = cart.fareBreakup[0].item[0]
                                            priceList = totalItem.displayRateInfo.map((o) => {
                                                return {
                                                    title: UtilService.getChargeType(o.purpose),
                                                    amount: o.displayAmount
                                                }
                                            })
                                            priceList.push({
                                                title: "Total",
                                                amount: totalItem.displayTotalAmount
                                            })
                                        } else if (business == 'bus') {
                                            var totalItem = cart.fareBreakup[0].item.find(o=>o.type == 'bus')
                                            priceList = totalItem.displayRateInfo.map((o) => {
                                                return {
                                                    title: UtilService.getChargeType(o.purpose),
                                                    amount: o.displayAmount
                                                }
                                            })
                                            priceList.push({
                                                title: "Total",
                                                amount: totalItem.displayTotalAmount
                                            })
                                            title = cart.data.locationInfo.fromLocation.name + ' - ' + cart.data.locationInfo.toLocation.name
                                        } else {
                                            priceList = cart.fareBreakup.map((o) => {
                                                var title = "Total"

                                                if (o.item[0].type) {
                                                    title = o.item[0].type + ' x ' + o.item[0].quantity
                                                }
                                                return {
                                                    title: title,
                                                    amount: o.item[0].displayTotalAmount
                                                }
                                            })
                                        }
                                        console.log('priceList', priceList)
                                        this.setState({ priceList })
                                        this.setState({ priceTitle: (title || cart.data.name) })
                                        this.priceModal.open()
                                    }}
                                    onSpecial={() => {
                                        var specialDescription = this.specialDescriptions[cart.id] || ''
                                        this.currentCart = cart
                                        this.setState({ specialDescription })
                                        this.specialModal.open()
                                    }}
                                    onRemove={(title) => this.removeCart(cart, title)}
                                    onPolicy={() => {
                                        var data = {
                                            key: cart.data.id,
                                            value: '',
                                        }

                                        var policyTitle = 'Room Terms & Conditions'
                                        if (cart.data.business == 'activity') {
                                            policyTitle = 'Terms & Conditions'
                                            data.value = cart.data.items[0].item[0].id
                                        } else if (cart.data.business == 'package') {
                                            policyTitle = 'Terms & Conditions'
                                            data.value = cart.data.items[0].item[0].id
                                        } else if (cart.data.business == 'transfers') {
                                            policyTitle = 'Cancellation Policy'
                                            data.value = cart.data.items[0].item[0].id
                                        } else if (cart.data.business == 'bus') {
                                            policyTitle = 'Cancellation Policy'
                                            data.value = cart.data.items[0].item[0].id
                                        } else {
                                            policyTitle = 'Terms & Conditions'
                                            data.value = cart.data.items[0].id
                                        }

                                        this.setState({
                                            loadingPolicy: true,
                                            policyTitle,
                                            policyDesc: "",
                                            policies: []
                                        })
                                        this.policyModal.open()

                                        if(business == 'bus') {
                                            var policies = cart.data.policies
                                            this.setState({
                                                policyDesc: policies.map(o=>o.description).join('\n\r'),
                                                loadingPolicy: false
                                            })
                                            return
                                        }
                                        this.props.actions[business].getPolicy(Global.searchToken[business], data).then(({ error, result }) => {
                                            console.log('get policy', error, result)
                                            if (error) {
                                                console.log(error)
                                                return
                                            }

                                            if (business == 'hotel' || business == 'transfers') {
                                                var description = (result && result.policies) ? result.policies.map(o => UtilService.decodeHtmlEntity(o.description)).join('\n') : ''
                                                this.setState({
                                                    policyDesc: description || 'No Policy Found',
                                                    loadingPolicy: false
                                                })
                                            } else {
                                                var policies = (result && result.policies) ? result.policies : []
                                                this.setState({
                                                    policies: policies.length > 0 ? policies : [],
                                                    loadingPolicy: false
                                                })

                                                console.log(this.state.policies)
                                            }
                                            //this.forceUpdate()
                                        })
                                    }}
                                />

                            )
                        }
                        )}
                    </View>
                    {isLoggedIn && requires.map((require, index) => this.renderTravellers(require, index, coTravelers))}
                    {isLoggedIn && this.renderContact(contactInfo)}
                </ScrollView>}
                {!isLoggedIn && <View style={styles.bottomContainer}>
                    <View style={styles.buttonContainer}>
                        <RoundButton
                            title={T2('login & continue').toUpperCase()}
                            onPress={() => this.LoginAndContinue()}
                            textStyle={styles.buttonBigText}
                        />
                    </View>
                    {/* <View style={styles.ORContainer}>
                        <Text style={styles.ORText}>OR</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <RoundButton
                            title={'CONTINUE\nAS GUEST'}
                            onPress={() => { }}
                            style={{ backgroundColor: Color.primary }}
                            textStyle={styles.buttonText}
                        />
                    </View> */}
                </View>}
                {isLoggedIn && <View style={styles.bottomContainer}>
                    <View style={styles.buttonContainer}>
                        <RoundButton
                            // disabled={!this.validate()}
                            // disabledUI={!this.validate()}
                            title={T1('continue').toUpperCase()}
                            onPress={() => this.continue()}
                            textStyle={styles.buttonBigText}
                        />
                    </View>
                </View>}

                {(business == 'hotel' || business == 'transfers'|| business == 'bus') && <PolicyModal
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    description={this.state.policyDesc}
                    closeModal={() => this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />}
                {business != 'hotel' && business != 'transfers' && business != 'bus' && <PolicyModal2
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    policies={this.state.policies}
                    closeModal={() => this.policyModal.close()}
                    isLoading={this.state.loadingPolicy}
                />}
                <PriceModal
                    onRef={e => this.priceModal = e}
                    title={this.state.priceTitle}
                    items={priceList}
                    total={this.state.totalPrice}
                />
                <SpecialModal
                    onRef={e => this.specialModal = e}
                    title={'Special Request'}
                    description={this.state.specialDescription}
                    onDone={(specialDescription) => {
                        console.log('specialDescription', specialDescription)
                        this.specialDescriptions[this.currentCart.id] = specialDescription
                        this.specialModal.close()
                    }}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ cart, auth, language }) => ({ cart, auth, language });

const mapDispatchToProps = (dispatch) => ({
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
    actions: {
        hotel: bindActionCreators({ ...hotelAction }, dispatch),
        activity: bindActionCreators({ ...activityAction }, dispatch),
        vehicle: bindActionCreators({ ...vehicleAction }, dispatch),
        transfers: bindActionCreators({ ...transferAction }, dispatch),
        air: bindActionCreators({ ...airAction }, dispatch),
        bus: bindActionCreators({ ...busAction }, dispatch),
        package: bindActionCreators({ ...packagesAction }, dispatch),
        cart: bindActionCreators({ ...cartAction }, dispatch),
        auth: bindActionCreators({ ...authAction }, dispatch)
    }
});

export default Booking = connect(mapStateToProps, mapDispatchToProps)(BookingC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    ORContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc'
    },
    ORText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold'
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 10
    },
    buttonBigText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },
    padding: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    paddingHorizontal: {
        paddingHorizontal: 15,
    },
    input: {
        color: Color.primary,
        zIndex: -1
    },
    subTitleText: {
        fontSize: 12,
        color: Color.orange,
        paddingTop: 10,
    },
    labelTextContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    smallTitle: {
        fontSize: 10,
        color: Color.text
    },
    valueText: {
        fontSize: 16,
        color: Color.primary
    },
})