import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment'
import Global from '@utils/global'
import {connect} from 'react-redux'
import UtilService from '@utils/utils';

class DateItem extends React.PureComponent {

    state={
        isDateTimePickerVisible: false
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.props.onChange(date)
        this._hideDateTimePicker()
    };

    render() {
        let {title, value, isMandatory, isError, showError, errorMsg, ...props} = this.props
        const noValue = (value == null || value =='' || (new Date(value).getFullYear()<1000))
        const isErr = showError && ((isMandatory && (value==null||value=='')) || isError)
        const msg = errorMsg==null?null:((typeof errorMsg == 'function')?errorMsg(value):errorMsg)
        let {T3, T2} = this.props.language
        return (
            <View>
                <TouchableOpacity onPress={() => this._showDateTimePicker()} style={[styles.dateContainer, isErr?{borderBottomColor:'red'}:{}]}>
                    {!noValue&&<Text style={styles.smallTitle}>{T3(title)+(isMandatory?' *':'')}</Text>}
                    {!noValue&&<Text style={styles.valueText}>{UtilService.getValidDate(value)}</Text>}
                    {noValue&&<Text style={[styles.valueText,{color:Color.text}]}>{T3(title)+(isMandatory?' *':'')}</Text>}
                </TouchableOpacity>
                <DateTimePicker
                    {...props}
                    mode='date'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                {isErr&&msg!=null&&<Text style={styles.error}>{T2(msg)}</Text>}
            </View>
        )
    }
}

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(DateItem)

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
    error:{
        fontSize:12,
        color:Color.orange,
        marginTop:3
    }
})