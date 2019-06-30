import React, {PureComponent} from 'react'
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet
} from 'react-native'

import {LinearGradient} from 'expo'
import { locationBack } from '@common/image';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import * as activityAction from '@store/activity';
import * as vehicleAction from '@store/vehicle';
import * as transferAction from '@store/transfer';
import * as airAction from '@store/air';
import * as busAction from '@store/bus';
import * as packagesAction from '@store/packages';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate


const Card =({image, title, startingPrice, currency, availableFrom, provider, totalRecords, onPress, language:{T1, T2}})=>(
    <View style={{padding:8}}>
        <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
            <Image source={{uri:image}} style={styles.image}/>
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
                start={[0,1]}
                end={[0,0]}
                style={styles.gradient}
            >
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.normalWhite}>{totalRecords} {T2('packages').toUpperCase()}</Text>
                <View style={styles.row}>
                    <Text style={styles.smallWhite}>{T2('starting from').toProperCase()} {currency} {startingPrice}</Text>
                    <Text style={styles.smallWhite}>{T2('available from').toProperCase()} {availableFrom}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    </View>
)

class PackagesC extends PureComponent{

    constructor(props){
        super(props)
        this.state={
            locations:[
                {image:locationBack, name:'LONDON', count:11, minCost:200, duration:'Available from Aug - Mar'},
                {image:locationBack, name:'CAIRO', count:11, minCost:200, duration:'Available from Aug - Mar'},
                {image:locationBack, name:'DUBLIN', count:11, minCost:200, duration:'Available from Aug - Mar'},
                {image:locationBack, name:'LONDON', count:11, minCost:200, duration:'Available from Aug - Mar'},
            ]
        }

        // this.props.actions.getPromotedLocations()
    }
    fetch(item){
        let searchRequest = {
            "request": item.request,
            "flags": {}
        }
        let { startDate, endDate } = item.request.criteriaInfo[0].dateInfo
        var nights = moment(endDate).diff(moment(startDate), 'days')
        Global.searchLocation = item.request.criteriaInfo[0].locationInfo.fromLocation.name
        Global.searchDetail = moment(startDate).format('D MMM YYYY') + `, ${nights} Night` + (nights > 1 ? 's' : '')

        var business = item.request.business
        this.props.actions[business].search(searchRequest).then(({ error, result, token }) => {
            if (error) {
                console.log('search error', error)
                //alert('Failed to search') 
                return
            }
            Global.searchToken[business] = token
        })
        var fromPage = 'packages'
        switch (business) {
            case 'hotel':
                Actions.HotelList({fromPage});
                break;
            case 'activity':
                Actions.ActivityList({fromPage});
                break;
            case 'vehicle':
                Actions.VehicleList({fromPage});
                break;
            case 'transfers':
                Actions.TransferList({fromPage});
                break;
            case 'package':
                Actions.PackageList({fromPage});
                break;
            case 'air':
                Actions.FlightList({tripType: searchRequest.request.tripType=='Oneway'?0:1, fromPage})
                break;
        }
    }
    render(){
        let {locations} = this.state
        let {promotedLocations = {}} = this.props.package
        let items = promotedLocations.data?promotedLocations.data[0].item:[]
        return(
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {items.map((item, index)=><Card 
                     language={this.props.language}
                     image = {UtilService.getFieldFromList2(item.request.config, "key", "value", "image")}
                     title = {UtilService.getFieldFromList2(item.request.config, "key", "value", "title")}
                     startingPrice = {UtilService.getFieldFromList2(item.request.config, "key", "value", "startingPrice")}
                     currency = {UtilService.getFieldFromList2(item.request.config, "key", "value", "currency")}
                     availableFrom = {UtilService.getFieldFromList2(item.request.config, "key", "value", "availableFrom")}
                     provider = {UtilService.getFieldFromList2(item.request.config, "key", "value", "provider")}
                     totalRecords = {UtilService.getFieldFromList2(item.request.config, "key", "value", "totalRecords")}
                     key={index} onPress={()=>this.fetch(item)}/>)}
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ packages, language }) => ({ package:packages, language });

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

export default Package = connect(mapStateToProps, mapDispatchToProps)(PackagesC);


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        padding:8
    },
    cardContainer:{
        height:180,
        width:'100%',
        borderRadius:5,
        overflow:'hidden'
    },
    image:{
        height:'100%',
        width:'100%',
    },
    gradient:{
        position:'absolute',
        left:0,
        top:0,
        width:'100%',
        height:'100%',
        padding:8,
        justifyContent:'flex-end'
    },
    cardTitle:{
        fontSize:24,
        fontWeight:'bold',
        color:'white'
    },
    normalWhite:{
        fontSize:14,
        color:'white'
    },
    smallWhite:{
        fontSize:10,
        color:'white'
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:5
    }
})