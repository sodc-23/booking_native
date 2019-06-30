import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import {connect} from 'react-redux'

class TouchItem extends React.PureComponent {
    render() {
        let {title, value, onChange, isError, isMandatory, showError, errorMsg} = this.props
        const noValue = (value == null || value =='')
        const isErr = showError&&((isMandatory && (value==null||value=='')) || isError)
        const msg = errorMsg==null?null:((typeof errorMsg == 'function')?errorMsg(value):errorMsg)
        let {T2, T3} = this.props.language
        return (
            <View>
                <TouchableOpacity disabled={onChange==null} onPress={()=>onChange?onChange():{}} style={[styles.dateContainer, isErr?{borderBottomColor:'red'}:{}]}>
                    {!noValue&&<Text style={styles.smallTitle}>{T3(title)+(isMandatory?' *':'')}</Text>}
                    {!noValue&&<Text style={styles.valueText}>{value}</Text>}
                    {noValue&&<Text style={[styles.valueText, {color:Color.text}]}>{T3(title)+(isMandatory?' *':'')}</Text>}
                </TouchableOpacity>
                {isErr && msg != null && <Text style={styles.error}>{T2(msg)}</Text>}
            </View>
        )
    }
}

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(TouchItem)

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
    errorMsg:{
        fontSize:12,
        color:Color.orange,
        marginTop:3
    }
})