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
import RecentSearchs from '@components/home/recentSearchs'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class BusC extends PureComponent {
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
    
    search() {
        let {selectedFromLocation, selectedToLocation, fromDate} = this.props.bus
        if(!selectedFromLocation || !selectedFromLocation.id) {
            alert(T2('Please select a From location'))
            return
        }
        if(!selectedToLocation || !selectedToLocation.id) {
            alert(T2('Please select To location'))
            return
        }
        if(selectedFromLocation.id == selectedToLocation.id) {
            alert(T2('From and To Location should be different.'))
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
                            "EndDate": moment(fromDate).format('YYYY-MM-DDTHH:mm:ss')
                        }
                    }
                ],
                "code": null,
                "business": "bus"
            },
            "flags": {}
        }

        console.log('searchRequest', searchRequest)

        this.props.actions.search(searchRequest).then(({error, result, token})=>{
            if(error) {
                console.log('searchBus error', error)
                return
            }
            Global.searchToken['bus'] = token
        })
        Actions.BusList()
    }

    render() {
        let { selectedFromLocation, selectedToLocation, fromDate, recentSearches } = this.props.bus
        selectedFromLocation = selectedFromLocation||{}
        selectedToLocation = selectedToLocation||{}

        let busRecentSearches = (recentSearches||[]).filter((o)=>o.info.business=='bus')
        let {T1, T2} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <HomeWhiteMenuButton
                        placeholder={T2('from').toProperCase()}
                        value={selectedFromLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'bus', field:'fromLocation', title:'Select Location'})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('to').toProperCase()}
                        value={selectedToLocation.name||''}
                        onPress={() => {Actions.SelectCommonLocation({business:'bus', field:'toLocation', title:'Select Location'})}}
                    />
                    <HomeWhiteMenuButton
                        placeholder={T2('date').toProperCase()}
                        value={moment(fromDate).format('D MMM, YYYY')}
                        onPress={()=>Actions.SelectDate({business:'bus', fromDate, disableRange:true})}
                    />
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={this.search.bind(this)} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>{T2('search').toProperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RecentSearchs items={busRecentSearches} />
            </View>
        )
    }
}

const mapStateToProps = ({ bus, language }) => ({ bus, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction }, dispatch)
});

export default Bus = connect(mapStateToProps, mapDispatchToProps)(BusC);


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