import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import AvatarSelector from '@components/auth/avatarSelector'
import UtilService from "@utils/utils";
const { width: screenWidth } = Dimensions.get('window')
import moment from 'moment'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Global from "@utils/global";
import * as authAction from '@store/auth';
import * as commonAction from '@store/common';
import * as userAction from '@store/user';
import { FileSystem } from 'expo'
import InputGroup from '@components/general/bookingInput'

const { T1, T2 } = Global.Translate

class EditProfile extends PureComponent {
    constructor(props) {
        super(props)
        var currentUser = this.props.auth.currentUser
        console.log('currentUser', currentUser)
        var countryCode = currentUser.contactInformation.phoneNumberCountryCode
        if (countryCode && countryCode.startsWith('+')) {
            countryCode = countryCode.substr(1)
        }
        this.state = {
            items: [
                { title: "Gender", value: currentUser.genderDesc, isMandatory: true, type: 'DROPBOX', options: ['Male', 'Female'] },
                { title: "First Name", value: currentUser.firstName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('First Name') },
                { title: "Last Name", value: currentUser.lastName, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidName('Last Name') },
                { title: "Email", value: currentUser.contactInformation.email, isMandatory: true, type: 'TEXT', errorMsg: str=>str.isValidEmail(), editable:false },
                { title: "Mobile Number", value: { code: countryCode, number: currentUser.contactInformation.phoneNumber }, isMandatory: true, type: 'PHONE_NUMBER', errorMsg: phone=>phone.number.isValidPhoneNumber() },
                { title: "City", value: currentUser.location.city, isMandatory: true, type: 'TEXT', errorMsg: 'Please enter ciry.' },
                { title: "Zip Code", value: currentUser.location.zipCode, type: 'TEXT', keyboardType: 'number-pad', errorMsg: 'Please input your zip code.' },
                { title: "Address", value: currentUser.location.address, isMandatory: true, type: 'TEXT', errorMsg: 'Please input your address.' },
                {
                    title: "Select a country", value: { cca2: currentUser.location.countryID, callingCode: countryCode, name: UtilService.getCountryName(currentUser.location.countryID) },
                    isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select your country'
                },
                {
                    title: "Nationality", value: { cca2: currentUser.nationalityCode, name: UtilService.getCountryName(currentUser.nationalityCode) },
                    isMandatory: true, type: 'COUNTRY', errorMsg: 'Please select your nation'
                },
                { title: "Birth Date", value: currentUser.birthDate, isMandatory: true, type: 'DATE', errorMsg: 'Please select birthdate.', maximumDate:moment().add(-12, 'years').toDate() },
                { title: "Anniversary Date", value: currentUser.anniversaryDate, type: 'DATE' },
            ],
            showError: false,
            invalidItem:null,
            avatar: currentUser.profilePicture?currentUser.profilePicture.url:null,
        }
    }

    async save() {
        this.setState({ showError: true })
        let {items, invalidItem, avatar} = this.state
        if ( invalidItem != null ) return;
        let userData = JSON.parse(JSON.stringify(this.props.auth.currentUser))

        userData={
            ...userData,
            gender:items[0].value=='Male'?'M':'F',
            firstName: items[1].value,
            lastName: items[2].value,
            birthDate: items[10].value,
            anniversaryDate: items[11].value,
            location:{
                countryID:items[8].value.cca2,
                city:items[5].value,
                zipCode: items[6].value,
                address: items[7].value
            },
            contactInformation:{
                phoneNumber:items[4].value.number,
                phoneNumberCountryCode:items[4].value.code,
                email: items[3].value
            },
            nationalityCode:items[9].value.cca2
        }

        if (avatar && avatar.startsWith('file:')) {
            const content = await FileSystem.readAsStringAsync(avatar, {encoding:FileSystem.EncodingTypes.Base64})
            userData.profilePicture = {
                url: avatar.substr(avatar.lastIndexOf('/') + 1),
                rawData: content,
                UpdatedDate: new Date()
            }
        }
        console.log('userData', userData)
        this.props.userAction.updateUser(userData).then(({ error, result }) => {
            if (error) {
                alert(error.message)
                return
            }
            this.props.commonAction.showToast(T1('message46'))
            this.props.actions.getUserProfile()
            Actions.pop()
        })
    }



    render() {
        let { status } = this.props.auth
        let {T3} = this.props.language
        return (
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                    <View style={styles.avatarContainer}>
                        <AvatarSelector
                            url={this.state.avatar}
                            onChange={url => this.setState({ avatar: url })}
                        />
                    </View>

                    <View style={styles.lowLevel}>
                        <InputGroup
                            items={this.state.items}
                            onChange={(items, index, invalidItem) => this.setState({ items, invalidItem })}
                            showError={this.state.showError}
                            contentStyle={{ padding: 0 }}
                        />
                    </View>
                    <RoundButton
                        title={T3("Save")}
                        isLoading={status == authAction.LOADING}
                        onPress={() => this.save()}
                        style={styles.button}
                        textStyle={styles.buttonText}
                    />
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ auth, language }) => ({ auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
    userAction: bindActionCreators({ ...userAction }, dispatch),
});

export default EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    inputContainer: {
        height: 50,
        width: '100%',
        flexDirection: 'row'
    },
    input: {
        color: Color.primary
    },
    button: {
        marginTop: 30
    },
    buttonText: {
        fontWeight: 'bold'
    },
    termsContainer: {
        flexDirection: 'row',
        marginTop: 30,
    },
    termsText: {
        color: Color.text,
        fontSize: 14,
        marginLeft: 10
    },
    linkText: {
        color: Color.orange,
        fontWeight: 'bold'
    },
    avatarContainer: {
        height: 120,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    countryPicker: {
        width: '100%',
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    phoneCodeContainer: {
        width: 76,
        height: 40,
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 5,
        marginRight: 5,
    },
    countryPickerText1: {
        color: Color.lightText,
        fontSize: 18
    },
    countryPickerText2: {
        color: Color.primary,
        fontSize: 18
    },
    label: {
        fontSize: 10,
        color: Color.lightText,
    },
    phoneCodeText: {
        fontSize: 18,
        color: Color.primary,
        flex: 1,
    },
    lowLevel: {
        zIndex: -1
    },
    genderContainer: {
        justifyContent: 'center',
        borderWidth: 0,
        borderBottomWidth: 0.5,
    },
    dateContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
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
})