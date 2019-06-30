import React, { PureComponent } from 'react'
import InputGroup from '@components/general/bookingInput';
import moment from 'moment'
import {connect} from 'react-redux'

class ContactInput extends PureComponent {
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

    initItems(props) {
        let { gender, firstName, lastName, city, itineraryName, email, primaryContactNumber, primaryContactPhoneCode, homePhoneCode, homePhone } = props.value
        const items = [
            { title: "As Above Details", value: false, type: 'LEFT_SWITCH' },
            { title: 'Gender', value: gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1: 'gender' },
            { title: 'First Name', value: firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name'), ref1: 'firstName' },
            { title: 'Last Name', value: lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name'), ref1: 'lastName' },
            { title: 'City', value: city, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter city.', ref1: 'city' },
            { title: 'Itinerary Name', value: itineraryName, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter itinerary Name.', ref1: 'itineraryName' },
            { title: 'Email', value: email, type: 'TEXT', isMandatory: true, errorMsg: str=>str.isValidEmail(), ref1: 'email' },
            { title: 'Primary Contact Number', value: { code: primaryContactPhoneCode, number: primaryContactNumber }, isMandatory: true, type: 'PHONE_NUMBER', errorMsg: value=>value.number.isValidPhoneNumber() },
            { title: 'Home Phone', value: { code: homePhoneCode, number: homePhone }, type: 'PHONE_NUMBER' },
        ]
        this.setState({ items })
    }

    onChange(items, index, invalidItem) {
        let { onChange, onChangeAsAboveDetails } = this.props
        if (index == 0 && items[0].value) {
            onChangeAsAboveDetails()
        }
        let value = {
            primaryContactNumber: items[7].value.number,
            primaryContactPhoneCode: items[7].value.code,
            homePhone: items[8].value.number,
            homePhoneCode: items[8].value.code
        }
        items.map(item => { if (item.ref1 != null) value[item.ref1] = item.value })
        onChange(value, invalidItem)
    }

    render() {
        let { items } = this.state
        let { showError, language:{T1, T2} } = this.props
        if (items.length == 0) return null
        return (
            <InputGroup
                title={T1("contact").toProperCase()}
                showError={showError}
                items={items}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

export default connect(({language})=>({language}), (dispatch)=>({}))(ContactInput)