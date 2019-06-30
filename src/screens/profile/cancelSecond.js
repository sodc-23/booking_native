import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Alert,
} from 'react-native'


import { FontAwesome } from '@expo/vector-icons'
import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import CheckButton from '@components/general/checkButton'
import moment from 'moment';
import { BOOKING_DETAIL } from '@store/cart/actionTypes';
import Marquee from '@components/general/react-native-text-ticker'
import Global from "@utils/global";

import PhoneInputer from '@components/general/phoneInputer'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import { Actions } from 'react-native-router-flux';
import UtilService from '@utils/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import { parsePhoneNumber, getCountryCallingCode } from 'libphonenumber-js'

import {
    DateItem,
    DescItem,
    DropBoxItem,
    MobileNumItem,
    OrangeTitle,
    LeftSwitchItem,
    RightSwitchItem,
    TextItem,
    TimeItem,
    TitleItem,
    TouchItem
} from '@components/general/bookingInput/inputItems'

const { T1, T2 } = Global.Translate

const Item = ({ title, value }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.delimiter}>:</Text>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
)

const NoTitleItem = ({value})=>(
    <View style={styles.itemContainer}>
        <FontAwesome name="circle" size={5} color={Color.primary} style={{width:10}}/>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
)

class CancelSecondC extends PureComponent {
    constructor(props) {
        super(props)
        let { bookDetail } = this.props
        let {travellerDetails} = bookDetail
        let leadPassenger = travellerDetails.find((o)=>o.isMainPax)

        this.state = {
                skype:'',
                email: leadPassenger.details.contactInformation.email,
                comment: '',
                cellPhone: { 
                    code: UtilService.withoutSign(leadPassenger.details.contactInformation.phoneNumberCountryCode)||getCountryCallingCode(Global.environment.portalCountry.code), 
                    number: leadPassenger.details.contactInformation.phoneNumber||'' 
                },
                fax:'',
                shortDescription:'HOTEL',
                referenceNo:'aa1110-123',
                isAgreed:false,
                showError:false
        }
    }
    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Cancel Request',
        });
    }

    sendRequest(){
        this.setState({showError:true})
        let {cellPhone:{code, number}, fax, comment, email, skype, isAgreed} = this.state
        if ( (number && number.isValidPhoneNumber() != null) ||  email.isValidEmail()!=null || comment ==''){
            return;
        }
        if (!this.state.isAgreed) {
            alert('Please accept the Terms and Conditions.')
            return;
        }
        let {bookDetail} = this.props
        var request = {
            "bookingRefNo": bookDetail.bookingRefNo, //"270-176671",
            "businessShortDescription" : bookDetail.businessShortDescription,
            "comment" : comment,
            "phone": code + number,
            "fax" : fax,
            "email" : email,
            "skype" : skype,
            "itineraryRefNo" : bookDetail.itineraryRefNo //"TC0917-AA00308"
        }

        this.props.actions.cancelBookingRequest(request).then(({error, result})=>{
            console.log('cancelBookingRequest', error, result)
            if(result)
                Actions.SuccessReservation()
        })
    }

    render() {
        let { cellPhone, fax, comment, email, skype, isAgreed, showError } = this.state
        let {bookDetail} = this.props
        return (
            <ScrollView>
                <View style={styles.groupContent}>
                    <Item title={"Booking\nReference\nNumber"} value={bookDetail.bookingRefNo} />
                    <Item title="Itinerary Number" value={bookDetail.itineraryRefNo} />

                    <TextItem
                        title="Email"
                        onChange={text => this.setState({ email: text })}
                        value={email}
                        isMandatory
                        showError={showError}
                        errorMsg={str => str.isValidEmail()}
                    />

                    <MobileNumItem
                        title="Cell Phone"
                        value={cellPhone}
                        onChange={value=>this.setState({cellPhone:value})}
                    />
                    <TextItem
                        title="Skype ID"
                        onChange={text => this.setState({ skype: text })}
                        value={skype}
                    />
                    <TextItem
                        title="Fax"
                        onChange={text => this.setState({ fax: text })}
                        value={fax}
                    />
                    <TextItem
                        title="Comment"
                        onChange={text => this.setState({ comment: text })}
                        value={comment}
                        multiline
                        isMandatory
                        errorMsg={'Please enter Comment.'}
                        style={{ height: 100 }}
                        containerStyle={{height:undefined}}
                        innerStyle={{paddingTop:10}}
                        showError={showError}
                    />
                    {/* <FloatLabelTextInput
                        ref='email'
                        placeholder='Email *'
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={email}
                        onChangeText={(email) => {
                            this.setState({email})
                        }}
                        isError={!email}
                        onSubmitEditing={() => this.refs.skype.focus()}
                    />
                    <PhoneInputer
                        ref2={e => this.phone = e}
                        phoneCode={phoneCode}
                        onChangeCountryCode={phoneCode => this.setState({ phoneCode })}
                        placeholder={'Cell Phone'}
                        phoneNumber={phoneNumber}
                        onChangePhoneNumber={(phoneNumber) => {
                            this.setState({phoneNumber})
                        }}
                        onSubmitEditing={() => this.refs.email.focus()}
                    />
                    <FloatLabelTextInput
                        ref='skype'
                        placeholder='Skype ID'
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={skype}
                        onChangeText={(skype) => {
                            this.setState({skype})
                        }}
                        onSubmitEditing={() => this.phone.focus()}
                    />
                    
                    <FloatLabelTextInput
                        ref='fax'
                        placeholder='Fax'
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={fax}
                        onChangeText={(fax) => {
                            this.setState({fax})
                        }}
                        // isError={!fax || fax.length < 2}
                        onSubmitEditing={() => this.refs.comment.focus()}
                    />
                    <FloatLabelTextInput
                        ref='comment'
                        placeholder='Comment'
                        placeholderTextColor={Color.lightText}
                        style={[styles.input, {height:100}]}
                        containerStyle={{height:undefined}}
                        innerStyle={{paddingTop:10}}
                        multiline
                        value={comment}
                        onChangeText={(comment) => {
                            this.setState({comment})
                        }}
                        // isError={!comment || comment.length < 2}
                    /> */}
                    <View style={styles.termsContainer}>
                            <CheckButton
                                value={isAgreed}
                                onPress={() => this.setState({ isAgreed: !this.state.isAgreed })}
                            />
                            <Text style={styles.termsText}>
                                I have READ and AGREED to all the
                            <Text onPress={() => {}} style={styles.linkText}> Terms and Conditions </Text>
                            </Text>
                        </View>
                    <RoundButton
                        title="Send Request"
                        onPress={() => {this.sendRequest()}}
                        textStyle={styles.buttonText}
                    />
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = ({  }) => ({ });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartAction }, dispatch),
});

export default CancelSecond = connect(mapStateToProps, mapDispatchToProps)(CancelSecondC);

const styles = StyleSheet.create({
    container: {
        padding:15,
        
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 5,
    },
    itemTitle: {
        fontSize: 12,
        color: Color.text,
        flex: 1
    },
    delimiter: {
        fontSize: 12,
        color: Color.text,
    },
    itemValue: {
        color: Color.primary,
        fontSize: 12,
        flex: 2,
        marginLeft: 20
    },
    groupTitleContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 40
    },
    groupTitleText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Color.lightText
    },
    buttonText: {
        fontWeight: 'bold'
    },
    groupContent:{
        padding:15,
        backgroundColor: 'white'
    },
    termsContainer: {
        flexDirection: 'row',
        marginVertical: 30,
    },
    termsText: {
        color: Color.text,
        fontSize: 14,
        marginLeft: 10
    },
    linkText: {
        color: Color.text,
        fontWeight: 'bold'
    },
    input: {
        color: Color.primary,
        zIndex: -1
    },
})