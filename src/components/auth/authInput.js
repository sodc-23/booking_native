import React, {PureComponent} from 'react'
import {
    StyleSheet,
    TextInput,
    View,
    Image,
    Text
} from 'react-native'
import Color from '@common/color'
import {Ionicons} from '@expo/vector-icons'
import {messageBlack, mobileBlack, locked, closeButtonImage} from '@common/image'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { getCountryCallingCode } from 'libphonenumber-js'
import Global from "@utils/global";

const countryPicker={
    closeButtonImage:{
        width:34, 
        flex:1, 
        paddingHorizontal:5,
    },
    letter:{
        width:30,
        height:35
    }
}

export default class AuthInput extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            cca2:'US',
            phoneCode:getCountryCallingCode(Global.environment.portalCountry.code)
        }
    }
    renderCountryCode() {
        let {authType, onChangeText, value} = this.props
        let textValue = value||'';
        if(authType == 'phone') {
            if(textValue[0]=='+') {
                textValue = textValue.split(' ')[1]
            }
        }
        return (
            <CountryPicker
                filterable
                closeable
                autoFocusFilter
                showCallingCode={true}
                onChange={(value) => { 
                    this.setState({ phoneCode: value.callingCode }) 
                    onChangeText('+'+value.callingCode+' '+textValue)
                }}
                cca2={this.state.cca2}
                closeButtonImage={closeButtonImage}
                translation="eng"
                styles={countryPicker}
                countryList={this.validCountries}
            >
                <View style={styles.phoneCodeContainer}>
                    <Text style={styles.phoneCodeText}>+{this.state.phoneCode}</Text>
                    <Ionicons name="ios-arrow-down" size={14} color={Color.text} />
                </View>
            </CountryPicker>
        )
    }
    render(){
        let {authType, onChangeText, value, onSubmitEditing, refs} = this.props
        let {phoneCode} = this.state
        const iconImage={email:messageBlack, phone:mobileBlack, password:locked}
        const keyboardType={email:'email-address', phone:'phone-pad', password:'default'}
        const returnKeyType=authType=='password'?'done':'next'
        const placeholder={email:'E-mail Address', phone:'Mobile Number', password:'Password'}
        
        let textValue = value||'';
        if(authType == 'phone') {
            if(textValue[0]=='+') {
                textValue = textValue.split(' ')[1]
            }
        }
        
        return(
            <View style={styles.container}>
                <Image source={iconImage[authType]} style={styles.iconImage}/>
                {authType=='phone' && this.renderCountryCode()}
                <TextInput
                    ref={e=>refs(e)}
                    secureTextEntry={authType=='password'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder={placeholder[authType]}
                    underlineColorAndroid='transparent'
                    onChangeText={(text)=>onChangeText(authType=='phone'?('+'+phoneCode+' '+(text||'')):text)}
                    value={textValue}
                    keyboardType={keyboardType[authType]}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    style={styles.input}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:50,
        flexDirection:'row',
        alignItems:'center'
    },
    input:{
        fontSize:13,
        flex:1,
        height:40
    },
    iconImage:{
        marginHorizontal:15,
        width:24,
        height:24,
        resizeMode:'contain'
    },
    phoneCodeText: {
        fontSize: 12,
        color: Color.primary,
        flex: 1,
    },
    phoneCodeContainer: {
        width: 60,
        height: 40,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginRight: 5,
    },
    
    
})