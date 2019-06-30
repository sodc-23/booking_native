import React, { PureComponent } from 'react'
import {
    StyleSheet
} from 'react-native'
import BookingInput from '@components/general/bookingInput';

export default class Packages extends PureComponent {
    state = {
        items: []
    }

    asAbove(value, index) {
        if (value) {
            value.travelers[index] = { ...value.travelers[index - 1], asAboveDetails: true }
            this.props.onChange(this.props.value)
            this.A2B()
        }
    }

    A2B() {
        let { value = { travelers: [] } } = this.props
        let items = [{ type: 'DESCRIPTION', value: 'Please fill the names of the Traveler(s) as they oficially appear on Identification or passports' }]
        value.travelers.map((traveler, index) => {
            let { gender, firstName, lastName, birthDate, aniversaryDate, phoneCode, mobileNumber, isForeigner, email, asAboveDetails } = traveler
            items.push({ type: 'ORANGE_TEXT', title: `Traveler ${index + 1}:` })

            if (index > 0) items.push({
                type: 'LEFT_SWITCH', value: asAboveDetails,
                onChange: this.asAbove.bind(this), pointer: { index, name: 'asAboveDetails' }
            })
            items.push({
                type: 'DROPBOX', title: 'Gender *', value: gender, options: ['Male', 'Female'],
                onChange: (index) => { }, isMandatory: true, pointer: { index, name: 'gender' }
            })
            items.push({
                type: 'TEXT', title: 'First Name *', value: firstName, isMandatory: true,
                pointer: { index, name: 'firstName' }
            })
            items.push({
                type: 'TEXT', title: 'Last Name *', value: lastName, isMandatory: true,
                pointer: { index, name: 'lastName' }
            })
            items.push({
                type: 'DATE', title: 'Birth Date *', value: birthDate, isMandatory: true,
                pointer: { index, name: 'birthDate' }
            })
            items.push({
                type: 'DATE', title: 'Anniversary Date', value: aniversaryDate,
                pointer: { index, name: 'aniversaryDate' }
            })
            items.push({
                type: 'PHONE_NUMBER', title: 'Mobile Number', value: { code: phoneCode, number: mobileNumber }, 
                pointer: { index, name: 'phone' }
            })
            items.push({ type: 'TEXT', title: 'Email', value: email, pointer: { index, name: 'email' } })
            items.push({
                type: 'RIGHT_SWITCH', title: 'Are you a foreigner?', value: isForeigner, 
                pointer: { index, name: 'isForeigner' }
            })
        })
        this.setState({ items })
    }

    B2A() {
        let travelers = []
        this.state.items.map((item) => {
            if (item.pointer) {
                let { value, pointer: { index, name } } = item
                if (name == 'phone') {
                    travelers[index].phoneCode = value.code
                    travelers[index].mobileNumber = value.number
                } else {
                    if (index >= travelers.length) travelers.push({})
                    travelers[index][name] = value
                }
            }
        })
        this.props.value.travelers = travelers
    }

    componentDidMount() {
        this.A2B()
    }

    onChange(items, index) {
        this.setState({ items }, () => this.B2A())
    }

    render() {

        return (
            <BookingInput
                title="Passenger Details"
                items={this.state.items}
                onChange={(items, index) => this.onChange(items, index)}
            />
        )
    }
}
const styles = StyleSheet.create({
})