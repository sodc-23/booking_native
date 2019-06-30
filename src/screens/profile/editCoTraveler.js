import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native'

import RoundButton from '@components/general/roundButton'
import UtilService from "@utils/utils";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Global from "@utils/global";
import * as cotravellerAction from '@store/cotraveller';
import * as commonAction from '@store/common';
import { getCountryCallingCode } from 'libphonenumber-js'
import moment from 'moment'
const { T1, T2 } = Global.Translate

import InputGroup from '@components/general/bookingInput'

class EditTraveler extends PureComponent {
    constructor(props) {
        super(props)

        currentUser = this.props.coTraveler || {
            "anniversaryDate": null,
            "birthDate": null,
            "contactInformation": {
                "email": "",
                "phoneNumber": "",
                "phoneNumberCountryCode": getCountryCallingCode(Global.environment.portalCountry.code),
            },
            "firstName": "",
            "lastName": "",
            "gender": "M",
            "genderDesc": "Male",
            "location": {
                "country": Global.environment.portalCountry.name,
                "countryID": Global.environment.portalCountry.code
            }
        }
        this.mode = this.props.coTraveler ? 'edit' : 'create'
        this.currentUser = currentUser

        var countryCode = currentUser.contactInformation.phoneNumberCountryCode
        if (countryCode && countryCode.startsWith('+')) {
            countryCode = countryCode.substr(1)
        }
        this.state = {
            showError:false,
            items: [
                { title: "Gender", value: currentUser.genderDesc, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'] },
                { title: "First Name", value: currentUser.firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('first name') },
                { title: "Last Name", value: currentUser.lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('last name') },
                { title: "Email", value: currentUser.contactInformation.email, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidEmail()},
                { title: "Mobile Number", value: { code: countryCode, number: currentUser.contactInformation.phoneNumber }, isMandatory: true, type: 'PHONE_NUMBER', errorMsg: value=>value.number.isValidPhoneNumber() },
                {
                    title: "Select a country", value: { cca2: currentUser.location.countryID, callingCode: countryCode, name: UtilService.getCountryName(currentUser.location.countryID) },
                    isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select your country'
                },
                { title: "Birth Date", value: currentUser.birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select your birthdate.', maximumDate:moment().add(-12, 'years').toDate() },
                { title: "Anniversary Date", value: currentUser.anniversaryDate, type: 'DATE' },
            ],
        }
        this.inputs = []
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.mode == 'edit' ? 'Edit Co-Traveler' : 'Add Co-Traveler',
            notifications: 3,
        });
    }

    async save() {
        this.setState({ showError: true })
        let {items, invalidItem, avatar} = this.state
        if ( invalidItem != null ) return;
        userData = {...this.currentUser}

        userData={
            ...userData,
            gender:items[0].value=='Male'?'M':'F',
            firstName: items[1].value,
            lastName: items[2].value,
            birthDate: items[6].value,
            anniversaryDate: items[7].value,
            location:{
                countryID:items[5].value.cca2,
            },
            contactInformation:{
                phoneNumber:items[4].value.number,
                phoneNumberCountryCode:items[4].value.code,
                email: items[3].value
            },
        }

        if (this.mode == 'create') {
            this.props.actions.create(userData).then(({ error, result }) => {
                if (error) {
                    alert(error.message)
                    return
                }
                this.props.commonAction.showToast('Co-Traveler saved successfully.')
                this.props.actions.getCoTravelers()
                Actions.pop()
            })
        } else {
            this.props.actions.update(userData).then(({ error, result }) => {
                if (error) {
                    alert(error.message)
                    return
                }
                this.props.commonAction.showToast('Co-Traveler updated successfully.')
                this.props.actions.getCoTravelers()
                Actions.pop()
            })
        }
    }

    render() {
        let { status } = this.props.cotraveller
        let {T3} = this.props.language
        return (
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                    <InputGroup
                        items={this.state.items}
                        onChange={(items, index, invalidItem) => this.setState({ items, invalidItem })}
                        showError={this.state.showError}
                        contentStyle={{ padding: 0 }}
                    />
                    <View style={styles.inlineButtons}>
                        <RoundButton
                            title={this.mode == 'create' ? T3("Add") : T3('Save')}
                            isLoading={status == cotravellerAction.LOADING}
                            onPress={() => this.save()}
                            style={styles.button}
                            textStyle={styles.buttonText}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ cotraveller, language }) => ({ cotraveller, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cotravellerAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditTraveler);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    button: {
        marginTop: 30,
        flex:1,
        marginHorizontal:10,
    },
    buttonText: {
        fontWeight: 'bold'
    },
    inlineButtons: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})