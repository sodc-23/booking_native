import React from 'react'

import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native'

import TabBar from '@components/home/train/tabBar';
import SeatSelection from '@screens/home/trains/seatSelection'
import TrainDetails from '@screens/home/trains/trainDetail'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import { Actions } from 'react-native-router-flux';
import Global from "@utils/global";
import UtilService from '@utils/utils';

class TrainDetailC extends React.Component {
    constructor(props){
        super(props)
        this.state={
            tabIndex:0
        }
        this.loading = true
    }

    componentWillMount() {
    }
    componentWillReceiveProps(next) {
    }

    render() {
        let {tabIndex} = this.state
        return (
            <View style={styles.container}>
                <TabBar onPress={index=>this.setState({tabIndex:index})} index={tabIndex}/>
                <SeatSelection show={tabIndex==0}/>
                <TrainDetails show={tabIndex==1}/>
            </View>
        )
    }
}

const mapStateToProps = ({ }) => ({ });

const mapDispatchToProps = (dispatch) => ({
});

export default TrainDetail = connect(mapStateToProps, mapDispatchToProps)(TrainDetailC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})