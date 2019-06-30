import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'

import PhoneInputer from '@components/general/phoneInputer'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import Color from '@common/color'
import Global from "@utils/global";
import { Actions } from 'react-native-router-flux'
const { T1, T2 } = Global.Translate
import TwoButtonModal from '@components/home/twoButtonModal';
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

export default class Modify extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            skype: '',
            cellPhone:{code:'', number:''},
            email: '',
            comment: '',
            fax: '',
            shortDescription: 'HOTEL',
            referenceNo: 'aa1110-123'
        }
    }
    componentWillMount() {
        this.props.navigation.setParams({
            onRight: this.done.bind(this),
            rightTitle: 'DONE',
        });
    }
    done() {

    }
    render() {
        let { cellPhone, fax, comment, email, skype, shortDescription, referenceNo } = this.state
        return (
            <ScrollView style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>{shortDescription} - {referenceNo}</Text>
                </View>
                <View style={styles.textView}>
                    {/* <Text style={styles.desc}>Please fill the names of the Traveler(s) as they officially appear on Identification or passports.</Text> */}


                    <View style={styles.underLayout}>
                        <TextItem
                            title="Email"
                            onChange={text=>this.setState({email:text})}
                            value={email}
                            isMandatory
                            showError={showError}
                            errorMsg={str=>str.isValidEmail()}
                        />
                        <TextItem
                            title="Skype"
                            onChange={text=>this.setState({skype:text})}
                            value={skype}
                        />
                        <MobileNumItem
                            title="Cell Phone"
                            value={cellPhone}
                            isMandatory
                            showError={showError}
                            errorMsg={value=>value.number.isValidPhoneNumber()}
                        />
                        <TextItem
                            title="Fax"
                            onChange={text=>this.setState({fax:text})}
                            value={fax}
                        />
                        <TextItem
                            title="Comment"
                            onChange={text=>this.setState({comment:text})}
                            value={comment}
                        />
                    </View>

                    <TwoButtonModal
                        ref={e => this.myModal = e}
                        title={'Cancellation Charges'}
                        buttons={[
                            { title: 'Abort', onPress: () => this.myModal.hide() },
                            { title: 'Confirm', onPress: () => this.myModal.hide() }
                        ]}
                        // items={[
                        //     {title:32, value:'Dhruvin Doshi'},
                        //     {title:14, value:'Kalpesh Patil'}
                        // ]}
                        items={[
                            { title: 'Cancellation Charge', value: '$0' },
                            { title: 'Discount Cancelled', value: '$0' },
                            { title: 'Refund Amount', value: '$149' },
                            { title: 'Refund Fee', value: '$0' },
                        ]}
                        type={1}
                    >
                    </TwoButtonModal>

                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
    }
})