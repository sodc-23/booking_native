import React, { PureComponent } from 'react'
import InputGroup from '@components/general/bookingInput';
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

    onChangeTraveler(index, roomIndex) {
        let { coTravelers } = this.props
        let coTraveler = coTravelers[index]
        if(roomIndex == 0) {
            this.props.value.coTravelerName = coTraveler.userDisplayName
            this.props.value.gender = coTraveler.genderDesc
            this.props.value.firstName = coTraveler.firstName
            this.props.value.lastName = coTraveler.lastName
            this.props.value.birthDate = coTraveler.birthDate
            this.props.value.rooms[0].guestFirstName = coTraveler.firstName
            this.props.value.rooms[0].guestLastName = coTraveler.lastName
            this.props.value.needUpdate=true
            this.props.onChange(this.props.value)
        } else {
            this.props.value.rooms[roomIndex].coTravelerName = coTraveler.userDisplayName
            this.props.value.rooms[roomIndex].guestFirstName = coTraveler.firstName
            this.props.value.rooms[roomIndex].guestLastName = coTraveler.lastName
            this.props.value.needUpdate=true
            this.props.onChange(this.props.value)
        }
    }

    onChangeAsAboveDetails(value){
        if (value) this.props.onChangeAsAboveDetails()
    }

    initItems(props) {
        props.value.needUpdate = false
        let { gender, firstName, lastName, birthDate, rooms=[], selSaveAsTraveler, coTravelerName} = props.value
        let items = [
            { value: 'Please fill the names of the Traveler(s) as they officially appear on Identification or passports.', type:'DESCRIPTION'},
            props.index>0?{ title: "As Above Details", value: false, type: 'LEFT_SWITCH', onChange:this.onChangeAsAboveDetails.bind(this) }:{},
            props.coTravelers.length>0?{title:'Traveler', value:coTravelerName, type:'DROPBOX', options:props.coTravelers.map(o=>o.userDisplayName), onChange:(idx)=>this.onChangeTraveler(idx, 0)}:{},
            { title: 'Gender', value: gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1: 'gender' },
            { title: 'First Name', value: firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name'), ref1: 'firstName' },
            { title: 'Last Name', value: lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name'), ref1: 'lastName' },
            { title: 'Birth Date', value: birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select your birthdate.', ref1:'birthDate', maximumDate:moment().add(-12, 'years').toDate()},
        ]
        rooms.map((room, index)=>{
            items.push(
                { title: 'ROOM: '+room.roomName, type:'ORANGE_TEXT', ref1:'room', index},
                { title: 'Max Persons', value: room.maxGuests+' Guest(s)', type:'TEXT', editable:false},
                (index>0 && props.coTravelers.length>0)?{title:'Traveler', value:room.coTravelerName, type:'DROPBOX', options:props.coTravelers.map(o=>o.userDisplayName), onChange:(idx)=>this.onChangeTraveler(idx, index)}:{},
                index>0?{ title: 'Gender', value: room.gender, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'], ref1:'gender', index }:{},
                { title: 'Guest First Name', value: room.guestFirstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('guest first name.'), ref1:'guestFirstName', index},
                { title: 'Guest Last Name', value: room.guestLastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('guest last name.'), ref1:'guestLastName', index}
            )
            items.push({ title: 'Save As Co-Traveler', value: room.selSaveAsTraveler, type:'LEFT_SWITCH', ref1:'selSaveAsTraveler'}, index)
        })
        this.setState({ items })
    }

    onChange(items, index, invalidItem) {
        let {value, onChange}=this.props
        if (index >=0){
            item = items[index]
            if ( item.ref1 != null ){
                if ( item.index != null ){
                    if (item.ref1=='room') value.rooms[item.index] = {}
                    else{
                        value.rooms[item.index][item.ref1] = item.value
                    }
                }else{
                    value[item.ref1] = item.value
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
                title={`Hotel Customer Details - ${title}`}
                showError={showError}
                items={items}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}
