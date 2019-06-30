import React, { PureComponent } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Text,
} from 'react-native'

import {
    ActivityBookingCard,
    FlightBookingCard,
    HotelBookingCard,
    PackageBookingCard,
    VehicleBookingCard,
    TransferBookingCard
} from '@component_cart'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';
import { hotelIco, transferIco, packageIco, cruiseIco, trainIco, carRentalIco, flightIco, activityIco, busIco } from '@common/image'

class BookingCardList extends PureComponent {
    render(){
        return(
            <View>

            </View>
        )
    }
}

const mapStateToProps = ({ cart }) => ({ cart });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        cart: bindActionCreators({ ...cartAction }, dispatch)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingCardList);