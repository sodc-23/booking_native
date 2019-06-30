import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
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

import {connect} from 'react-redux'

class CountryItem extends React.PureComponent {
    render() {
        let { title, value, onChange, isError, isMandatory, showError, errorMsg, countryList, style, displayValue } = this.props
        const noValue = (value == null || value.name == null)
        

        const msg = errorMsg==null?null:((typeof errorMsg == 'function')?errorMsg(value):errorMsg)
        
        const isErr = showError && ((isMandatory && (value == null || value.name == null || value.name == '')) || isError)
        let {T3} = this.props.language
        return (
            <View>
                <CountryPicker
                    filterable
                    closeable
                    autoFocusFilter
                    showCallingCode={true}
                    onChange={(value) => onChange(value)}
                    cca2={value.cca2}
                    translation="eng"
                    styles={style||countryPicker}
                    countryList={countryList}
                >
                    <View style={[styles.dateContainer, isErr ? { borderBottomColor: 'red' } : {}]}>
                        {!noValue && <Text style={styles.smallTitle}>{T3(title)} {isMandatory?'*':''}</Text>}
                        {!noValue && <Text style={styles.valueText}>{displayValue||value.name}</Text>}
                        {noValue && <Text style={[styles.valueText, { color: Color.text }]}>{T3(title)} {isMandatory?'*':''}</Text>}
                    </View>
                </CountryPicker>
                {isErr && msg != null && <Text style={styles.error}>{T2(msg)}</Text>}
            </View>
        )
    }
}
const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(CountryItem)

const styles = StyleSheet.create({
    dateContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    smallTitle: {
        fontSize: 10,
        color: Color.text
    },
    valueText: {
        fontSize: 16,
        color: Color.primary
    },
    error: {
        fontSize: 12,
        color: Color.orange,
        marginTop: 3
    }
})