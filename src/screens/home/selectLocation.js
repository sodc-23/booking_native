import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    StatusBar,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { Location, Permissions } from 'expo';
import { Actions } from 'react-native-router-flux';
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import { location } from '@common/image'
import GroupTitle from '@components/home/groupTitle'
import LocationItem from '@components/home/locationItem'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import UtilService from "@utils/utils";
import Global from "@utils/global";
import _ from 'underscore'
// const { T1, T2 } = Global.Translate

class SelectLocationC extends PureComponent {
    constructor(props) {
        super(props)
        StatusBar.setBarStyle('light-content')
        this.state = {
            searchString: '',
            locationResults: [],
            isSearching: true,
            afterSearch: false
        }
        this.oldRequest = null
        this.searchEmpty()
    }
    componentWillMount() {
        const {T2} = this.props.language
        if (this.props.title) {
            this.props.navigation.setParams({
                title:T2(this.props.title)
            });
        }
    }
    componentDidMount() {
        setTimeout(() => this.input.focus(), 500)
    }
    clickItem(item) {
        let { business, field, index } = this.props
        this.props.actions[business].selectLocation({
            location: item,
            type: field,
            index
        })
        Actions.pop()
    }
    searchEmpty() {
        let { business, field } = this.props
        this.props.actions[business].searchLocations("", null, null).then(({error, result})=>{
            this.setState({
                locationResults: _.filter(result, (o => o.type == 'recentlocations')),
                isSearching: false
            })    
        })
    }
    search(text) {
        let { business, field } = this.props
        let { selectedFromLocation } = this.props[business]
        this.setState({ searchString: text })

        if (text && text.length > 0) {
            this.searchText = text
            setTimeout(() => {
                if (text == this.searchText) {
                    this.setState({
                        isSearching: true,
                        afterSearch: true,
                    })
                    this.props.actions[business].searchLocations(text, null, field == 'toLocation' ? selectedFromLocation : null).then(({ error, result, query }) => {
                        if (query == this.searchText) {
                            this.setState({
                                locationResults: result,
                                isSearching: false
                            })
                        }
                    })
                }
            }, 300)
        }
    }
    searchLocationByQuery(e) {
        let { business, field } = this.props
        let { selectedFromLocation } = this.props[business]
        let { searchString } = this.state
        if (searchString) {
            this.searchText = searchString
            this.setState({
                isSearching: true,
                afterSearch: true
            })
            this.props.actions[business].searchLocations(searchString, null, field == 'toLocation' ? selectedFromLocation : null).then(({ error, result, query }) => {
                if (query == this.searchText) {
                    this.setState({
                        isSearching: false,
                        locationResults: result
                    })
                }
            })
        }
    }

    async searchByLocation() {
        let { business, field } = this.props
        let { selectedFromLocation } = this.props[business]
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log('location', location)
        let { searchString } = this.state
        this.searchText = searchString
        this.setState({
            isSearching: true,
            afterSearch: true,
        })
        this.props.actions[business].searchLocations(searchString, location.coords, field == 'toLocation' ? selectedFromLocation : null).then(({ error, result, query }) => {
            if (query == this.searchText) {
                this.setState({
                    isSearching: false,
                    locationResults: result
                })
            }
        })
    }

    render() {
        let { business } = this.props
        let { status } = this.props[business]
        let { locationResults, isSearching, afterSearch } = this.state
        locationResults = locationResults || []

        const getName = (sourceName) => {
            return sourceName //.substr(0, sourceName.lastIndexOf('-') - 1)
        }
        const {T2} = this.props.language

        let resultCount = _.filter(locationResults, (o => o.type != 'recentlocations')).length
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Ionicons name="ios-search" size={20} color={'black'} />
                    <TextInput
                        ref={e => this.input = e}
                        autoCapitalize="none"
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                        value={this.state.searchString}
                        style={styles.input}
                        onSubmitEditing={this.searchLocationByQuery.bind(this)}
                        returnKeyType='search'
                        onChangeText={(text) => this.search(text)}
                    />
                </View>
                <TouchableOpacity style={styles.currentContainer} onPress={this.searchByLocation.bind(this)}>
                    <Image source={location} style={styles.locationIcon} />
                    <Text style={styles.currentText}>{T2('Use current location')}</Text>
                </TouchableOpacity>
                {isSearching && <ActivityIndicator size="large" color={Color.primary} style={{ flex: 1 }} />}
                {!isSearching && <ScrollView keyboardShouldPersistTaps='always'>

                    {
                        _.sortBy(locationResults, o => o.type == 'recentlocations' ? 1 : 0).map((locationResult, index) => {
                            if (locationResult.item == null || locationResult.item.length == 0) return null;
                            //if(locationResult.type == 'recentlocations' && business != 'hotel') return null
                            return (<View key={index}>
                                <GroupTitle title={locationResult.type == 'recentlocations' ? T2('latest search').toProperCase() :
                                    T2(UtilService.capitalizeFirstLetter(locationResult.type).toLowerCase()).toProperCase()} />
                                <View style={styles.groupContainer}>
                                    {locationResult.item.map((item, index) => <LocationItem key={index}
                                        location={UtilService.decodeHtmlEntity((business == 'air') ? item.address : item.name)}
                                        group={UtilService.capitalizeFirstLetter(locationResult.type)}
                                        onPress={() => this.clickItem(item)} />)}
                                </View>
                            </View>)
                        })
                    }
                    {resultCount == 0 && afterSearch && <Text style={styles.noLocationText}>{T2('No inventory available at this location.')}</Text>}
                </ScrollView>}
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, activity, vehicle, transfers, air, bus, packages, language }) =>
    ({ hotel, activity, vehicle, transfers, air, bus, package:packages, language });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        hotel: bindActionCreators({ ...hotelAction }, dispatch),
        activity: bindActionCreators({ ...activityAction }, dispatch),
        vehicle: bindActionCreators({ ...vehicleAction }, dispatch),
        transfers: bindActionCreators({ ...transferAction }, dispatch),
        air: bindActionCreators({ ...airAction }, dispatch),
        bus: bindActionCreators({ ...busAction }, dispatch),
        package: bindActionCreators({ ...packagesAction }, dispatch),
    }
});

export default SelectCommonLocation = connect(mapStateToProps, mapDispatchToProps)(SelectLocationC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: Color.border,
        alignItems: 'center',
        height: 40,
        marginHorizontal: 20,
        marginTop: 10
    },
    input: {
        marginLeft: 10,
        flex: 1,
        color: Color.text,
        fontSize: 14
    },
    currentText: {
        marginLeft: 10,
        color: Color.orange,
        fontSize: 14,
    },
    locationIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    currentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        marginHorizontal: 20,
    },
    groupContainer: {
        paddingHorizontal: 10
    },
    noLocationText: {
        color: Color.lightText,
        padding: 15,
        flex: 1
    }
})