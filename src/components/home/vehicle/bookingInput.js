import React, { PureComponent } from 'react'
import InputGroup from '@components/general/bookingInput';
import UtilService from '@utils/utils'
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

    onChangeTraveler(index) {
        let { coTravelers } = this.props
        let coTraveler = coTravelers[index]

        this.props.value.coTravelerName = coTraveler.userDisplayName
        this.props.value.gender = coTraveler.genderDesc
        this.props.value.firstName = coTraveler.firstName
        this.props.value.lastName = coTraveler.lastName
        this.props.value.birthDate = coTraveler.birthDate
        this.props.value.address = coTraveler.location.address
        this.props.value.city = coTraveler.location.city
        this.props.value.cca2 = coTraveler.location.countyID
        this.props.value.country = coTraveler.location.country
        this.props.value.cellPhone = coTraveler.contactInformation.phoneNumber
        this.props.value.cellPhoneCode = UtilService.withoutSign(coTraveler.contactInformation.phoneNumberCountryCode)
        this.props.value.needUpdate=true
        this.props.onChange(this.props.value)
    }

    onChangeAsAboveDetails(value){
        if (value) this.props.onChangeAsAboveDetails()
    }

    initItems(props) {
        props.value.needUpdate = false
        let { coTravelerName, gender, firstName, lastName, birthDate, country, cca2, address1, city, homePhone, homePhoneCode, cellPhone, cellPhoneCode, zipCode } = this.props.value
        let items = [
            { value: 'Please fill the names of the Traveler(s) as they officially appear on Identification or passports.', type:'DESCRIPTION'},
            props.index>0?{ title: "As Above Details", value: false, type: 'LEFT_SWITCH', onChange:this.onChangeAsAboveDetails.bind(this) }:{},
            props.coTravelers.length>0?{title:'Traveler', value:coTravelerName, type:'DROPBOX', options:props.coTravelers.map(o=>o.userDisplayName), onChange:this.onChangeTraveler.bind(this)}:{},
            { title: 'Gender', value: gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1: 'gender' },
            { title: 'First Name', value: firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name'), ref1: 'firstName' },
            { title: 'Last Name', value: lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name'), ref1: 'lastName' },
            { title: 'Birth Date', value: birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select birthdate.', ref1:'birthDate', maximumDate:moment().add(-12, 'years').toDate()},
            // { title: 'Address1 *', value: address1, isMandatory: true, type:'TEXT', errorMsg:'Please input your address.', ref1:'address1'},
            // { title: 'City *', value: city, isMandatory: true, type:'TEXT', errorMsg:'Please input your city.', ref1:'city'},
            // { title: 'Select a country', value: { cca2: cca2, name: country}, isMandatory:true, type:'COUNTRY', errorMsg:'Please select your country.', pointer:'country'},
            // { title: 'Zip Code *', value: zipCode, isMandatory: true, type:'TEXT', errorMsg:'Please input your zip code.', ref1:'zipCode'},
            // { title: 'Cell Phone *', value: {code:cellPhoneCode, number:cellPhone}, type:'PHONE_NUMBER', isMandatory:true, errorMsg:'Please input your cell phone number.', pointer:'cellPhone'},
            // { title: 'Home Phone *', value: {code:homePhoneCode, number:homePhone}, type:'PHONE_NUMBER', pointer:'homePhone'},
        ]
        this.setState({ items })
    }

    onChange(items, index, invalidItem) {
        let {value, onChange}=this.props
        if (index >=0){
            item = items[index]
            if ( item.ref1 != null ){
                value[item.ref1] = item.value
            }else{
                if (item.pointer=='country'){
                    value.cca2 = item.value.cca2
                    value.country = item.value.name
                }
                if (item.pointer=='cellPhone'){
                    value.cellPhone = item.value.number
                    value.cellPhoneCode = item.value.code
                }
                if (item.pointer=='homePhone'){
                    value.homePhone = item.value.number
                    value.homePhoneCode = item.value.code
                }
            }
        }
        onChange(value, invalidItem)
    }

    render() {
        let { items } = this.state
        let { value:{title}, showError } = this.props
        if (items.length == 0) return null
        return (
            <InputGroup
                title={`Activity Customer Details - ${title}`}
                showError={showError}
                items={items}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}
