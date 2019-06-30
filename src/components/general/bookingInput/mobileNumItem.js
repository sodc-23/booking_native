import React from 'react'

import {
    Text,
    View,
    StyleSheet
} from 'react-native'
import PhoneInputer from '@components/general/phoneInputer'
import Color from '@common/color'
import {connect} from 'react-redux'

class MobileNumItem extends React.PureComponent {
    render() {
        let { title, value: { code, number }, onChange, isError, onSubmitEditing, ref_, isMandatory, showError, errorMsg } = this.props
        
        const msg = errorMsg==null?null:((typeof errorMsg == 'function')?errorMsg({code,number}):errorMsg)
        if ( msg!=null && typeof errorMsg =='function') isError = true
        const isErr = showError && ((isMandatory && (number == null || number == '')) || isError)
        let {T2, T3} = this.props.language
        return (
            <View>
                <PhoneInputer
                    ref2={e => { }}
                    isError={isErr}
                    phoneCode={code}
                    onChangeCountryCode={code => onChange({ code, number })}
                    placeholder={T3(title)+(isMandatory?' *':'')}
                    phoneNumber={number}
                    onChangePhoneNumber={(number) => onChange({ code, number })}
                    onSubmitEditing={onSubmitEditing}
                />
                {isErr && msg != null && <Text style={styles.error}>{T2(msg)}</Text>}
            </View>
        )
    }
}

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(MobileNumItem)

const styles = StyleSheet.create({
    error:{
        fontSize:12,
        color:Color.orange,
        marginTop:3
    }
})