import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import { MapView } from 'expo'
import HotelItem from './hotelItem';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@common/color'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '@utils/utils';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

class HotelMapViewC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            current: 0
        }

        if(Global.searchToken['hotel'])
            this.props.actions.searchMap(Global.searchToken['hotel'])
    }

    zoomOut(props){
        let {mapData, searchPageData} = props.hotel
        if ( mapData.length == 0 ) return ;
        setTimeout(()=>this.refs.map.animateToRegion({
            latitude:mapData[0].latitude,
            longitude:mapData[0].longitude,
            latitudeDelta:0.005,
            longitudeDelta:0.005
        }, 4000))
    }

    componentWillReceiveProps(next){
        if ( next.hotel.type=='SEARCH_MAP' && next.hotel.status=='SUCCESS'){
            this.zoomOut(next)
        }
    }

    render() {
        let { current } = this.state
        let { onPress, } = this.props
        let {mapData, searchPageData, status} = this.props.hotel
        //console.log('mapData', JSON.stringify(mapData))
        let currency = 'SAR'
        if(searchPageData.request){
            //console.log('searchPageData.request.filtersIndex', searchPageData.request.filtersIndex)
            currency = Global.currency //searchPageData.request.filtersIndex[0].item.filter(o=>o.name=='currency')[0].defaultValue
        }
        
        let initialRegion = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        if(mapData && mapData.length >= 1) {
            let boundary = {
                latitude:[mapData[0].latitude, mapData[0].latitude],
                longitude:[mapData[0].longitude, mapData[0].longitude],
            }
            for ( var idx = 1; idx < mapData.length ; idx++) {
                boundary['latitude'][0] = Math.min(mapData[idx].latitude, boundary['latitude'][0])
                boundary['latitude'][1] = Math.max(mapData[idx].latitude, boundary['latitude'][1])
                boundary['longitude'][0] = Math.min(mapData[idx].longitude, boundary['longitude'][0])
                boundary['longitude'][1] = Math.max(mapData[idx].longitude, boundary['longitude'][1])
            }

            initialRegion.latitude = (boundary['latitude'][0] + boundary['latitude'][1])/2.0
            initialRegion.longitude = (boundary['longitude'][0] + boundary['longitude'][1])/2.0
            initialRegion.latitudeDelta = (boundary['latitude'][1] - boundary['latitude'][0]) * 1.2
            initialRegion.longitudeDelta = (boundary['longitude'][1] - boundary['longitude'][0]) * 1.2
        }
        return (
            <View style={styles.container}>
                {mapData && <MapView
                    ref="map"
                    provider="google"
                    style={styles.mapView}
                    initialRegion={initialRegion}
                >
                    {mapData.map((hotel, index) => {
                        if(index == current) return null
                        return (
                            <MapView.Marker
                                onPress={() => this.setState({ current: index })}
                                key={index}
                                coordinate={
                                    {
                                        latitude:hotel.latitude,
                                        longitude:hotel.longitude
                                    }
                                }
                            >
                                <FontAwesome name="map-marker" size={30} color={Color.primary} />
                            </MapView.Marker>)
                    })}
                    {mapData.length >= 1 && <MapView.Marker style={{zIndex:1000}}
                        coordinate={
                            {
                                latitude:mapData[current].latitude,
                                longitude:mapData[current].longitude
                            }
                        }
                    >
                        <FontAwesome name="map-marker" size={45} color={Color.orange} />
                    </MapView.Marker>}
                </MapView>}
                <View style={styles.bottomContainer}>
                    <View style={styles.content}>
                        {mapData && mapData[current] && <HotelItem
                            image={{uri:mapData[current].imageUrl}}
                            title={mapData[current].title}
                            rating={mapData[current].rating}
                            review={8.2}
                            location={mapData[current].address||''}
                            before={mapData[current].strikeThroughAmount}
                            current={mapData[current].amount?`${currency} ${mapData[current].amount}`:''}
                            // desc={mapData[current].imageUrl}
                            onPress={() => onPress(mapData[current],current)}
                        />}
                    </View>
                </View>
                <View pointerEvents='none' style={styles.topContainer}>
                    {(status == hotelAction.LOADING || status == hotelAction.LOADING_MAP ) && <View style={styles.informationContainer}>
                        {mapData && <Text style={styles.infoText}>Loading...</Text>}
                    </View>}
                    {(status != hotelAction.LOADING && status != hotelAction.LOADING_MAP ) && <View style={styles.informationContainer}>
                        {mapData && <Text style={styles.infoText}>Found {mapData.length} hotels in this area</Text>}
                    </View>}
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ hotel }) => ({ hotel });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelMapView = connect(mapStateToProps, mapDispatchToProps)(HotelMapViewC);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapView: {
        flex: 1
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: 5
    },
    content: {
        borderRadius: 3,
        shadowOpacity: 4,
        shadowColor: 'black',
        shadowRadius: 4,
        shadowOffset: { width: 2, height: 2 },
        backgroundColor: 'white',
        paddingLeft: 10
    },
    topContainer:{
        position:'absolute',
        left:0,
        top:0,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    informationContainer:{
        height:30,
        backgroundColor:'rgba(0,0,0,0.5)',
        borderRadius:18,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:15,
        marginTop:15
    },
    infoText:{
        color:'white',
        fontSize:12,
    }
})