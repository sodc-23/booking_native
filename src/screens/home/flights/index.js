import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet
} from 'react-native'

import { TabBar, SelectFromTo } from '@components/home/flight'
import HotDeals from '@components/home/hotDeals'
import DateView from '@components/home/dateView'
import InfoView from '@components/home/infoView'
import { Actions } from 'react-native-router-flux'
import Color from '@common/color'
import Global from "@utils/global";
import FromToWhen from '@components/home/flight/fromToWhen';
import RecentSearchs from '@components/home/recentSearchs'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as airAction from '@store/air';
import moment from 'moment'
import UtilService from '@utils/utils';
const {T1, T2} = Global.Translate

class FlightC extends PureComponent {
    constructor(props) {
        super(props)
        let {T1, T2} = this.props.language
        this.state = {
            titles: [
                { title: T2('one way').toProperCase(), selected: true },
                { title: T2('round trip').toProperCase(), selected: false },
                // { title: T2('Multi-City'), selected: false },
            ],
            deals: [
                {}, {}, {}, {}
            ],
            ways:[
                {From:{title:'CAI'}, To:{title:'SSH'}, When:'29 Aug' },{ },{ },
            ],
            selected: 0,
            fromDate: new Date(),
            toDate: new Date()
        }
        this.props.actions.recentSearch()
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    onSelectTab(index) {
        let { titles } = this.state
        titles.map((item, i) => item.selected = (index == i))
        this.setState({ titles: [...this.state.titles], selected: index })
    }

    oneWayLocation(type){
        Actions.SelectCommonLocation({business:'air', field:type, title:'Select City or Airport'})
    }

    roundTripLocation(type){
        Actions.SelectCommonLocation({business:'air', field:type, title:'Select City or Airport'})
    }

    locationWhen(type, way, index){
        if (type=='fromLocation' || type =='toLocation') Actions.SelectCommonLocation({business:'air', field:type, index})
        if ( type=='when') Actions.SelectDate({business:'air', fromDate:way.fromDate, disableRange:true, index})
    }

    renderOnWay() {
        let {selectedFromLocation, selectedToLocation, fromDate, passengers} = this.props.air
        let {T3} = this.props.language
        return (
            <View>
                <SelectFromTo
                    language={this.props.language}
                    type={'ONE_WAY'}
                    From={selectedFromLocation}
                    To={selectedToLocation}
                    onPress={(type)=>{
                        if(type == 'toLocation' && selectedFromLocation==null) {
                            return alert(T3('Please select From location first.'))
                        }
                        this.oneWayLocation(type)
                    }}
                />
                <DateView
                    fromTitle={T3("Departing")}
                    fromDate={fromDate}
                    onPress={() => Actions.SelectDate({ business: 'air', fromDate, disableRange:true })}
                />
                <InfoView
                    items={[
                        { title: T3('Adult(s)'), value: passengers.adults },
                        { title: T3('Children'), value: passengers.children },
                        { title: T3('Infant(s)'), value: passengers.infants },
                    ]}
                    onPress={() => Actions.SelectPassenger2({business:'air'})}
                />
            </View>
        )
    }

    renderRoundTrip() {
        let {selectedFromLocation, selectedToLocation, fromDate, toDate, passengers} = this.props.air
        if(!toDate) {
            toDate = moment(fromDate).add(1, 'days').toDate()
        }
        let {T3} = this.props.language
        return (
            <View>
                <SelectFromTo
                    language={this.props.language}
                    type='TWO_WAY'
                    From={selectedFromLocation}
                    To={selectedToLocation}
                    onPress={(type)=>{
                        if(type == 'toLocation' && selectedFromLocation==null) {
                            return alert(T3('Please select From location first.'))
                        }
                        this.roundTripLocation(type)
                    }}
                />
                <DateView
                    fromTitle={T3("Departing")}
                    fromDate={fromDate}
                    toTitle={T3("Returning")}
                    toDate={toDate}
                    onPress={() => Actions.SelectDate({ business: 'air', fromDate, toDate })}
                />
                <InfoView
                    items={[
                        { title: T3('Adult(s)'), value: passengers.adults },
                        { title: T3('Children'), value: passengers.children },
                        { title: T3('Infant(s)'), value: passengers.infants },
                    ]}
                    onPress={() => Actions.SelectPassenger2({business:'air'})}
                />
            </View>
        )
    }

    removeWay(){
        this.props.actions.removeWay()
    }

    addWay(){
        this.props.actions.addWay()
    }

    renderMultiCity() {
        let {ways} = this.state
        let {multiways, passengers} = this.props.air
        return (
            <View >
                <InfoView
                    items={[
                        { title: 'Adult(s)', value: passengers.adults },
                        { title: 'Children', value: passengers.children },
                        { title: 'Infant(s)', value: passengers.infants },
                    ]}
                    onPress={() => Actions.SelectPassenger2({business:'air'})}
                />
                {multiways.map((way, index)=><FromToWhen
                    {...way}
                    key={index}
                    onPress={(type)=>this.locationWhen(type, multiways[index], index)}
                />)}
                <View style={styles.buttonContain}>
                    <TouchableOpacity onPress={()=>this.removeWay()} style={styles.button}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                    <View style={{width:5}}/>
                    <TouchableOpacity onPress={()=>this.addWay()} style={styles.button}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    searchFlights() {
        let {selectedFromLocation, selectedToLocation, fromDate, toDate, passengers} = this.props.air
        let {selected} = this.state

        if(!selectedFromLocation) {
            Alert.alert('Information', 'Please enter a destination for depature')
            return
        }

        if (!selectedToLocation){
            Alert.alert('Information', 'Please enter a destination for arrival')
            return;
        }

        if (selectedFromLocation.id==selectedToLocation.id){
            Alert.alert('Information', 'The departure and arrival airports cannot be the same.')
            return;
        }

        if(selected != 1) {
            toDate = fromDate
        } else {
            if(!toDate) {
                toDate = moment(fromDate).add(1, 'days').toDate()
            }
        }

        let portalCountryCode = Global.environment.portalCountry.code
        let isDomestic = selected==1&&selectedFromLocation.countryID==portalCountryCode&&selectedToLocation.countryID==portalCountryCode
        let searchRequest = {
            "Request": {
                "CriteriaInfo": [
                    {
                        "locationInfo": {
                            fromLocation: selectedFromLocation,
                            toLocation: selectedToLocation
                        },
                        "DateInfo": {
                            "StartDate": moment(fromDate).format('YYYY-MM-DDTHH:mm:ss'),
                            "EndDate": moment(toDate).format('YYYY-MM-DDTHH:mm:ss'),  
                            "StartTime": null,
                            "EndTime": null,
                            "Type": null
                          },
                          "SequenceNumber": 1
                    }
                ],
                "paxInfo": [
                    {
                        "Properties": {},
                        "Flags": {},
                        "Code": null,
                        "Item": [
                            {
                               "Type": 0,
                              "TypeString": "ADT",
                              "Description": null,
                              "Max": 0,
                              "Min": 0,
                              "Quantity": passengers.adults,
                              "RateInfo": [],
                              "DisplayRateInfo": [],
                              "BreakDownRateInfo": [],
                              "PaymentGatewayChargeDetails": [],
                              "Age": 0
                            },
                            {
                               "Type": 0,
                              "TypeString": "CHD",
                              "Description": null,
                              "Max": 0,
                              "Min": 0,
                              "Quantity": passengers.children,
                              "RateInfo": [],
                              "DisplayRateInfo": [],
                              "BreakDownRateInfo": [],
                              "PaymentGatewayChargeDetails": [],
                              "Age": 0
                            },
                            {
                               "Type": 0,
                              "TypeString": "INF",
                              "Description": null,
                              "Max": 0,
                              "Min": 0,
                              "Quantity": passengers.infants,
                              "RateInfo": [],
                              "DisplayRateInfo": [],
                              "BreakDownRateInfo": [],
                              "PaymentGatewayChargeDetails": [],
                              "Age": 0
                            }
                        ],
                        "Config": []
                    }
                ],
                "LayoutInfo": null,
                "Filters": [
                    {
                      "Column": "seattype",
                      "Min": 0,
                      "Max": 0,
                      "Query": "any"
                    }
                  ],
                "VendorCriteria": null,
                "Sort": null,
                "TripType": selected==1?"Roundtrip":"Oneway",
                "OperatorCode": null,
                "Status": null,
                "Code": null,
                "Business": "air",
                "BusinessId": null,
                "Flags": {}
            },
            "Flags": {
              //"feature:disableseparateroundtrip": isDomestic
            }
        }

        //console.log('searchRequest', searchRequest)
        Global.searchLocation = selectedFromLocation.name
        Global.searchDetail = moment(fromDate).format('D MMM YYYY')

        this.props.actions.search(searchRequest).then(({error, result, token})=>{
            if(error) {
                console.log('searchAir error', error)
                return
            }
            Global.searchToken['air'] = token
        })

        Actions.FlightList({tripType:selected, isDomestic:isDomestic})
    }

    render() {
        let { selected, deals } = this.state
        let {recentSearches} = this.props.air
        let airRecentSearches = (recentSearches||[]).filter((o)=>o.info.business=='air')
        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <TabBar
                        titles={this.state.titles}
                        onPress={(index) => this.onSelectTab(index)}
                    />
                    {selected == 0 && this.renderOnWay()}
                    {selected == 1 && this.renderRoundTrip()}
                    {selected == 2 && this.renderMultiCity()}

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.searchFlights.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={airRecentSearches} />
                {/* <HotDeals deals={deals} /> */}
            </View>
        )
    }
}

const mapStateToProps = ({ air, language }) => ({ air, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...airAction }, dispatch)
});

export default Flight = connect(mapStateToProps, mapDispatchToProps)(FlightC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5
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
    buttonContain:{
        marginTop:5,
        width:'100%',
        height:40,
        flexDirection:'row'
    },
    button:{
        backgroundColor:'white',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        fontSize:12,
        color:Color.primary
    }
})