import React from 'react'

import {
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import Booking from '../home/booking';

export default class PackageBooking extends React.PureComponent{
    
    render(){
        return <Booking {...this.props} business="package"/>
    }
}