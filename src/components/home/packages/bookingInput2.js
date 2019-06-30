import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Dimensions
} from 'react-native'
import {
    MobileNumItem,
    DropBoxItem,
} from '@components/general/bookingInput/inputItems'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import UtilService from '@utils/utils';

import moment from 'moment'
import Global from "@utils/global";
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
            selectedTravelers:[],
        }
        this.validCountries = getAllCountries()
            .filter(country => country.callingCode)
            .map(country => country.cca2)
        this.maxDate = moment().add(-12, 'years').toDate()
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.props.value.birthDate = date
        this.props.onChange(this.props.value)
        this._hideDateTimePicker();
    };

    onChangeGener(gender) {
        this.props.value.gender = gender
        this.props.onChange(this.props.value)
    }

    onChangeSaveAsCoTraveler(value) {
        this.props.value.selSaveAsTraveler = value
        this.props.onChange(this.props.value)
    }

    onChangeAsAboveDetails(value) {
        let { onChange, coTravelers, onChangeAsAboveDetails } = this.props

        this.setState({ asAboveDetails: value })

        if (value) {
            onChangeAsAboveDetails()
        }
    }

    changeCountry(value) {
        this.props.onChange({ ...this.props.value, country: value.name, cca2: value.cca2 })
    }

    onChangeTraveler(index, coTraveler) {
        //console.log('coTraveler', coTraveler)
        this.props.value.gender = coTraveler.genderDesc
        this.props.value.firstName = coTraveler.firstName
        this.props.value.lastName = coTraveler.lastName
        this.props.value.birthDate = coTraveler.birthDate
        this.props.value.address1 = coTraveler.location.address
        this.props.value.city = coTraveler.location.city
        this.props.value.cca2 = coTraveler.location.countyID
        this.props.value.country = coTraveler.location.country
        this.props.value.cellPhone = coTraveler.contactInformation.phoneNumber
        this.props.value.cellPhoneCode = UtilService.withoutSign(coTraveler.contactInformation.phoneNumberCountryCode)

        this.props.onChange(this.props.value)
    }

    render() {
        let { title, gender, firstName, lastName, birthDate, country, cca2, address1, city, homePhone, homePhoneCode, cellPhone, cellPhoneCode, zipCode } = this.props.value
        let { onChange, showSwitch, index, coTravelers=[] } = this.props
        let {asAboveDetails, selectedTravelers} = this.state
        let birthDate1 = (birthDate==''||(new Date(birthDate)).getFullYear()<1000)?null:birthDate
        let coTravelerOptions =   coTravelers.map((item)=>item.userDisplayName)

        return (
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>Customer Details - {title}</Text>
                </View>
                <View style={styles.textView}>
                    <Text style={styles.desc}>Please fill the names of the Traveler(s) as they officially appear on Identification or passports.</Text>
                    {index != 0 && <View style={styles.containerRow}>
                        <Switch
                            thumbColor="white"
                            trackColor={{ true: Color.orange, false: Color.lightBack }}
                            onValueChange={(value) => this.onChangeAsAboveDetails(value)}
                            value={asAboveDetails}
                        />
                        <Text style={styles.saveAsText}>As Above Details</Text>
                    </View>}
                    
                    {coTravelers.length > 0 && <DropBoxItem
                        title="Traveler "
                        value={selectedTravelers[index]||'Select'}
                        options={coTravelerOptions}
                        onChange={(idx)=>{
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
                        onChange={index=>this.onChangeGener(index==0?'Male':'Female')}
                        isMandatory
                        index={gender=='Male'?0:1}
                    />
                    <View style={styles.underLayout}>
                        <FloatLabelTextInput
                            ref='firstName'
                            placeholder='First Name *'
                            placeholderTextColor={Color.lightText}
                            style={styles.input}
                            value={firstName}
                            onChangeText={(firstName) => {
                                onChange({ ...this.props.value, firstName })
                            }}
                            isError={!firstName || firstName.length < 2}
                            onSubmitEditing={() => this.refs.lastName.focus()}
                        />
                        <FloatLabelTextInput
                            ref="lastName"
                            placeholder='Last Name *'
                            placeholderTextColor={Color.lightText}
                            style={styles.input}
                            value={lastName}
                            onChangeText={(lastName) => {
                                onChange({ ...this.props.value, lastName })
                            }}
                            isError={!lastName || lastName.length < 2}
                        />

                        <TouchableOpacity onPress={() => this._showDateTimePicker()} style={styles.dateContainer}>
                            <Text style={styles.smallTitle}>Birth Date *</Text>
                            <Text style={styles.valueText}>{birthDate1 == null ? 'Select a date' : moment(birthDate1).format(Global.dateFormat)}</Text>
                        </TouchableOpacity>
                        <FloatLabelTextInput
                            ref="address1"
                            placeholder='Address1 *'
                            placeholderTextColor={Color.lightText}
                            style={styles.input}
                            value={address1}
                            isError={!address1}
                            onChangeText={(address1) => {
                                onChange({ ...this.props.value, address1 })
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
                                onChange({ ...this.props.value, city })
                            }}
                        />
                        <CountryPicker
                            filterable
                            closeable
                            autoFocusFilter
                            styles={countryPicker}
                            onChange={(value) => this.changeCountry(value)}
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
                                onChange({ ...this.props.value, zipCode })
                            }}
                        />
                        <MobileNumItem
                            title="Cell Phone *"
                            isMandatory
                            value={{code:cellPhoneCode, number:cellPhone}}
                            onChange={({code, number}) => onChange({ ...this.props.value, cellPhone:number, cellPhoneCode:code })}
                        />
                        <MobileNumItem
                            title="Home Phone *"
                            isMandatory
                            value={{code:homePhoneCode, number:homePhone}}
                            onChange={({code, number}) => onChange({ ...this.props.value, homePhone:number, homePhoneCode:code })}
                        />
                    </View>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    maximumDate={this.maxDate}
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
        color: '#999999',
        paddingLeft: 10,
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
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    label: {
        fontSize: 10,
        color: Color.lightText,
    },
})