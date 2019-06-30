import React from 'react'

import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native'

import TabBar from '@components/home/bus/tabBar';
import SeatSelection from '@screens/home/buses/seatSelection'
import BusDetails from '@screens/home/buses/busDetail'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import { Actions } from 'react-native-router-flux';
import Global from "@utils/global";
import UtilService from '@utils/utils';

class BusDetailC extends React.Component {
    constructor(props){
        super(props)
        this.state={
            tabIndex:0
        }
        this.loading = true
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: 'Seat Select',
            // description: locationInfo?`${locationInfo.city}, ${locationInfo.country}`:''
        });
        var title = UtilService.getFieldFromList2(Global.currentBus.tpExtension, 'key', 'value', 'operatorName')
        Actions.Loading({ searchType: 'bus', title})
    }
    componentWillReceiveProps(next) {
        let {status, bus} = next.bus

        if(status != busAction.LOADING && this.loading) {
            this.loading = false
            Actions.pop()
        }
    }

    render() {
        let {tabIndex} = this.state
        return (
            <View style={styles.container}>
                <TabBar onPress={index=>this.setState({tabIndex:index})} index={tabIndex}/>
                <SeatSelection show={tabIndex==0}/>
                <BusDetails show={tabIndex==1}/>
            </View>
        )
    }
}

const mapStateToProps = ({ bus }) => ({ bus });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...busAction }, dispatch)
});

export default BusDetail = connect(mapStateToProps, mapDispatchToProps)(BusDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})