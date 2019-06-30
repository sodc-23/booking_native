import React, { PureComponent } from 'react'
import InputGroup from '@components/general/bookingInput';
import UtilService from '@utils/utils'
import Global from "@utils/global";
import moment from 'moment'

export default class ContactInput extends PureComponent {
    state = {
        items: []
    }

    componentDidMount() {

        this.initItems(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.needUpdate) {
            this.initItems(nextProps)
        }
    }

    onChangeTraveler(index, idx) {
        let { coTravelers, value: { travelers } } = this.props
        let coTraveler = coTravelers[index]
        var traveler = travelers[idx]

        this.props.value.coTravelerName = coTraveler.userDisplayName
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
        this.props.value.needUpdate = true
        this.props.onChange(this.props.value)
    }

    onChangeAsAboveDetails(value) {
        if (value) this.props.onChangeAsAboveDetails()
    }

    initItems(props) {
        props.value.needUpdate = false
        let { coTravelerName } = this.props.value
        let items = [
            { value: 'Please fill the names of the Traveler(s) as they officially appear on Identification or passports.\nYou can enter up to 23 characters.\nLast names should be given whole. Neither special characters nor spaces are allowed.', type: 'DESCRIPTION' }
        ]
        let documentTypeNames = Global.documentTypes.map((item) => item.description)
        props.value.travelers.map((traveler, idx) => {
            let { gender, firstName, lastName, birthDate, address, city, country, zipCode, phoneCode, mobileNumber, homePhone, homePhoneCode, isForeigner, cca2, saveAsCoTraveler, asAboveDetails } = traveler
            items.push(
                idx>0 ? { title: "As Above Details", value: saveAsCoTraveler, type: 'LEFT_SWITCH', onChange: this.onChangeAsAboveDetails.bind(this), idx } : {},
                props.coTravelers.length > 0 ? { title: 'Traveler', value: coTravelerName, type: 'DROPBOX', options: props.coTravelers.map(o => o.userDisplayName), onChange: (index) => this.onChangeTraveler(index, idx), idx } : {},
                { title: 'Gender', value: gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1: 'gender', idx },
                { title: 'First Name', value: firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name'), ref1: 'firstName', idx },
                { title: 'Last Name', value: lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name'), ref1: 'lastName', idx },
                { title: 'Birth Date', value: birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select birthdate.', ref1: 'birthDate', idx, maximumDate:moment().add(-12, 'years').toDate() },
                { title: 'Address', value: address, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter address.', ref1: 'address' },
                { title: 'City', value: city, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter city.', ref1: 'city' },
                { title: 'Select a country', value: { cca2: cca2, name: country }, isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select country.', pointer: 'country' },
                { title: 'Zip Code', value: zipCode, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter zip code.', ref1: 'zipCode' },
                { title: 'Cell Phone', value: { code: phoneCode, number: mobileNumber }, type: 'PHONE_NUMBER', isMandatory: true, errorMsg: value=>value.number.isValidPhoneNumber(), pointer: 'cellPhone', idx },
                { title: 'Home Phone', value: { code: homePhoneCode, number: homePhone }, type: 'PHONE_NUMBER', pointer: 'homePhone', idx},
                { title: 'Save As Co-Traveler', value: saveAsCoTraveler, type: 'LEFT_SWITCH', ref1: 'saveAsCoTraveler', idx }
            )
        })
        this.setState({ items })
    }

    onChange(items, index, invalidItem) {
        let { value, onChange, value: { travelers } } = this.props
        if (index >= 0) {
            item = items[index]
            if (item.idx >= 0) {
                let traveler = travelers[item.idx]
                if (item.ref1 != null) {
                    traveler[item.ref1] = item.value
                } else {
                    if (item.pointer == 'country') {
                        traveler.country = item.value.name
                        traveler.cca2 = item.value.cca2
                    }
                    if (item.pointer == 'cellPhone') {
                        traveler.phoneCode = item.value.code
                        traveler.mobileNumber = item.value.number
                    }
                    if (item.pointer == 'homePhone') {
                        traveler.homePhone = item.value.number
                        traveler.homePhoneCode = item.value.code
                    }

                }
            }
        }
        onChange(value, invalidItem)
    }

    render() {
        let { items } = this.state
        let { value: { title }, showError } = this.props
        if (items.length == 0) return null
        return (
            <InputGroup
                title={`Passenger Details`}
                showError={showError}
                items={items}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}
