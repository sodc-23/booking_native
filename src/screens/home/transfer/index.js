import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

import HotDeals from '@components/home/hotDeals'
import Color from '@common/color'
import HomeWhiteMenuButton from '@components/general/homeWhiteMenuButton'
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RecentSearchs from '@components/home/recentSearchs'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import UtilService from '@utils/utils';
import * as transferAction from '@store/transfer';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class TransferC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            deals: [
                {}, {}, {}, {}
            ],
            items: [
                {}, {}, {}, {}
            ],
            location: '',
            date: new Date(),
            persons:1,
            time: '11:00 am',
        }
        this.props.actions.recentSearch()
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.props.actions.selectDate(date)
        this.setState({ isDateTimePickerVisible: false})
    };

    searchTransfer() {
        let {locationFromType, locationToType, selectedFromLocation, selectedToLocation, selectedDate, passengers, ages = []} = this.props.transfers
        if(!selectedFromLocation.name||!selectedToLocation.name) {
            alert('Please select valid location')
            return
        }
        if(!locationFromType||!locationToType) {
            alert('Please select valid type')
            return
        }

        var paxInfo = []
        for(var i = 0 ; i < passengers ; i++) {
            var age = ages[i] || 25
            paxInfo.push({
                "TypeString": age >= 18 ? "ADT" : (age >= 2 ? "CHD" : "INF"),
                "Quantity": 1,
                age: age
            })
        }
        let searchRequest = {
            "request": {
                "criteriaInfo":[{
                    "locationInfo": {fromLocation: {...selectedFromLocation, type: locationFromType}},
                    "DateInfo": {
                        "StartDate": moment(selectedDate).format('YYYY-MM-DDTHH:mm:ss'),
                        "EndDate": '0001-01-01T00:00:00',
                        "StartTime": moment(selectedDate).format('H'),
                        "EndTime": '00'
                    }
                }, {
                    "locationInfo": {fromLocation: {...selectedToLocation, type: locationToType}},
                    "DateInfo": {
                        "StartDate": moment(selectedDate).format('YYYY-MM-DDTHH:mm:ss'),
                        "EndDate": '0001-01-01T00:00:00',
                        "StartTime": moment(selectedDate).format('H'),
                        "EndTime": '00'
                    }
                }],
                "paxInfo":[
                    {
                        "Item": paxInfo
                    }
                ],
                "TripType": "Oneway",
                "Status": "Available",
                "Code": "transfers",
                "Business": "transfers",
                "BusinessId": "9"
            },
            "flags": {}
        }

        //console.log('searchRequest', searchRequest)
        Global.searchLocation = selectedFromLocation.name
        Global.searchDetail = moment(selectedDate).format('D MMM YYYY')

        this.props.actions.search(searchRequest).then(({error, result, token})=>{
            if(error) {
                console.log('searchTransfer error', error)
                return
            }
            Global.searchToken['transfers'] = token
        })
        Actions.TransferList()
    }

    showDatePicker(){
        this.setState({ isDateTimePickerVisible: true})
    }

    render() {
        let { deals, date,persons, time } = this.state
        let {locationFromType, locationToType, selectedFromLocation, selectedToLocation, selectedDate, passengers, recentSearches} = this.props.transfers
        // let {selectedFromLocation, selectedToLocation} = this.props.activity
        // selectedFromLocation = selectedFromLocation||{}
        // selectedToLocation = selectedToLocation||{}
        let transferRecentSearches = (recentSearches||[]).filter((o)=>o.info.business=='transfers')
        //console.log('transferRecentSearches', transferRecentSearches)
        let {T1, T2, T3} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('from').toProperCase()}
                        value={selectedFromLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'transfers', field:'fromLocation'})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('type').toProperCase()}
                        value={T3(locationFromType)}
                        onPress={() => { Actions.TransferTypeList({locationType:'from', selectedID:locationFromType})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('to').toProperCase()}
                        value={selectedToLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'transfers', field:'toLocation'})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('type').toProperCase()}
                        value={T3(locationToType)}
                        onPress={() => {Actions.TransferTypeList({locationType:'to', selectedID:locationToType}) }}
                    />
                    <TouchableOpacity onPress={()=>Actions.SelectDate({business:'transfers', fromDate:selectedDate, disableRange:true})} style={styles.buttonContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{moment(selectedDate).format('DD')}</Text>
                            <View>
                                <Text style={styles.normal}>{T1(moment(selectedDate).format('ddd').toLowerCase()).toProperCase()}</Text>
                                <Text style={styles.normal}>{T1(moment(selectedDate).format('MMM').toLowerCase()).toProperCase()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.showDatePicker()} style={styles.buttonContainer}>
                        <Text style={styles.timeText}>{moment(selectedDate).format('hh:mm a')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Actions.SelectPassenger3({business:'transfers'})} style={styles.buttonContainer}>
                        <Text style={styles.personNumber}>{passengers}</Text>
                        <Text style={styles.middleText}>{T2('person').toProperCase()}</Text>
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchTransfer.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={transferRecentSearches} />
                {/* <HotDeals deals={deals} /> */}
                <DateTimePicker
                    date={selectedDate}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode='time'
                />
            </View>
        )
    }
}

const mapStateToProps = ({transfers,language }) => ({transfers, language});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({...transferAction}, dispatch)
});

export default Transfer = connect(mapStateToProps, mapDispatchToProps)(TransferC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 15,
        marginBottom: 15
    },
    searchContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    searchButton: {
        flex: 1,
        height: 44,
        backgroundColor: Color.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchButtonText: {
        fontSize: 16,
        color: 'white'
    },
    mapButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    mapPin: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    normal: {
        fontSize: 12,
        color: Color.lightText
    },
    dateText: {
        fontSize: 24,
        color: Color.orange,
        marginRight: 10
    },
    dateContainer: {
        flexDirection: 'row',
        paddingVertical:10
    },
    buttonContainer:{
        width:'100%',
        backgroundColor:'white',
        minHeight:40,
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        flexDirection:'row'
    },
    personNumber:{
        color:Color.orange,
        fontSize:16
    },
    middleText:{
        color:Color.text,
        marginLeft:5
    },
    timeText:{
        color:Color.lightText,
        fontSize:16
    }
})