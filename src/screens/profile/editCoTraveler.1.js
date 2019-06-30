import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import { closeButtonImage } from '@common/image'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import RoundButton from '@components/general/roundButton'
import CheckButton from '@components/general/checkButton'
import DateTimePicker from 'react-native-modal-datetime-picker';
import AvatarSelector from '@components/auth/avatarSelector'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import UtilService from "@utils/utils";
const { width: screenWidth } = Dimensions.get('window')
import moment from 'moment'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Global from "@utils/global";
import * as cotravellerAction from '@store/cotraveller';
import * as commonAction from '@store/common';
import { Ionicons } from '@expo/vector-icons'
import { getCountryCallingCode } from 'libphonenumber-js'
import {
    Select,
    Option,
    OptionList,
    updatePosition
} from '@react-native-dropdown'

const { T1, T2 } = Global.Translate

const PHONE_NUM_INDEX = 6
const OTP_NUM_INDEX = 8

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

class EditTraveler extends PureComponent {
    constructor(props) {
        super(props)

        this.currentUser = this.props.coTraveler || {
            "anniversaryDate": null,
            "birthDate": null,
            "contactInformation": {
                "email": "",
                "phoneNumber": "",
                "phoneNumberCountryCode": getCountryCallingCode(Global.environment.portalCountry.code),
            },
            "firstName": "",
            "lastName": "",
            "gender": "M",
            "genderDesc": "Male",
            "location": {
                "country": Global.environment.portalCountry.name,
                "countryID": Global.environment.portalCountry.code
            }
        }
        if (this.currentUser.anniversaryDate != null &&
            (new Date(this.currentUser.anniversaryDate)).getFullYear() < 1000) this.currentUser.anniversaryDate = null
        if (this.currentUser.birthDate != null &&
            (new Date(this.currentUser.birthDate)).getFullYear() < 1000) this.currentUser.birthDate = null
        this.mode = this.props.coTraveler ? 'edit' : 'create'
        let formData = [
            { title: 'First Name *', value: this.currentUser.firstName },
            { title: 'Last Name *', value: this.currentUser.lastName },
            { title: 'Email *', value: this.currentUser.contactInformation.email },
            { title: 'Mobile Number', value: this.currentUser.contactInformation.phoneNumber }
        ]

        var countryCode = this.currentUser.contactInformation.phoneNumberCountryCode
        if (countryCode && countryCode.startsWith('+')) {
            countryCode = countryCode.substr(1)
        }
        this.validCountries = getAllCountries()
            .filter(country => country.callingCode)
            .map(country => country.cca2)
        var country = getAllCountries().find(t => t.cca2 == this.currentUser.location.countryID)
        this.state = {
            formData,
            gender: this.currentUser.genderDesc,
            countryName: country.name.common,
            cca2: this.currentUser.location.countryID,
            phoneCode: countryCode,
            anniversaryDate: this.currentUser.anniversaryDate,
            birthDate: this.currentUser.birthDate,
            isDisabled: this.mode?true:false,
        }
        this.inputs = []
    }

    validate() {
        console.log(this.state)
        let { formData, birthDate } = this.state
        formData[0].isError = !formData[0].value
        formData[1].isError = !formData[1].value
        formData[2].isError = !formData[2].value
        formData[3].isError = !formData[3].value

        this.setState({
            formData,
            isDisabled: formData[0].isError || formData[1].isError || formData[3].isError || !birthDate
        })
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.mode=='edit'?'Edit Co-Traveler':'Add Co-Traveler',
            notifications: 3,
        });
        this.validate()
    }

    _showDateTimePicker = (type) => this.setState({ isDateTimePickerVisible: true, pickerType: type });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        if (this.state.pickerType == 0) {
            this.setState({
                birthDate: date
            }, ()=>this.validate())
        } else {
            this.setState({
                anniversaryDate: date
            })
        }
        this._hideDateTimePicker();
        
    };

    async save() {
        let { formData, cca2, gender, birthDate, anniversaryDate, phoneCode } = this.state

        this.validate()

        let firstName = formData[0].value
        let lastName = formData[1].value
        //let email = formData[2].value
        let phoneNumber = formData[3].value

        gender = gender == 'Male' ? 'M' : 'F'

        //check validation
        if (!firstName || !lastName || !cca2 || !birthDate) {
            return
        }

        //send data
        var userData = {}
        userData = JSON.parse(JSON.stringify(this.currentUser))
        userData = { ...userData, firstName, lastName, birthDate, anniversaryDate, gender }
        userData.location.countryID = cca2
        userData.contactInformation = {
            phoneNumber,
            phoneNumberCountryCode: phoneCode,
            //email
        }

        console.log('userData', userData)

        if (this.mode == 'create') {
            this.props.actions.create(userData).then(({ error, result }) => {
                if (error) {
                    alert(error.message)
                    return
                }
                this.props.commonAction.showToast('Co-Traveler saved successfully.')
                this.props.actions.getCoTravelers()
                Actions.pop()
            })
        } else {
            this.props.actions.update(userData).then(({ error, result }) => {
                if (error) {
                    alert(error.message)
                    return
                }
                this.props.commonAction.showToast('Co-Traveler updated successfully.')
                this.props.actions.getCoTravelers()
                Actions.pop()
            })
        }
    }

    delete() {
        var userData = {}
        userData = JSON.parse(JSON.stringify(this.currentUser))

        console.log('userData', userData)
        this.props.actions.deleteCoTraveler(userData).then(({ error, result }) => {
            if (error) {
                alert(error.message)
                return
            }
            this.props.commonAction.showToast('Co-Traveler deleted successfully.')
            this.props.actions.getCoTravelers()
            Actions.pop()
        })
    }

    changeCountry(value) {
        this.setState({
            cca2: value.cca2,
            callingCode: value.callingCode,
            countryName: value.name
        })
    }

    renderCountryCode() {
        return (
            <CountryPicker
                filterable
                closeable
                autoFocusFilter
                showCallingCode={true}
                onChange={(value) => { this.setState({ phoneCode: value.callingCode }) }}
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

    onChangeGener(gender) {
        this.setState({ gender })
    }
    _getOptionList() {
        return this.refs['OPTIONLIST'];
    }
    componentDidMount() {
        updatePosition(this.refs['SELECT1']);
        updatePosition(this.refs['OPTIONLIST']);
    }

    render() {
        let { formData, birthDate, anniversaryDate, gender, isDisabled } = this.state
        let { status } = this.props.cotraveller
        return (
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                    <Text style={{ fontSize: 10, color: '#999', marginTop: 10 }}>Gender *</Text>
                    <Select
                        style={styles.genderContainer}
                        styleText={{ color: Color.primary, fontSize: 16 }}
                        styleOption={{ padding: 0, height: 28 }}
                        width={screenWidth - 40}
                        ref="SELECT1"
                        optionListRef={this._getOptionList.bind(this)}
                        defaultValue={gender}
                        onSelect={this.onChangeGener.bind(this)}>
                        <Option>Male</Option>
                        <Option>Female</Option>
                    </Select>
                    <OptionList ref="OPTIONLIST" />
                    <View style={{ height: 5 }} />
                    <View style={styles.lowLevel}>
                        {formData.map((item, index) => {
                            if ( item.title=="Email *") return null
                            return (
                                <View key={index} style={styles.inputContainer}>
                                    {item.title == 'Mobile Number' && this.renderCountryCode()}
                                    <FloatLabelTextInput
                                        ref={e => this.inputs[index] = e}
                                        placeholder={item.title}
                                        placeholderTextColor={Color.lightText}
                                        style={styles.input}
                                        value={item.value}
                                        onChangeText={(text) => {
                                            item.value = text
                                            this.setState({ formData: [...formData] })
                                            this.validate()
                                        }}
                                        isError={item.isError}
                                        onSubmitEditing={() => index < 6 ? this.inputs[index + 1].focus() : {}}
                                    />
                                </View>
                            )
                        })}
                        <CountryPicker
                            filterable
                            closeable
                            autoFocusFilter
                            styles={countryPicker}
                            onChange={(value) => this.changeCountry(value)}
                            cca2={this.state.cca2}
                            countryList={this.validCountries}
                            translation="eng"
                        >
                            <View style={styles.countryPicker}>
                                {this.state.countryName == '' && <Text style={styles.countryPickerText1}>Select a country</Text>}
                                {this.state.countryName != '' && <Text style={styles.label}>Select a country</Text>}
                                {this.state.countryName != '' && <Text style={styles.countryPickerText2}>{this.state.countryName}</Text>}
                            </View>
                        </CountryPicker>
                        <TouchableOpacity onPress={() => this._showDateTimePicker(0)} style={styles.dateContainer}>
                            <Text style={styles.smallTitle}>Birth Date *</Text>
                            <Text style={styles.valueText}>{birthDate ? moment(birthDate).format(Global.dateFormat) : 'Select a date'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._showDateTimePicker(1)} style={styles.dateContainer}>
                            <Text style={styles.smallTitle}>Anniversary Date</Text>
                            <Text style={styles.valueText}>{anniversaryDate ? moment(anniversaryDate).format(Global.dateFormat) : 'Select a date'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inlineButtons}>
                        <RoundButton
                            title={this.mode == 'create' ? "Add" : 'Save'}
                            isLoading={status == cotravellerAction.LOADING}
                            onPress={() => this.save()}
                            disabled={isDisabled}
                            disabledUI={isDisabled}
                            style={styles.button}
                            textStyle={styles.buttonText}
                        />
                        {/* {this.mode != 'create' && <RoundButton
                            title={'Delete'}
                            onPress={() => this.delete()}
                            style={styles.button}
                            textStyle={styles.buttonText}
                        />} */}
                    </View>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ cotraveller }) => ({ cotraveller });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cotravellerAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
});

export default EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditTraveler);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    inputContainer: {
        height: 50,
        width: '100%',
        flexDirection: 'row'
    },
    input: {
        color: Color.primary
    },
    button: {
        marginTop: 30,
        flex:1,
        marginHorizontal:10,
    },
    buttonText: {
        fontWeight: 'bold'
    },
    termsContainer: {
        flexDirection: 'row',
        marginTop: 30,
    },
    termsText: {
        color: Color.text,
        fontSize: 14,
        marginLeft: 10
    },
    linkText: {
        color: Color.orange,
        fontWeight: 'bold'
    },
    avatarContainer: {
        height: 120,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    countryPicker: {
        width: '100%',
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: Color.border,
        justifyContent: 'center',
        backgroundColor: 'white'
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
    countryPickerText1: {
        color: Color.lightText,
        fontSize: 18
    },
    countryPickerText2: {
        color: Color.primary,
        fontSize: 18
    },
    label: {
        fontSize: 10,
        color: Color.lightText,
    },
    phoneCodeText: {
        fontSize: 18,
        color: Color.primary,
        flex: 1,
    },
    lowLevel: {
        zIndex: -1
    },
    genderContainer: {
        justifyContent: 'center',
        borderWidth: 0,
        borderBottomWidth: 0.5,
    },
    dateContainer: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
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
    inlineButtons: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})