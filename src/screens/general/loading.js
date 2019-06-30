import React, {PureComponent} from 'react'
import {
    ImageBackground,
    StyleSheet,
    Text
} from 'react-native'

import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';

import Color from '@common/color'
import {vehicleLoading, flightLoading, hotelLoading, activityLoading, transferLoading, busLoading} from '@common/image'
import UtilService from '@utils/utils';

export default class General extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            vehicle:vehicleLoading,
            flight:flightLoading,
            hotel:hotelLoading,
            activity:activityLoading,
            transfers:transferLoading,
            package:activityLoading,
            bus:busLoading,
        }
    }
    render(){
        return(
            <ImageBackground 
                source={this.state[this.props.searchType]} 
                style={styles.background}
            >
                <Text style={styles.title}>{UtilService.decodeHtmlEntity(this.props.title||'HOTEL')}</Text>
                <BallIndicator 
                    color={Color.primary}
                    style={styles.indicator}
                />
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        alignItems:'center',
        justifyContent: 'flex-end',
        backgroundColor:'white'
    },
    indicator:{
        
        marginTop: 300,
    },
    title:{
        marginTop:100,
        fontSize:20,
        color:Color.primary,
        textAlign:'center'
    }
})