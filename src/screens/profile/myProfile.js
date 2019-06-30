import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native'

import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authAction from '@store/auth';
import * as commonAction from '@store/common';
import * as userAction from '@store/user';
import * as langAction from '@store/language';
import moment from 'moment';
import UtilService from '@utils/utils';

const ProgressBar = ({ title, percent }) => (
    <View>
        <View style={styles.progressBarTitleContainer}>
            <Text style={styles.primary}>{title}</Text>
            <Text style={styles.primary}>{percent}%</Text>
        </View>
        <View style={styles.progressBar}>
            <View style={[styles.percentProgressBar, { width: percent + '%' }]} />
        </View>
    </View>
)

const ProfileItem = ({ title, value }) => (
    <View style={styles.profileItemContainer}>
        <Text style={[styles.lightText, { width: 110 }]}>{title}</Text>
        <Text style={styles.lightText}>{':  '}</Text>
        <Text style={styles.primary}>{value}</Text>
    </View>
)

class MyProfileC extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            percent: 81,
            profileItems: [
                { title: 'Gender', value: 'Male' },
                { title: 'Name', value: 'John Smith' },
                { title: 'Surname', value: '-' },
                { title: 'Birthdate', value: '15/07/2017' },
                { title: 'Anniversary Date', value: '-' },
                { title: 'Email', value: 'emailaddress@domain.com' },
                { title: 'City/Country', value: 'Myanmar' },
                { title: 'Address', value: '301, street name, area, city' },
                { title: 'Zip Code', value: '12345' },
                { title: 'Nationality', value: 'Myanmar' },
                { title: 'Tel', value: '12345678' },
            ]
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: ()=>Actions.Notifications(),
            notifications: 3,
        });
    }

    getPercent(user) {
        var percent = 0
        if(user.gender) percent+=8
        if(user.firstName) percent+=9
        if(user.lastName) percent+=9
        if(user.birthDate) percent+=8
        if(user.anniversaryDate) percent+=8
        if(user.location.city) percent+=8
        if(user.location.countryID) percent+=8
        if(user.location.zipCode) percent+=8
        if(user.location.address) percent+=8
        if(user.nationalityCode) percent+=8
        if(user.contactInformation.phoneNumber) percent+=9
        if(user.contactInformation.email) percent+=9

        return percent
    }

    render() {
        let { percent, profileItems } = this.state
        let { currentUser, isLoggedIn } = this.props.auth
        if(currentUser.anniversaryDate == '0001-01-01T00:00:00') currentUser.anniversaryDate = null
        if(currentUser.birthDate == '0001-01-01T00:00:00') currentUser.birthDate = null

        let {T3} = this.props.language
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <ProgressBar
                        title={T3("Completed Profile")}
                        percent={this.getPercent(currentUser)}
                    />
                    <ProfileItem title={T3("Gender")} value={currentUser.genderDesc}></ProfileItem>
                    <ProfileItem title={T3("Name")} value={currentUser.firstName}></ProfileItem>
                    <ProfileItem title={T3("Surname")} value={currentUser.lastName}></ProfileItem>
                    <ProfileItem title={T3("Birth date")} value={currentUser.birthDate?moment(currentUser.birthDate).format('DD/MM/YYYY'):''}></ProfileItem>
                    <ProfileItem title={T3("Anniversary Date")} value={currentUser.anniversaryDate?moment(currentUser.anniversaryDate).format('DD/MM/YYYY'):''}></ProfileItem>
                    <ProfileItem title={T3("Email")} value={currentUser.contactInformation.email}></ProfileItem>
                    <ProfileItem title={T3("City/Country")} value={currentUser.location.city? currentUser.location.city + ', ' + UtilService.getCountryName(currentUser.location.countryID) : UtilService.getCountryName(currentUser.location.countryID)}></ProfileItem>
                    <ProfileItem title={T3("Address")} value={currentUser.location.address}></ProfileItem>
                    <ProfileItem title={T3("Zip Code")} value={currentUser.location.zipCode}></ProfileItem>
                    <ProfileItem title={T3("Nationality")} value={UtilService.getCountryName(currentUser.nationalityCode)}></ProfileItem>
                    <ProfileItem title={T3("Tel")} value={currentUser.contactInformation.actlFormatPhoneNumber}></ProfileItem>
                    <View style={styles.buttonContainer}>
                        <RoundButton
                            title={T3("Edit Profile")}
                            style={{ height: 40 }}
                            textStyle={{ fontWeight: 'bold' }}
                            onPress={() => { Actions.EditProfile()}}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const mapStateToProps = ({ auth, user, language }) => ({ auth, user, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch),
    userAction: bindActionCreators({ ...userAction }, dispatch),
});

export default MyProfile = connect(mapStateToProps, mapDispatchToProps)(MyProfileC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    progressBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc'
    },
    percentProgressBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: Color.lightPrimary
    },
    progressBarTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    primary: {
        fontSize: 12,
        color: Color.primary,
    },
    lightText: {
        fontSize: 12,
        color: Color.lightText
    },
    profileItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        height: 40,
        width: '100%'
    },
    buttonContainer:{
        marginTop:20,
        paddingHorizontal:30
    }
})