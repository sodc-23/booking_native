import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView
} from 'react-native'

import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import AuthTypeButton from '@components/auth/authTypeButton'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authAction from '@store/auth';
import UtilService from "@utils/utils";
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { Ionicons } from '@expo/vector-icons'
import Global from "@utils/global";
import { getCountryCallingCode } from 'libphonenumber-js'
const { T1, T2 } = Global.Translate

import {
    MobileNumItem,
    TextItem,
} from '@components/general/bookingInput/inputItems'

class ForgotPasswordC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            authType: 'email',
            // cca2: Global.environment.portalCountry.code,
            // phoneCode: getCountryCallingCode(Global.environment.portalCountry.code)

            phoneNumber: { code: getCountryCallingCode(Global.environment.portalCountry.code), number: '' }
        }

        this.validCountries = getAllCountries()
            .filter(country => country.callingCode)
            .map(country => country.cca2)
    }

    done(authType) {
        let { email, phoneNumber: { code, number } } = this.state
        this.setState({ showError: true })
        let {T1} = this.props.language
        if (authType == 'email' && email.isValidEmail() == null || authType != 'email' && number.isValidPhoneNumber() == null) {
            if (authType == 'email') {
                this.props.actions.forgetPassword({ email }).then(({ error }) => {
                    if (error) {
                        alert(T1('message4'))
                    } else {
                        Alert.alert('', T1('message5'), [
                            { text: 'OK', onPress: () => Actions.pop() }
                        ],
                            { cancelable: false })
                    }
                })
            } else {
                this.props.actions.forgetPassword({
                    phoneNumber: number,
                    phoneNumberCountryCode: `+${code}`
                }, authType).then(({ error }) => {
                    if (error) {
                        //console.log(error)
                        alert("Mobile Number isn't registered with our system.")
                    } else {
                        Alert.alert('', T1('message7'), [
                            { text: 'OK', onPress: () => Actions.pop() }
                        ],
                            { cancelable: false })

                    }
                })
            }
        }
    }

    changeAuthType = (authType) => {
        this.setState({ authType })
    }

    render() {
        let {
            isPhoneNumberForLoginEnabled,
            isEmailForLoginEnabled,
        } = Global.environment

        let { email, authType, phoneNumber, showError } = this.state
        let { status } = this.props.auth
        const isLoading = status == authAction.LOADING
        const isShowSwitch = (isPhoneNumberForLoginEnabled && isEmailForLoginEnabled)
        const emailColor = authType == 'email' ? 'black' : 'grey'
        const phoneColor = authType == 'phone' ? 'black' : 'grey'

        if (!isShowSwitch) {
            authType = (isEmailForLoginEnabled) ? 'email' : (isPhoneNumberForLoginEnabled ? 'phone' : '')
        }

        let {T3} = this.props.language
        return (
            <ScrollView style={{backgroundColor:'white'}}>
                <View style={styles.container}>
                    <Text style={styles.description}>
                        Enter registered e-mail and we will send you a link to reset your password
                    </Text>
                    {isShowSwitch && <View style={styles.typeSwitchContainer}>
                        <AuthTypeButton
                            icon="email"
                            selected={authType == 'email'}
                            onPress={this.changeAuthType} />
                        <AuthTypeButton
                            icon="phone"
                            selected={authType == 'phone'}
                            onPress={this.changeAuthType} />
                    </View>}
                    {isShowSwitch && <View style={styles.authTypeTextContainer}>
                        <Text style={[styles.authTypeText, { color: emailColor }]}>{T3('E-mail Address')}</Text>
                        <Text style={[styles.authTypeText, { color: phoneColor }]}>{T3('Mobile Number')}</Text>
                    </View>}
                    <View style={styles.inputContainer}>
                        {authType == 'email' && <TextItem
                            title={T3("E-mail")}
                            value={email}
                            showError={showError}
                            onChange={text => this.setState({ email: text })}
                            isMandatory
                            errorMsg={str => str.isValidEmail()}
                        />}
                        {authType == 'phone' && <MobileNumItem
                            title={T3("Mobile Number")}
                            value={phoneNumber}
                            showError={showError}
                            onChange={value => this.setState({ phoneNumber: value })}
                            isMandatory
                            errorMsg={value => value.number.isValidPhoneNumber()}
                        />}
                    </View>
                    <RoundButton
                        title={T3("Send Link")}
                        isLoading={isLoading}
                        // disabledUI={!email || (authType=='email' && !UtilService.validateEmail(email))}
                        // disabled={isLoading || !email || (authType=='email' && !UtilService.validateEmail(email))}
                        onPress={() => this.done(authType)}
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
    actions: bindActionCreators({ ...authAction }, dispatch)
});

export default ForgetPassword = connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordC);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: 40,
        width:'100%'
    },
    description: {
        fontSize: 18,
        color: Color.lightText,
        textAlign: 'center'
    },
    button: {
        marginTop: 20
    },
    buttonText: {
        fontWeight: 'bold'
    },
    input: {
        color: Color.primary
    },
    typeSwitchContainer: {
        height: 44,
        width: 200,
        borderRadius: 22,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        marginTop: 15,
        borderWidth: 0.5,
        borderColor: 'grey'
    },
    authTypeTextContainer: {
        flexDirection: 'row',
        width: 260,
        marginTop: 10,
        justifyContent: 'space-between'
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
    phoneCodeText: {
        fontSize: 18,
        color: Color.primary,
        flex: 1,
    },
})