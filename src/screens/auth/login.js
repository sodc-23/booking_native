import React, { PureComponent } from 'react'
import {
    View,
    ImageBackground,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import { background, white_logo } from '@common/image'
import Color from '@common/color'
import AuthTypeButton from '@components/auth/authTypeButton'
import AuthInput from '@components/auth/authInput';
import RoundButton from '@components/general/roundButton'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parsePhoneNumber } from 'libphonenumber-js'
import Global from "@utils/global";
import Device from '@common/device';

import * as authAction from '@store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
const { T1, T2 } = Global.Translate

const CloseButton = ({ onPress }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.closeButtonContainer}>
        <Ionicons name="ios-arrow-back" size={24} color={'white'} />
    </TouchableOpacity>
)

class LoginC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            authType: 'email'
        }

        let { isLoggedIn, currentUser } = this.props.auth
        if (isLoggedIn || currentUser) {
            // Actions.replace('Profile')
        }


        this.changeAuthType.bind(this)
        this.login.bind(this)
        this.facebookLogin.bind(this)
        this.googleLogin.bind(this)
        this.needBack = this.props.auth.needBack

        Global.environment.socialNetworkIntegration = Global.environment.socialNetworkIntegration || []
        Global.environment.oAuthProviderInfo = Global.environment.oAuthProviderInfo || []

        this.socials = []
        Global.environment.socialNetworkIntegration.map(socialKey => {
            this.socials[socialKey] = Global.environment.oAuthProviderInfo.filter((o) => o.name == socialKey)[0]
        })
    }

    
    componentWillReceiveProps(props) {
        // let {isLoggedIn, currentUser} = props.auth
        // if(isLoggedIn) {
        //     Actions.replace('Profile')
        // }
    }

    changeAuthType = (authType) => {
        this.setState({ authType })
    }

    login() {
        let { authType, email, password, phone } = this.state

        let {T1} = this.props.language
        if (authType == 'email' && !email) {
            return alert(T1('message8'))
        }
        if (authType == 'phone' && !phone) {
            return alert(T1('message9'))
        }
        if (!password) {
            return alert(T1('message10'))
        }
        //console.log('authType, email, password, phone', authType, email, password, phone)
        if (authType == 'email') {
            this.props.actions.login(email, password)
                .then(({ error }) => {
                    if (!error) {
                        if (this.needBack) {
                            // Actions.jump('Home')
                        } else {
                            // Actions.replace('Profile')
                        }
                    }
                })
        } else {
            try {
                var pNumber = parsePhoneNumber(phone)
                if (pNumber.isValid()) {
                    var countryCode = '+' + pNumber.countryCallingCode
                    var phoneNumber = pNumber.nationalNumber
                    console.log('phoneNumber, countryCode, password', phoneNumber, countryCode, password)
                    this.props.actions.loginWithPhone(phoneNumber, countryCode, password).then(({ error }) => {
                        if (!error) {
                            if (this.needBack) {
                                // Actions.jump('Home')
                            } else {
                                // Actions.replace('Profile')
                            }
                        }
                    })
                } else {
                    alert(T1('message11'))
                }
            } catch (e) {
                alert(T1('message11'))
            }
        }
    }

    facebookLogin = async () => {
        let { facebook } = this.socials
        try {
            this.props.actions.socialLoginStart('facebook')
            const {
              type,
              token,
              expires,
              permissions,
              declinedPermissions,
            } = await Expo.Facebook.logInWithReadPermissionsAsync('433664920701232', {
              permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email,name,picture`);
                var socialRet = await response.json()
                console.log('result', socialRet)
                //Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
                this.props.actions.socialLogin({
                    "profilePicture": socialRet.picture ? {
                        "URL": socialRet.picture.data.url
                    } : {},
                    "loginName": socialRet.name,
                    "firstName": socialRet.name,
                    "openIDs": {
                        "facebook": socialRet.id
                    },
                    "contactInformation": {
                        "name": socialRet.name,
                        "email": socialRet.email
                    }
                }, "facebook").then(({ error, result }) => {
                    //console.log(error, result)
                    if (!error) {
                        if (this.needBack) {
                            // Actions.jump('Home')
                        } else {
                            // Actions.replace('Profile')
                        }
                    }
                })
            } else {
                this.props.actions.socialLoginEnd('facebook')
            }
        } catch ({ message }) {
            console.log('error', message)
            this.props.actions.socialLoginEnd('facebook')
        }
    }

    googleLogin = async () => {
        let { google } = this.socials
        try {
            this.props.actions.socialLoginStart('google')
            const result = await Expo.Google.logInAsync({
                clientId: '866379140525-hmp4b7ikgffmc9b3ovjksdt7h5j2k2o5.apps.googleusercontent.com',
                behavior: 'web',
                scopes: ['profile', 'email']
            });
            if (result.type === 'success') {
                // Get the user's name using Facebook's Graph API
                console.log('result', result)
                this.props.actions.socialLogin({
                    "profilePicture": result.user.photoUrl ? {
                        "URL": result.user.photoUrl
                    } : {},
                    "loginName": result.user.name,
                    "firstName": result.user.familyName || result.user.name,
                    "lastName": result.user.givenName || result.user.name,
                    "openIDs": {
                        "google": result.user.id
                    },
                    "contactInformation": {
                        "name": result.user.name,
                        "email": result.user.email
                    }
                }, "google").then(({ error, result }) => {
                    //console.log(error, result)
                    if (!error) {
                        if (this.needBack) {
                            // Actions.jump('Home')
                        } else {
                            // Actions.replace('Profile')
                        }
                    }
                })
            } else {
                this.props.actions.socialLoginEnd('google')
            }
        } catch ({ message }) {
            console.log('error', message)
            this.props.actions.socialLoginEnd('google')
        }
    }

    get showLoginButtons() {
        let { facebook, google } = this.socials
        let { error, status } = this.props.auth
        const isLoading = status == authAction.LOADING
        let {T2} = this.props.language
        showNormalLogin = () => (
            <RoundButton
                isLoading={isLoading}
                disabled={isLoading}
                style={styles.login}
                title={T2("Sign in")}
                onPress={this.login.bind(this)} />
        )
        showFacebookLogin = () => {
            if (facebook) {
                return (<RoundButton
                    type="facebook"
                    isLoading={status == authAction.LOADING_FACEBOOK}
                    disabled={status == authAction.LOADING_FACEBOOK}
                    style={styles.facebook}
                    title={T2("Sign in with Facebook")}
                    onPress={this.facebookLogin} />)
            } else {
                return null
            }
        }
        showGooglePlusLogin = () => {
            if (google) {
                return (<RoundButton
                    type="google"
                    isLoading={status == authAction.LOADING_GOOGLE}
                    disabled={status == authAction.LOADING_GOOGLE}
                    style={styles.google}
                    title={T2("Sign in with Google+")}
                    onPress={this.googleLogin} />)
            } else {
                return null
            }
        }
        return (
            <View style={styles.buttonContainer}>
                {showNormalLogin()}
                {showFacebookLogin()}
                {showGooglePlusLogin()}
            </View>
        )
    }

    render() {
        let { authType, email, password, phone } = this.state
        let {
            isRegistrationEnabled,
            isForgotPasswordEnabled,
            isPhoneNumberForLoginEnabled,
            isEmailForLoginEnabled,
            isUserNameForLoginEnabled
        } = Global.environment
        let { error, status, isLoggedIn, currentUser, needBack } = this.props.auth
        // if(isLoggedIn || currentUser) {
        //     Actions.replace('Profile')
        //     return null
        // }

        const emailColor = authType == 'email' ? 'white' : '#ccc'
        const phoneColor = authType == 'phone' ? 'white' : '#ccc'
        const isShowError = error && status == authAction.FAILED
        const isShowSwitch = (isPhoneNumberForLoginEnabled && isEmailForLoginEnabled)
        const loginText = (isUserNameForLoginEnabled && isEmailForLoginEnabled) ? 'Email/Username' : (isUserNameForLoginEnabled ? 'Username' : 'Email')

        if (!isShowSwitch) {
            authType = (isEmailForLoginEnabled || isUserNameForLoginEnabled) ? 'email' : (isPhoneNumberForLoginEnabled ? 'phone' : 'email')
        }
        let errMessage = (authType == 'email') ? 'Invalid E-mail address or password' : 'Invalid Mobile number or password'

        let {T2, T3} = this.props.language
        return (
            <ImageBackground source={background} style={styles.flex} resizeMode="cover">
                <ScrollView keyboardShouldPersistTaps="always">
                    <View style={styles.container}>
                        <Image source={white_logo} style={styles.logo} />
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
                            <AuthInput
                                refs={e => this.authInputer = e}
                                authType={authType}
                                value={authType == 'email' ? email : phone}
                                placeHolder={loginText}
                                onChangeText={(text) => {
                                    let obj = {}
                                    //console.log('obj[authType]', text)
                                    obj[authType] = text || ''
                                    this.setState(obj)
                                }}
                                onSubmitEditing={() => this.passwordInput.focus()}
                            />
                            <View style={styles.spacer} />
                            <AuthInput
                                refs={e => this.passwordInput = e}
                                authType={'password'}
                                value={this.state.password}
                                onChangeText={(text) => this.setState({ password: text })}
                                onSubmitEditing={() => this.login()}
                            />
                        </View>
                        {isShowError && <View style={styles.errorContainer}>
                            <Text style={styles.error}>{errMessage}</Text>
                        </View>}
                        {this.showLoginButtons}
                        <View style={styles.linkContainer}>
                            {isForgotPasswordEnabled && <Text style={styles.linkText} onPress={() => Actions.ForgotPassword()}>{T3('Forgot Password?')}</Text>}
                            {isRegistrationEnabled && <Text style={styles.linkText} onPress={() => Actions.Register()}>{T2('Not here? Sign Up')}</Text>}
                        </View>
                    </View>
                </ScrollView>
                {needBack!=null && <CloseButton onPress={() => {
                    Actions.jump(needBack)
                }} />}
            </ImageBackground>
        )
    }
}

const mapStateToProps = ({ auth, language }) => ({ auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch)
});

export default Login = connect(mapStateToProps, mapDispatchToProps)(LoginC);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        marginTop: Device.ToolbarHeight + 10,
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
    },
    logo: {
        height: 100,
        resizeMode: 'contain'
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
        marginTop: 15
    },
    authTypeTextContainer: {
        flexDirection: 'row',
        width: 260,
        marginTop: 10,
        justifyContent: 'space-between'
    },
    authTypeText: {
        fontSize: 13,
    },
    spacer: {
        width: '100%',
        height: 1,
        backgroundColor: Color.border
    },
    inputContainer: {
        borderRadius: 4,
        width: 300,
        backgroundColor: 'white',
        marginTop: 15
    },
    buttonContainer: {
        marginTop: 15,
        width: 300
    },
    linkContainer: {
        width: 300,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    errorContainer: {
        width: 300,
        marginTop: 10,
    },
    error: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center'
    },
    login: {
        backgroundColor: Color.orange
    },
    facebook: {
        backgroundColor: Color.facebook,
        marginTop: 30
    },
    google: {
        backgroundColor: Color.google,
        marginTop: 15,
    },
    linkText: {
        fontSize: 14,
        // fontWeight:'bold',
        color: 'white'
    },
    closeButtonContainer: {
        padding: 10,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 15,
        top: Device.ToolbarHeight + 5
    }
})