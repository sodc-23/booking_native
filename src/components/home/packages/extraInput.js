import React, { PureComponent } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PhoneInputer from '@components/general/phoneInputer'
import moment from 'moment'
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

const { width: screenWidth } = Dimensions.get("window")

const ClickableItem = ({ title, value, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.dateContainer}>
        <Text style={styles.smallTitle}>{title}</Text>
        <Text style={styles.valueText}>{value}</Text>
    </TouchableOpacity>
)

const Title=({title})=>(
    <Text style={styles.orangeText}>{title}</Text>
)

export default class BookingInput extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            saveAsCoTraveler: false,
            asAboveDetails: false,
            isDateTimePickerVisible: false,
            lastName:''
        }
    }

    _showDateTimePicker = (index, dateType) => this.setState({ isDateTimePickerVisible: true, dateType, selected: index });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
    };



    render() {
        let {lastName} = this.state
        return (
            <View style={styles.container}>
                <Title title='Pickup hotel details'/>
                <ClickableItem
                    title={'Test'}
                    value={'Test Value'}
                    onPress={() => alert('Okay')}
                />

                <FloatLabelTextInput
                    ref="lastName"
                    placeholder='Last Name *'
                    placeholderTextColor={Color.lightText}
                    style={styles.input}
                    value={lastName}
                    onChangeText={(lastName) => {
                        this.setState({lastName})
                    }}
                />

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerRow: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginBottom: 5
    },
    foreignerContainer: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginBottom: 5
    },
    titleView: {
        width: "100%",
        height: 'auto',
        padding: 15,
        backgroundColor: '#eeeeee',
    },
    input: {
        color: Color.primary,
        zIndex: -1
    },
    titleText: {
        fontSize: 16,
        color: '#033d5b',
        fontWeight: 'bold',
    },

    textView: {
        width: '100%',
        height: 'auto',
        padding: 15,
        zIndex: 10000,
    },

    textViewNoPadding: {
        width: '100%',
        height: 'auto',
        paddingHorizontal: 15,
    },

    hintText: {
        fontSize: 10,
        color: Color.text,
    },
    travlerHintText: {
        fontSize: 10,
        color: Color.text,
    },
    genderText: {
        fontSize: 18,
        color: '#033d5b',
        borderBottomWidth: 2,
        borderBottomColor: '#d8d8d8',
    },
    splitLineFlat: {
        height: 2,
        padding: 10,
        width: '100%',
        backgroundColor: '#d8d8d8',
    },
    genderContainer: {
        borderWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        zIndex: 10000
    },
    roomName: {
        fontSize: 16,
        color: '#f37f4f',
        paddingBottom: 10,
        paddingTop: 10,
    },
    splitLineThick: {
        borderBottomWidth: 1,
        borderBottomColor: '#777'
    },
    splitLineThin: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    travelrContainer: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    guestNumber: {
        fontSize: 16,
        color: Color.primary,
    },
    saveAsText: {
        fontSize: 12,
        color: Color.lightText,
        marginLeft: 10,
    },
    travelerText: {
        fontSize: 12,
        color: Color.orange,
    },
    dateContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    lowLevel: {
        zIndex: 10000,
    },
    marginTopBottom: {
        marginTop: 10,
        marginBottom: 10,
    },
    smallTitle: {
        fontSize: 10,
        color: Color.text
    },
    valueText: {
        fontSize: 16,
        color: Color.primary
    },
    guestContainer: {
        height: 45,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#777'
    },
    underLayout: {
        zIndex: -1
    },
    desc: {
        marginVertical: 8,
        fontSize: 11,
        color: Color.text
    },
    orangeText:{
        
    }
})