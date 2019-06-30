import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native'

import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import {closeButtonImage} from '@common/image'
import Color from '@common/color'
import {Ionicons} from '@expo/vector-icons'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import Global from '@utils/global'

export default class PhoneInputer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.validCountries = getAllCountries()
            .filter(country => country.callingCode)
            .map(country => country.cca2)

    }

    render() {
        let { style, phoneCode, placeholder, phoneNumber, onSubmitEditing, onChangeCountryCode, onChangePhoneNumber, isError, ref2 } = this.props
        return (
            <View style={[styles.container, style]}>
                <CountryPicker
                    filterable
                    closeable
                    autoFocusFilter
                    showCallingCode={true}
                    cca2={Global.environment.portalCountry.code}
                    onChange={(value) => onChangeCountryCode(value.callingCode)}
                    closeButtonImage={closeButtonImage}
                    translation="eng"
                    styles={countryPicker}
                    countryList={this.validCountries}
                >
                    <View style={styles.phoneCodeContainer}>
                        <Text style={styles.phoneCodeText}>+{phoneCode}</Text>
                        <Ionicons name="ios-arrow-down" size={14} color={Color.text} />
                    </View>
                </CountryPicker>
                <FloatLabelTextInput
                    ref={e=>ref2(e)}
                    placeholder={placeholder}
                    placeholderTextColor={Color.lightText}
                    style={styles.input}
                    value={phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) => onChangePhoneNumber(text)}
                    isError={isError}
                    onSubmitEditing={() => onSubmitEditing()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row'
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
    input: {
        color: Color.primary
    },
})

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