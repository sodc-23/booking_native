import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { DropBoxItem, MobileNumItem } from '@components/general/bookingInput/inputItems';
import moment from 'moment'
import Global from "@utils/global";
import UtilService from '@utils/utils';

const { T1, T2 } = Global.Translate

const { width: screenWidth } = Dimensions.get("window")

const countryPicker = {
    closeButtonImage: {
        width: 34,
        flex: 1,
        paddingHorizontal: 5,
    },
    letter: {
        width: 30,
        height: 35
    }
}

export default class BookingInput extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            saveAsCoTraveler: false,
            asAboveDetails: false,
            isDateTimePickerVisible: false,
            selectedTravelers: [],
        }
        this.maxDate = moment().add(-12, 'years').toDate()
    }

    _showDateTimePicker = (index, dateType) => this.setState({ isDateTimePickerVisible: true, dateType, selected: index });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let { value } = this.props
        let { dateType, selected } = this.state
        switch (dateType) {
            case 'birth':
                value.travelers[selected].birthDate = date
                break;
            case 'aniversary':
                value.travelers[selected].aniversaryDate = date
                break;
            case 'expiry':
                value.travelers[selected].expiryDate = date
                break;
        }

        this.props.onChange({ ...this.props.value })
        this._hideDateTimePicker();
    };

    onChangeGener(traveler, gender) {
        traveler.gender = gender
        this.props.onChange({ ...this.props.value })
    }

    onChangeSaveAsCoTraveler(value) {
        this.props.value.selSaveAsTraveler = value
        this.props.onChange(this.props.value)
    }

    onChangeAsAboveDetails(value, index) {
        let { onChange, coTravelers, onChangeAsAboveDetails } = this.props

        this.setState({ asAboveDetails: value })

        if (value) {
            onChangeAsAboveDetails(index)
        }
    }

    copyTraveler(dest, src) {
        dest.gender = src.gender
        dest.firstName = src.firstName
        dest.lastName = src.lastName
        dest.birthDate = src.birthDate
        dest.aniversaryDate = src.aniversaryDate
        dest.documentType = src.documentType
        dest.documentNumber = src.documentNumber
        dest.expiryDate = src.expiryDate
        dest.phoneCode = src.phoneCode
        dest.mobileNumber = src.mobileNumber
        dest.email = src.email
        dest.isForeigner = src.isForeigner
    }
    onChangeDocType(index, type) {
        let { travelers = [] } = this.props.value

        travelers[index].documentType = type
        this.props.onChange(this.props.value)
    }

    onChangeTraveler(index, coTraveler) {
        let { travelers = [] } = this.props.value
        var traveler = travelers[index]

        traveler.gender = coTraveler.genderDesc
        traveler.firstName = coTraveler.firstName
        traveler.lastName = coTraveler.lastName
        traveler.lastName = coTraveler.lastName
        traveler.birthDate = coTraveler.birthDate
        traveler.address = coTraveler.location.address
        traveler.city = coTraveler.location.city
        traveler.cca2 = coTraveler.location.countyID
        traveler.country = coTraveler.location.country
        traveler.mobileNumber = coTraveler.contactInformation.phoneNumber
        traveler.phoneCode = UtilService.withoutSign(coTraveler.contactInformation.phoneNumberCountryCode)

        this.props.onChange(this.props.value)
    }

    changeCountry(value, index) {
        let { travelers = [] } = this.props.value
        travelers[index].country = value.name
        travelers[index].cca2 = value.cca2
        this.props.onChange({ ...this.props.value })
    }

    render() {
        let { onChange, value = { travelers: [] }, coTravelers = [] } = this.props
        let { asAboveDetails, isExpanded1, isExpanded2, isExpanded3, selectedTravelers, dateType } = this.state
        let coTravelerOptions = coTravelers.map((item) => item.userDisplayName)

        return (
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>Passenger Details</Text>
                </View>
                <View style={styles.textView}>
                    <Text style={styles.desc}>Please fill the names of the Traveler(s) as they officially appear on Identification or passports.</Text>
                    {value.travelers.map((traveler, index) => {
                        let { gender, firstName, lastName, birthDate, address, city, country, zipCode, phoneCode, mobileNumber, homePhone, homePhoneCode, isForeigner, cca2, saveAsCoTraveler, asAboveDetails } = traveler
                        let birthDate1 = (birthDate == '' || (new Date(birthDate)).getFullYear() < 1000) ? null : birthDate
                        return (
                            <View key={index}>
                                {/* <Text style={styles.travelerText}>Traveler {index + 1}:</Text> */}
                                {coTravelers.length > 0 && <DropBoxItem
                                    title="Traveler "
                                    value={selectedTravelers[index] || 'Select'}
                                    options={coTravelerOptions}
                                    onChange={(idx) => {
                                        selectedTravelers[index] = coTravelerOptions[idx]
                                        this.setState({
                                            selectedTravelers
                                        })
                                        this.onChangeTraveler(index, coTravelers[idx])
                                    }}
                                />}
                                <DropBoxItem
                                    title="Gender *"
                                    value={gender}
                                    options={['Male', 'Female']}
                                    onChange={idx => this.onChangeGener(traveler, idx == 0 ? 'Male' : 'Female')}
                                    isMandatory
                                    index={gender == 'Male' ? 0 : 1}
                                />
                                <FloatLabelTextInput
                                    ref='firstName'
                                    placeholder='First Name *'
                                    placeholderTextColor={Color.lightText}
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={(firstName) => {
                                        traveler.firstName = firstName
                                        onChange({ ...this.props.value })
                                    }}
                                    onSubmitEditing={() => this.refs.lastName.focus()}
                                />
                                <FloatLabelTextInput
                                    ref="lastName"
                                    placeholder='Last Name *'
                                    placeholderTextColor={Color.lightText}
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={(lastName) => {
                                        traveler.lastName = lastName
                                        onChange({ ...this.props.value })
                                    }}
                                />

                                <TouchableOpacity onPress={() => this._showDateTimePicker(index, 'birth')} style={styles.dateContainer}>
                                    <Text style={styles.smallTitle}>Birth Date *</Text>
                                    <Text style={styles.valueText}>{birthDate1 == null ? 'Select a date' : moment(birthDate1).format(Global.dateFormat)}</Text>
                                </TouchableOpacity>
                                <FloatLabelTextInput
                                    ref="address"
                                    placeholder='Address *'
                                    placeholderTextColor={Color.lightText}
                                    style={styles.input}
                                    value={address}
                                    isError={!address}
                                    onChangeText={(address) => {
                                        traveler.address = address
                                        onChange({ ...this.props.value })
                                    }}
                                />
                                <FloatLabelTextInput
                                    ref="city"
                                    placeholder='City *'
                                    placeholderTextColor={Color.lightText}
                                    style={styles.input}
                                    value={city}
                                    isError={!city}
                                    onChangeText={(city) => {
                                        traveler.address = city
                                        onChange({ ...this.props.value })
                                    }}
                                />
                                <CountryPicker
                                    filterable
                                    closeable
                                    autoFocusFilter
                                    styles={countryPicker}
                                    onChange={(value) => this.changeCountry(value, index)}
                                    cca2={cca2 || Global.environment.portalCountry.code}
                                    countryList={this.validCountries}
                                    translation="eng"
                                >
                                    <View style={styles.countryPicker}>
                                        {this.state.countryName == '' && <Text style={styles.countryPickerText1}>Select a country</Text>}
                                        {this.state.countryName != '' && <Text style={styles.label}>Select a country</Text>}
                                        {this.state.countryName != '' && <Text style={styles.countryPickerText2}>{country}</Text>}
                                    </View>
                                </CountryPicker>
                                <FloatLabelTextInput
                                    ref="zipCode"
                                    placeholder='Zip Code *'
                                    placeholderTextColor={Color.lightText}
                                    style={styles.input}
                                    value={zipCode}
                                    isError={!zipCode}
                                    onChangeText={(zipCode) => {
                                        traveler.zipCode = zipCode
                                        onChange({ ...this.props.value })
                                    }}
                                />
                                <MobileNumItem
                                    title="Mobile Number *"
                                    isMandatory
                                    value={{ code: phoneCode, number: mobileNumber }}
                                    onChange={({ code, number }) => {
                                        traveler.mobileNumber = number
                                        traveler.phoneCode = code
                                        onChange({ ...this.props.value})
                                    }}
                                />
                                <MobileNumItem
                                    title="Home Phone Number *"
                                    isMandatory
                                    value={{ code: homePhoneCode, number: homePhone }}
                                    onChange={({ code, number }) => {
                                        traveler.homePhone = number
                                        traveler.homePhoneCode = code
                                        onChange({ ...this.props.value})
                                    }}
                                />
                                {/* <View style={styles.containerRow}>
                                    <Switch
                                        thumbColor="white"
                                        trackColor={{ true: Color.orange, false: Color.lightBack }}
                                        onValueChange={(isForeigner) => {
                                            traveler.isForeigner = isForeigner
                                            onChange({ ...this.props.value })
                                        }}
                                        value={isForeigner}
                                    />
                                    <Text style={styles.saveAsText}>Are you a foreigner?</Text>
                                </View> */}
                                <View style={styles.containerRow}>
                                    <Switch
                                        thumbColor="white"
                                        trackColor={{ true: Color.orange, false: Color.lightBack }}
                                        onValueChange={(value) => this.onChangeSaveAsCoTraveler(value)}
                                        value={saveAsCoTraveler}
                                    />
                                    <Text style={styles.saveAsText}>Save As Co-Traveler</Text>
                                </View>
                                {index != 0 && <View style={styles.containerRow}>
                                    <Switch
                                        thumbColor="white"
                                        trackColor={{ true: Color.orange, false: Color.lightBack }}
                                        onValueChange={(value) => this.onChangeAsAboveDetails(value)}
                                        value={asAboveDetails}
                                    />
                                    <Text style={styles.saveAsText}>As Above Details</Text>
                                </View>}
                            </View>)
                    })}
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    maximumDate={dateType=='birth'?this.maxDate:null}
                />

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerRow: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginBottom: 5
    },
    foreignerContainer: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginBottom: 5
    },
    titleView: {
        width: "100%",
        height: 'auto',
        padding: 15,
        backgroundColor: '#eeeeee',
    },
    input: {
        color: Color.primary,
        zIndex: -1
    },
    titleText: {
        fontSize: 16,
        color: '#033d5b',
        fontWeight: 'bold',
    },

    textView: {
        width: '100%',
        height: 'auto',
        padding: 15,
        zIndex: 10000,
    },

    textViewNoPadding: {
        width: '100%',
        height: 'auto',
        paddingHorizontal: 15,
    },

    hintText: {
        fontSize: 10,
        color: Color.text,
    },
    travlerHintText: {
        fontSize: 10,
        color: Color.text,
    },
    genderText: {
        fontSize: 18,
        color: '#033d5b',
        borderBottomWidth: 2,
        borderBottomColor: '#d8d8d8',
    },
    splitLineFlat: {
        height: 2,
        padding: 10,
        width: '100%',
        backgroundColor: '#d8d8d8',
    },
    genderContainer: {
        borderWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        zIndex: 10000
    },
    roomName: {
        fontSize: 16,
        color: '#f37f4f',
        paddingBottom: 10,
        paddingTop: 10,
    },
    splitLineThick: {
        borderBottomWidth: 1,
        borderBottomColor: '#777'
    },
    splitLineThin: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    travelrContainer: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    guestNumber: {
        fontSize: 16,
        color: Color.primary,
    },
    saveAsText: {
        fontSize: 12,
        color: Color.lightText,
        marginLeft: 10,
    },
    travelerText: {
        fontSize: 12,
        color: Color.orange,
    },
    dateContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    lowLevel: {
        zIndex: 10000,
    },
    marginTopBottom: {
        marginTop: 10,
        marginBottom: 10,
    },
    smallTitle: {
        fontSize: 10,
        color: Color.text
    },
    valueText: {
        fontSize: 16,
        color: Color.primary
    },
    guestContainer: {
        height: 45,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#777'
    },
    underLayout: {
        zIndex: -1
    },
    desc: {
        marginVertical: 8,
        fontSize: 11,
        color: Color.text
    },
    label: {
        fontSize: 10,
        color: Color.lightText,
    },
    countryPickerText1: {
        color: Color.lightText,
        fontSize: 18
    },
    countryPickerText2: {
        color: Color.primary,
        fontSize: 18
    },
    countryPicker: {
        width: '100%',
        height: 45,
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        justifyContent: 'center',
        backgroundColor: 'white'
    },

})