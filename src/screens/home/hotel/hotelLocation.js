import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'

import { MapView } from 'expo'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@common/color'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '../../../utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class HotelLocationC extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        if ( this.props.hotel.hotel == null ) return null
        let { hotel = {} } = this.props.hotel
        if (!hotel.id) return null
        var address = hotel.locationInfo.fromLocation.address
        var coordinate = {
            longitude: hotel.locationInfo.fromLocation.longitude,
            latitude: hotel.locationInfo.fromLocation.latitude,
        }
        return (
            <View style={styles.container}>
                <ScrollView>
                    <MapView
                        provider="google"
                        style={styles.map}
                        initialRegion={{
                            longitude: coordinate.longitude,
                            latitude: coordinate.latitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.03
                        }}
                    >
                        <MapView.Marker
                            coordinate={coordinate}
                        >
                            <FontAwesome name="map-marker" color={Color.orange} size={40} />
                        </MapView.Marker>

                    </MapView>
                    <View pointerEvents='none' style={styles.markerDescContainer}>
                        <FontAwesome name="map-marker" size={16} color={Color.orange} />
                        <Text style={styles.markerDescText}>{address}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ hotel }) => ({ hotel });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelLocation = connect(mapStateToProps, mapDispatchToProps)(HotelLocationC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    map: {
        width: '100%',
        height: 350,
    },
    content: {
        padding: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        height: 50
    },
    iconContainer: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    descContainer: {

    },
    descText: {
        fontSize: 14,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    distText: {
        fontSize: 12,
        color: Color.text
    },
    numberText: {
        position: 'absolute',
        left: 18,
        top: 5,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: Color.middlePrimary,
        width: 12,
        height: 12,
        textAlign: 'center'
    },
    markerDescContainer: {
        position: 'absolute',
        left: 20,
        top: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    markerDescText: {
        marginLeft: 10,
        fontSize: 10,
        color: Color.darkText
    }
})