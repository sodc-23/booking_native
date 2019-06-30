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
import * as vehicleAction from '@store/vehicle';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class VehicleC extends PureComponent {
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
            isDateTimePickerVisible: false,
            mode:'from',
            selectedDate:null
        }
        this.props.actions.recentSearch()
    }

    searchVehicle() {
        let {selectedFromLocation, selectedToLocation, fromDate, toDate} = this.props.vehicle
        if(!selectedFromLocation || !selectedFromLocation.id) {
            alert(T2('Please select a pick up location'))
            return
        }
        if(!selectedToLocation || !selectedToLocation.id) {
            alert(T2('Please select a drop off location'))
            return
        }
        let searchRequest = {
            "request": {
                "criteriaInfo":[
                    {
                        "locationInfo": {
                            fromLocation: selectedFromLocation,
                            toLocation: selectedToLocation,
                        },
                        "DateInfo": {
                            "StartDate": moment(fromDate).format('YYYY-MM-DDTHH:mm:ss'),
                            "EndDate": moment(toDate).format('YYYY-MM-DDTHH:mm:ss')
                        }
                    }
                ],
                "paxInfo":[{
                    "TypeString": "ADT",
                    "Quantity": 1
                }],
                "status": "Available",
                "code": "Vehicle",
                "business": "vehicle"
            },
            "flags": {}
        }

        console.log('searchRequest', searchRequest)
        var nights = moment(toDate).diff(moment(fromDate), 'days')
        Global.searchLocation = selectedFromLocation.name
        Global.searchDetail = moment(fromDate).format('D MMM YYYY') + `, ${nights} Night` + (nights>1?'s':'')

        this.props.actions.search(searchRequest).then(({error, result, token})=>{
            if(error) {
                console.log('searchVehicle error', error)
                return
            }
            Global.searchToken['vehicle'] = token
        })
        Actions.VehicleList()
    }

    showDatePicker(mode, selectedDate){
        this.setState({ isDateTimePickerVisible: true, mode, selectedDate})
    }
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let {mode} = this.state
        let {fromDate, toDate} = this.props.vehicle

        if(mode == 'from')
            this.props.actions.selectDate(date, toDate)
        else    
            this.props.actions.selectDate(fromDate, date)

        this.setState({ isDateTimePickerVisible: false})
    };

    render() {
        let {deals, selectedDate} = this.state

        let {selectedFromLocation, selectedToLocation, fromDate, toDate, recentSearches} = this.props.vehicle
        selectedFromLocation = selectedFromLocation||{}
        selectedToLocation = selectedToLocation||{}
        let vehicleRecentSearches = (recentSearches||[]).filter((o)=>o.info.business=='vehicle')

        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('pick up location').toProperCase()}
                        value={selectedFromLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'vehicle', field:'fromLocation'})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('drop off location').toProperCase()}
                        value={selectedToLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'vehicle', field:'toLocation'})}}
                    />
                    <TouchableOpacity onPress={()=>Actions.SelectDate({business:'vehicle', fromDate, toDate})} style={styles.buttonContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{moment(fromDate).format('DD')}</Text>
                            <View>
                                <Text style={styles.normal}>{moment(fromDate).format('ddd')}</Text>
                                <Text style={styles.normal}>{moment(fromDate).format('MMM')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.showDatePicker('from', fromDate)} style={styles.buttonContainer}>
                        <Text style={styles.timeText}>{moment(fromDate).format('hh:mm a')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Actions.SelectDate({business:'vehicle', fromDate, toDate})} style={styles.buttonContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{moment(toDate).format('DD')}</Text>
                            <View>
                                <Text style={styles.normal}>{moment(toDate).format('ddd')}</Text>
                                <Text style={styles.normal}>{moment(toDate).format('MMM')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.showDatePicker('to', toDate)} style={styles.buttonContainer}>
                        <Text style={styles.timeText}>{moment(toDate).format('hh:mm a')}</Text>
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchVehicle.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={vehicleRecentSearches} />
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

const mapStateToProps = ({ vehicle, language }) => ({ vehicle, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...vehicleAction }, dispatch)
});

export default Vehicle = connect(mapStateToProps, mapDispatchToProps)(VehicleC);

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