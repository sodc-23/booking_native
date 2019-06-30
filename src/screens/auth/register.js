import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import { closeButtonImage } from '@common/image'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import RoundButton from '@components/general/roundButton'
import CheckButton from '@components/general/checkButton'
import AvatarSelector from '@components/auth/avatarSelector'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import UtilService from "@utils/utils";
const { width: screenWidth } = Dimensions.get('window')
import moment from 'moment'

import {
    DateItem,
    DescItem,
    DropBoxItem,
    MobileNumItem,
    OrangeTitle,
    LeftSwitchItem,
    RightSwitchItem,
    TextItem,
    TimeItem,
    TitleItem,
    TouchItem
} from '@components/general/bookingInput/inputItems'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Global from "@utils/global";
import * as authAction from '@store/auth';
import * as commonAction from '@store/common';
import { Ionicons } from '@expo/vector-icons'
import { getCountryCallingCode } from 'libphonenumber-js'
import {
    Select,
    Option,
    OptionList,
    updatePosition
} from '@react-native-dropdown'
const { T1, T2 } = Global.Translate

const PHONE_NUM_INDEX = 6
const OTP_NUM_INDEX = 8

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

class RegisterC extends PureComponent {
    constructor(props) {
        super(props)
        this.needOTP = Global.environment.isSmsOtpForPhoneNumberRegistrationEnabled
        this.needPhoneNumber = Global.environment.isPhoneNumberForRegistrationMandatory

        let formData = [
            { title: 'Gender', value: 'Male' },
            { title: 'First Name *', value: '' },
            { title: 'Last Name *', value: '' },
            { title: 'Email *', value: '' },
            { title: 'Password(minimum 6 characters) *', value: '' },
            { title: 'Confirm Password *', value: '' },
            { title: 'Mobile Number', value: {code:getCountryCallingCode(Global.environment.portalCountry.code), number:''} },
            { title: 'Country', value: Global.environment.portalCountry.code },
            { title: 'OTP Number *', value: '' },

        ]

        this.state = {
            formData,
            isAgreed: false,
            avatar: '',
            cca2: Global.environment.portalCountry.code,
            countryName: Global.environment.portalCountry.name,
            // phoneCode: getCountryCallingCode(Global.environment.portalCountry.code),
            showError: false
        }
        this.inputs = []

        this.validCountries = getAllCountries()
            .filter(country => country.callingCode)
            .map(country => country.cca2)

        this.termsAndConditions = UtilService.getFieldFromList2(Global.environment.cobrandDetails, 'shortDesc', 'value', 'SIGNUPTERMS')
        this.privacyPolicyText = UtilService.getFieldFromList2(Global.environment.cobrandDetails, 'shortDesc', 'value', 'PRIVACYPOLICYTERMS')
    }

    async signUp() {
        let { formData, isAgreed, avatar, cca2 } = this.state

        let {T1} = this.props.language
        this.setState({showError:true})
        if (!isAgreed) {
            alert("Please accept the Terms and Conditions.")
            return
        }

        let gender = formData[0].value == 'Male' ? 'M' : 'F'
        let firstName = formData[1].value
        let lastName = formData[2].value
        let email = formData[3].value
        let password = formData[4].value
        let confirm = formData[5].value
        let phoneNumber = formData[6].value.number
        let phoneCode = formData[6].value.code
        let country = formData[7].value
        let otpNumber = formData[8].value

        if ( firstName.isValidName()!=null || lastName.isValidName()!=null || email.isValidEmail() !=null ||
            password.isValidPassword()|| confirm.isValidConfirmPassword(password)!=null || phoneNumber.isValidPhoneNumber()!= null) return;

        //send data
        var requestData = {
            "request": {
                "lastName": lastName,
                "firstName": firstName,
                "loginName": `${firstName} ${lastName}`,
                "location": {
                    "countryId": cca2,
                },
                "contactInformation": {
                    "phoneNumber": this.needPhoneNumber ? phoneNumber : '',
                    "PhoneNumberCountryCode": phoneCode,
                    "email": email
                },
                "password": password,
                "gender": gender
            },
            "flags": {}
        }

        if (avatar) {
            requestData.request.profilePicture = {
                url: avatar.substr(avatar.lastIndexOf('/') + 1),
                rawData: await UtilService.getImageRawData(avatar),
                UpdatedDate: new Date()
            }
        }

        if (this.needOTP) {
            //set otp number
            requestData.smsOtp = otpNumber
        }

        console.log('requestData', requestData)
        this.props.actions.register(requestData).then(({ error, result }) => {
            if (error) {
                alert(error.message)
                return
            }

            console.log('register result', result)
            Actions.pop()
            // this.props.actions.login(email, password)
            //     .then(({ error }) => {
            //         console.log('login', error, email, password)
            //         if (!error) {
            //             console.log('login - here')
            //             Actions.replace('Profile')
            //         }
            //     })
            this.props.commonAction.showToast(T1('message15'))
        })
    }

    changeCountry(value) {
        console.log('value', value)
        this.setState({
            cca2: value.cca2,
            callingCode: value.callingCode,
            countryName: value.name
        })
    }

    termAndConditions() {
        Actions.Privacy({ title: 'Terms and Conditions', html: this.termsAndConditions })
    }

    privacyPolicy() {
        Actions.Privacy({ title: 'Privacy and Policy', html: this.privacyPolicyText })
    }

    updateInfo(index, value){
        this.state.formData[index].value = value
        this.setState({formData:[...this.state.formData]})
        
    }

    render() {
        let { formData, isAgreed } = this.state
        let { status } = this.props.auth
        let {T3, T1} = this.props.language
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
                        <DropBoxItem 
                            {...formData[0]}
                            options={[T3('Male'), T3('Female')]}
                            onChange={(index)=>this.updateInfo(0, [T3('Male'), T3('Female')][index])}
                            showError={this.state.showError}
                        />
                        <TextItem
                            {...formData[1]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(1, text)}
                            showError={this.state.showError}
                            errorMsg={str=>str.isValidName('first name')}
                        />
                        <TextItem
                            {...formData[2]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(2, text)}
                            showError={this.state.showError}
                            errorMsg={str=>str.isValidName('last name')}
                        />
                        <TextItem
                            {...formData[3]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(3, text)}
                            showError={this.state.showError}
                            errorMsg={str=>str.isValidEmail()}
                        />
                        <TextItem
                            {...formData[4]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(4, text)}
                            secureTextEntry={true}
                            showError={this.state.showError}
                            errorMsg={str=>str.isValidPassword()}
                        />
                        <TextItem
                            {...formData[5]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(5, text)}
                            secureTextEntry={true}
                            showError={this.state.showError}
                            errorMsg={str=>str.isValidConfirmPassword(formData[4].value)}
                        />
                        <MobileNumItem
                            {...formData[6]}
                            onChange={(value)=>this.updateInfo(6, value)}
                            showError={this.state.showError}
                            errorMsg={value=>value.number.isValidPhoneNumber()}
                        />
                        {this.needOTP && <TextItem
                            {...formData[8]}
                            isMandatory={true}
                            onChange={(text)=>this.updateInfo(8, text)}
                            showError={this.state.showError}
                            errorMsg={T2("Please Input your OTP number.")}
                        />}
                        <CountryPicker
                            filterable
                            closeable
                            autoFocusFilter
                            styles={countryPicker}
                            onChange={(value) => this.changeCountry(value)}
                            cca2={this.state.cca2}
                            countryList={this.validCountries}
                            translation="eng"
                        >
                            <TouchItem
                                title={formData[7].title}
                                isMandatory={true}
                                value={this.state.countryName}
                                showError={this.state.showError}
                            />
                        </CountryPicker>
                        <View style={styles.termsContainer}>
                            <CheckButton
                                value={isAgreed}
                                onPress={() => this.setState({ isAgreed: !this.state.isAgreed })}
                            />
                            <Text style={styles.termsText}>
                                {T1('message42')}
                                <Text onPress={() => this.termAndConditions()} style={styles.linkText}> {T3('Terms and Conditions')} </Text>
                                and
                                <Text onPress={() => this.privacyPolicy()} style={styles.linkText}> Privacy Policy</Text>
                            </Text>
                        </View>
                    </View>
                    <RoundButton
                        title={T3("Sign Up")}
                        // disabled={!isAgreed}
                        // disabledUI={!isAgreed}
                        isLoading={status == authAction.LOADING}
                        onPress={() => this.signUp()}
                        style={styles.button}
                        textStyle={styles.buttonText}
                    />
                </View>
                <PolicyModal
                    onRef={e => this.policyModal = e}
                    title={this.state.policyTitle}
                    description={this.state.policyDesc}
                    closeModal={() => this.policyModal.close()}
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ auth, language }) => ({ auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default Register = connect(mapStateToProps, mapDispatchToProps)(RegisterC);

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
    }
})