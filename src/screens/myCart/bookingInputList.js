import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
} from 'react-native'

import {
    ActivityBookingInput,
    FlightBookingInput,
    HotelBookingInput,
    PackageBookingInput,
    VehicleBookingInput,
    TransferBookingInput,
} from '@component_cart'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartAction from '@store/cart';

class BookingInputList extends PureComponent {

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
        cart: bindActionCreators({ ...cartAction }, dispatch),
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingInputList);