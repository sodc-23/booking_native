import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'

import AvatarSelector from '@components/auth/avatarSelector'
import MenuItem from '@components/auth/menuItem'
import Color from '@common/color'
import { Ionicons } from '@expo/vector-icons'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authAction from '@store/auth';
import * as commonAction from '@store/common';
import * as userAction from '@store/user';
import * as langAction from '@store/language';
import * as hotelAction from '@store/hotel';
import { getAllCountries } from 'react-native-country-picker-modal'
import DropDownItem from '@hotel_filter/RadioSelector'
import Global from "@utils/global";
import base64 from 'base64-js'
import { FileSystem } from 'expo'
import UtilService from '@utils/utils';
import LanguageModal from '@components/profile/languageModal'
import * as config from '../../config'

class ProfileC extends PureComponent {
    constructor(props) {
        super(props)
        this.languages = Global.environment.availableLanguages.map(o => o.cultureName.split('-')[0])
        //console.log('this.languages', this.languages)
        this.languageOptions = this.languages.map(o => UtilService.getLangName(o))
        //console.log('this.languageOptions', this.languageOptions)
        //const countryCodeIndex={'en':0, 'mm':1, 'my':2}
        let index = this.languages.indexOf(Global.language)
        if (index < 0) index = 0
        this.currencies = Global.environment.availableCurrencies.map((item) => item.isoCode)
        this.state = {
            avatar: '',
            groups: [
                {
                    title: 'profile settings',
                    menus: [
                        { title: 'my profile', value: '', type: 'menu' },
                        { title: 'change password', value: '', type: 'menu' },
                        { title: 'my booking', value: '', type: 'menu' },
                        { title: 'co-travelers', value: '', type: 'menu' },
                    ]
                },
                {
                    title: 'general settings',
                    menus: [
                        { title: 'language', value: this.languageOptions[index], type: 'menu' },
                        { title: 'notification', value: false, type: 'switch' },
                        // { title: 'Currency', index: this.currencies.indexOf(Global.currency), options:this.currencies, type: 'menu' }
                    ]
                },
                {
                    title: 'support',
                    menus: [
                        // { title: 'Help and Info', value: '', type: 'menu' },
                        { title: 'about us', value: '', type: 'menu' },
                        { title: 'about app', value: '', type: 'menu' },
                        { title: 'ledger balance', value: '', type: 'menu' }
                    ]
                },
            ]
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps){
        if ( nextProps.language.lang != this.props.language.lang ){
            Actions.refresh()
        }
    }

    onChange(menu, groupIndex, menuIndex) {
        if (groupIndex == 0) {
            switch (menuIndex) {
                case 0:
                    Actions.MyProfile1()
                    break;
                case 1:
                    Actions.ChangePassword()
                    break;
                case 2:
                    Actions.MyBookings()
                    break;
                case 3:
                    Actions.CoTraveler()
                    break;
            }
        }
        if (groupIndex == 1) {
            switch (menuIndex) {
                case 0:
                    this.languageModal.show()
                    break;
                case 1:
                    menu.value = !menu.value
                    this.setState({ groups: [...this.state.groups] })
                    break;
            }
        }
        if (groupIndex == 2) {
            switch (menuIndex) {
                case 0:
                    Actions.AboutUs()
                    break;
                case 1:
                    Actions.AboutApp()
                    break;
                case 2:
                    Actions.LedgerBalance()
                    break;
            }
        }
    }

    logout() {
        this.props.actions.logout((err, res) => {
            if (err == null) {
                this.props.hotelAction.recentSearch()
                this.props.commonAction.showToast('You have been logged out')
            }

        })

    }

    async updateProfileImage(avatar) {
        console.log('avatar', avatar)
        let { currentUser } = this.props.auth

        try {
            const content = await FileSystem.readAsStringAsync(avatar, { encoding: FileSystem.EncodingTypes.Base64 })
            var newProfile = JSON.parse(JSON.stringify(currentUser))
            newProfile.profilePicture = {
                'url': 'avatar.jpg',
                'RawData': content
            }

            this.props.userAction.updateUser(newProfile).then(({ error, result }) => {
                console.log('update user', error, result)
                if (!error) {
                    this.props.actions.getUserProfile()
                }
            })
        } catch (e) {
            console.log('fileToBase64()', e.message)
        }
    }

    render() {
        let { name, location, email, language:{T1, T2} } = this.props
        let { currentUser, isLoggedIn } = this.props.auth
        if (!isLoggedIn || !currentUser) {
            Actions.replace('Login')

            return null
        }
        const userCountryData = currentUser.location ? getAllCountries()
            .filter(country => country.cca2 === currentUser.location.countryID)
            .pop() : ''
        var profileUrl = currentUser.profilePicture ? currentUser.profilePicture.url : ''

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <AvatarSelector
                            url={profileUrl}
                            onChange={avatar => this.updateProfileImage(avatar)}
                        />
                        <View style={styles.headerContent}>
                            <Text style={styles.name}>{`${currentUser.firstName || ''} ${currentUser.lastName || ''}`}</Text>
                            {userCountryData && <Text style={styles.location}>
                                <Ionicons name="ios-pin" size={14} color={Color.middlePrimary} style={styles.icon} />
                                {'  ' + userCountryData.name.common}
                            </Text>}
                            <Text style={styles.email}>
                                <Ionicons name="ios-mail" size={14} color={Color.middlePrimary} style={styles.icon} />
                                {' ' + currentUser.contactInformation.email}
                            </Text>
                        </View>
                    </View>

                    {this.state.groups.map((group, index) => (
                        <View key={index} style={styles.groupContainer}>
                            <View style={styles.groupTitleContainer}>
                                <Text style={styles.groupTitleText}>{T2(group.title).toProperCase()}</Text>
                            </View>
                            {group.menus.map((menu, idx) =>
                                <MenuItem
                                    key={idx}
                                    {...menu}
                                    title={T2(menu.title).toProperCase()}
                                    onChange={() => this.onChange(menu, index, idx)}
                                />
                            )}
                        </View>
                    ))}
                    <View style={styles.logoutContainer}>
                        <Text onPress={() => this.logout()} style={styles.logoutText}>{T1('logout')}</Text>
                    </View>
                </ScrollView>
                <LanguageModal
                    ref={e => this.languageModal = e}
                    onChange={(index) => {
                        this.state.groups[1].menus[0].value = this.languageOptions[index]
                        this.setState({ groups: [...this.state.groups] })

                        this.props.langAction.setLang(this.languages[index])
                        UtilService.saveLocalStringData('language', this.languages[index])
                    }}

                />
            </View>
        )
    }
}
const mapStateToProps = ({ auth, language }) => ({ auth, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch),
    userAction: bindActionCreators({ ...userAction }, dispatch),
    langAction: bindActionCreators({ ...langAction }, dispatch),
    hotelAction: bindActionCreators({ ...hotelAction }, dispatch)
});

export default Profile = connect(mapStateToProps, mapDispatchToProps)(ProfileC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    location: {
        fontSize: 15,
        color: Color.darkText,
        marginTop: 3,
        // fontWeight: 'bold'
    },
    email: {
        fontSize: 15,
        color: Color.darkText,
        marginTop: 3,
        // fontWeight: 'bold'
    },
    headerContent: {
        marginLeft: 30
    },
    name: {
        fontSize: 24,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        width: 40,
    },
    groupContainer: {
    },
    groupTitleContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 40,
        marginBottom: 10
    },
    groupTitleText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Color.lightText
    },
    logoutContainer: {
        height: 50,
        justifyContent: 'center'
    },
    logoutText: {
        color: Color.orange,
        fontSize: 16,
        marginLeft: 20,
    }
})