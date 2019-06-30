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
        let { coTravelers, value:{travelers} } = this.props
        let coTraveler = coTravelers[index]
        var traveler = travelers[idx]

        traveler.gender = coTraveler.genderDesc
        traveler.firstName = coTraveler.firstName
        traveler.lastName = coTraveler.lastName
        traveler.lastName = coTraveler.lastName
        traveler.birthDate = coTraveler.birthDate
        traveler.documentNumber = coTraveler.documentNumber
        traveler.documentType = coTraveler.documentType
        traveler.nationality = coTraveler.nationalityCode
        if (coTraveler.documentType == 'PASSPORTNUMBER' && coTraveler.passportExpirationDate) {
            traveler.expiryDate = new Date(coTraveler.passportExpirationDate)
        }
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
            let { gender, firstName, lastName, birthDate, issuingCountry, nationality, cca2, nation_cca2, documentType, documentNumber, expiryDate, passengerType, isFirst, selSaveAsTraveler } = traveler
            items.push(
                { title: 'Passenger Type: '+passengerType, type:'ORANGE_TEXT', idx},
                !isFirst ? { title: "As Above Details", value: false, type: 'LEFT_SWITCH', onChange: this.onChangeAsAboveDetails.bind(this), idx } : {},
                props.coTravelers.length > 0 ? { title: 'Traveler', value: coTravelerName, type: 'DROPBOX', options: props.coTravelers.map(o => o.userDisplayName), onChange: (index)=>this.onChangeTraveler(index, idx), idx } : {},
                { title: 'Gender', value: gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1: 'gender', idx },
                { title: 'First Name', value: firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name'), ref1: 'firstName', idx },
                { title: 'Last Name', value: lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name'), ref1: 'lastName', idx },
                { title: 'Birth Date', value: birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select your birthdate.', ref1: 'birthDate', idx, maximumDate:moment().add(-12, 'years').toDate() },
                { title: 'Nationality', value: { cca2: nation_cca2, name: nationality }, isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select nation.', pointer: 'nation', idx },
                { title: 'Document Type', value: documentType, isMandatory: true, type: 'DROPBOX', options:documentTypeNames, errorMsg: 'Please select document type.', ref1: 'documentType', idx },
                { title: 'Document Number', value: documentNumber, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter document number.', ref1: 'documentNumber', idx },
                { title: 'Issuing Country', value: { cca2: cca2, name: issuingCountry }, isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select your issuing country.', pointer: 'issuing', idx },
                { title: 'Expiry Date', value: expiryDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select expiry date.', ref1: 'expiryDate', idx },
                { title: 'Save As Co-Traveler', value: selSaveAsTraveler, type:'LEFT_SWITCH', ref1:'selSaveAsTraveler', idx}
            )
        })
        this.setState({ items })
    }

    onChange(items, index, invalidItem) {
        let { value, onChange, value:{travelers} } = this.props
        if (index >= 0) {
            item = items[index]
            if ( item.idx != undefined ){
                let traveler = travelers[item.idx]
                if (item.ref1!=null){
                    traveler[item.ref1] = item.value
                }else{
                    if ( item.pointer == 'issuing' ){
                        traveler.issuingCountry = item.value.name
                        traveler.cca2 = item.value.cca2
                    }
                    if ( item.pointer == 'nation'){
                        traveler.nationality = item.value.name
                        traveler.nation_cca2 = item.value.cca2
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
                title={`Flight Customer Details - ${title}`}
                showError={showError}
                items={items}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}
