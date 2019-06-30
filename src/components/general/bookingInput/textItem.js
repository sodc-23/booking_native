import React from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import {connect} from 'react-redux'

const TextItem = ({ title, value, onChange, isError, ref_, isMandatory, errorMsg, ...props }) => {
    const msg = errorMsg==null?null:((typeof errorMsg == 'function')?errorMsg(value||''):errorMsg)
    if ( msg != null && typeof errorMsg == 'function' ) isError = true
    let {T3, T2}=props.language
    return (
        <View>
            <FloatLabelTextInput
                // ref={e=>ref_(e)}
                {...props}
                placeholder={T3(title)+(isMandatory?' *':'')}
                placeholderTextColor={Color.lightText}
                style={[styles.input,props.style]}
                isError={props.showError && ((isMandatory && (value == null || value == '')) || isError)}
                value={value}
                onChangeText={onChange}
            />
            {props.showError && ((isMandatory && (value == null || value == '')) || isError) && msg!=null &&
                <Text style={styles.error}>{T2(msg)}</Text>}
        </View>
    )
}

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(TextItem)

const styles = StyleSheet.create({
    input: {
        color: Color.primary
    },
    error: {
        fontSize: 12,
        color: Color.orange,
        marginTop: 3
    }
})