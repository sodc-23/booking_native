import React, { Component } from 'react'
import {
    StyleSheet
} from 'react-native'
import BookingInput from '@components/general/bookingInput';
import UtilService from '@utils/utils';

import moment from 'moment'
import Global from "@utils/global";

export default class BusBookingInput extends Component {
    state = {
        items: []
    }

    asAbove(val, index) {
        console.log('onChangeAsAboveDetails', val, index)
        if (val) {
            let value = this.props.value
            value.travelers[index].firstName = value.travelers[index-1].firstName
            value.travelers[index].lastName = value.travelers[index-1].lastName
            value.travelers[index].gender = value.travelers[index-1].gender
            value.travelers[index].birthDate = value.travelers[index-1].birthDate
            value.travelers[index].documentType = value.travelers[index-1].documentType
            value.travelers[index].documentNumber = value.travelers[index-1].documentNumber
            value.travelers[index].expiryDate = value.travelers[index-1].expiryDate
            value.travelers[index].aniversaryDate = value.travelers[index-1].aniversaryDate
            value.travelers[index].cellPhone = value.travelers[index-1].cellPhone
            value.travelers[index].cellPhoneCode = value.travelers[index-1].cellPhoneCode
            value.travelers[index].email = value.travelers[index-1].email
            value.travelers[index].pickupLocation = value.travelers[index-1].pickupLocation
            value.travelers[index].dropoffLocation = value.travelers[index-1].dropoffLocation
            value.travelers[index].asAboveDetails = true
            value.needUpdate = true
            value.needUpdate = true
            this.props.onChange(value)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.needUpdate) {
            this.A2B()
        }
    }

    A2B() {
        let { value = { travelers: [] }, showError } = this.props
        value.needUpdate = false
        let documentTypeNames = Global.documentTypes.map((item) => item.description)

        let items = [{ type: 'DESCRIPTION', value: 'Please fill the names of the Traveler(s) as they oficially appear on Identification or passports' }]
        value.travelers.map((traveler, index) => {
            let { gender, firstName, lastName, birthDate, 
                pickupLocation, dropoffLocation, documentType, documentNumber, expiryDate, cellPhone, cellPhoneCode, 
                aniversaryDate, isForeigner, email, asAboveDetails,
                seat, pickupList, dropoffList, selSaveAsTraveler} = traveler
            items.push({ type: 'ORANGE_TEXT', title: `Traveler ${index + 1}:` })

            if (index > 0) items.push({
                type: 'LEFT_SWITCH', value: asAboveDetails, title: 'As Above Details',
                onChange: (val)=>this.asAbove(val, index), pointer: { index, name: 'asAboveDetails' }
            })
            items.push({
                type: 'DROPBOX', title: 'Gender', value: gender, options: ['Male', 'Female'],
                onChange: (index) => { }, pointer: { index, name: 'gender' }
            })
            items.push({
                type: 'TEXT', title: 'First Name', value: firstName, isMandatory: true, errorMsg:str=>str.isValidName('first name'),
                pointer: { index, name: 'firstName' }
            })
            items.push({
                type: 'TEXT', title: 'Last Name', value: lastName, isMandatory: true,errorMsg:str=>str.isValidName('last name'),
                pointer: { index, name: 'lastName' }
            })
            items.push({
                type: 'DATE', title: 'Birth Date', value: UtilService.birthDate, isMandatory: true,errorMsg:"Please select birthdate.",
                pointer: { index, name: 'birthDate' }, maximumDate:moment().add(-18, 'years').toDate()
            })
            items.push({
                type:'TEXT', title:'Seat', value: seat,  editable:false,
                pointer:{index, name:'seat'}
            })
            items.push({
                type:'DROPBOX', title:'Pickup Location', value: UtilService.getBusLocation(pickupLocation), options:pickupList.map(o=>UtilService.getBusLocation(o)),
                onChnage:(index)=>{

                }, isMandatory:true, pointer:{index, name:'pickup'}
            })
            items.push({
                type:'DROPBOX', title:'Dropoff Location', value: UtilService.getBusLocation(dropoffLocation), options:dropoffList.map(o=>UtilService.getBusLocation(o)),
                onChnage:(index)=>{
                    
                }, isMandatory:true, pointer:{index, name:'dropoff'}
            })
            items.push({
                type: 'DATE', title: 'Anniversary Date', value: aniversaryDate,
                pointer: { index, name: 'aniversaryDate' }
            })
            items.push({
                type:'DROPBOX', title:'Document Type', value: documentType, options:documentTypeNames, isMandatory:true, errorMsg:"Please select document type",
                onChnage:(index)=>{}, isMandatory:true, pointer:{index, name:'documentType'}
            })
            items.push({ type: 'TEXT', title: 'Document Number', isMandatory:true, errorMsg:"Please enter document number",
                value: documentNumber, pointer: { index, name: 'documentNumber' } })
            items.push({
                type: 'DATE', title: 'Expiry date', value: expiryDate, isMandatory:true, errorMsg:"Please select expiry date.",
                pointer: { index, name: 'expiryDate' }, minimumDate:moment().add(6, 'months').toDate()
            })
            items.push({
                type: 'PHONE_NUMBER', title: 'Mobile Number', value: { code: cellPhoneCode, number: cellPhone }, errorMsg:value=>value.number.isValidPhoneNumber(),
                pointer: { index, name: 'phone' }, isMandatory:true, 
            })
            items.push({ type: 'TEXT', title: 'Email', value: email, pointer: { index, name: 'email' }, isMandatory:true, errorMsg:str=>str.isValidEmail(), })
            items.push({ title: 'Save As Co-Traveler', value: selSaveAsTraveler, type:'LEFT_SWITCH', pointer: { index, name: 'selSaveAsTraveler' }})
            items.push({
                type: 'RIGHT_SWITCH', title: 'Are you a foreigner?', value: isForeigner, 
                pointer: { index, name: 'isForeigner' }
            })
        })
        this.setState({ items })
    }

    B2A(idx) {
        let travelers = this.props.value.travelers
        let item = this.state.items[idx]
        if (item.pointer) {
            let { value, pointer: { index, name } } = item
            if (name == 'phone') {
                travelers[index].cellPhoneCode = value.code
                travelers[index].cellPhone = value.number
            } else if(name == 'pickup') {
                travelers[index].pickupLocation = travelers[index].pickupList[item.index||0]
            } else if(name == 'dropoff') {
                travelers[index].dropoffLocation = travelers[index].dropoffList[item.index||0]
            } else {
                if (index >= travelers.length) travelers.push({})
                travelers[index][name] = value
            }
        }
        this.props.onChange(this.props.value)
        //this.props.value.travelers = travelers
    }

    componentDidMount() {
        this.A2B()
    }

    onChange(items, index) {
        if(index == -1) return
        this.setState({ items }, () => this.B2A(index))
    }

    render() {

        return (
            <BookingInput
                title="Passenger Details"
                items={this.state.items}
                showError={this.props.showError}
                onChange={(items, index) => this.onChange(items, index)}
            />
        )
    }
}
const styles = StyleSheet.create({
})

BusBookingInput.defaultProps={
    travelers:[
        {
            seatList:['A01', 'A02', 'B01', 'B02'],
            pickupList:['Makkah AI Haram Bus Terminal - 7:00 AM', 'Madinah Highway Bus Terminal - 10:00 AM'],
            docList:['Passport', 'Visa', 'Nothing']
        },
        {
            seatList:['A01', 'A02', 'B01', 'B02'],
            pickupList:['Makkah AI Haram Bus Terminal - 7:00 AM', 'Madinah Highway Bus Terminal - 10:00 AM'],
            docList:['Passport', 'Visa', 'Nothing']
        }
    ]
}