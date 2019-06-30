import React from 'react'

import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native'

import Color from '@common/color'

import RoundButton from '@components/general/roundButton'
import DetailItem from '@components/home/train/detailItem'
import TrainStatusBar from '@components/home/train/statusBar'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as busAction from '@store/bus';
import * as cartAction from '@store/cart';
import { Actions } from 'react-native-router-flux';
import Global from "@utils/global";
import UtilService from '@utils/utils';

class SeatSelectionC extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(props) {
    }

    addToCart() {
        Actions.Booking({business:'train'})
    }

    render() {
        if (!this.props.show) return null
        let { price, title, departTime, arriveTime, duration, trainNumber, description, items, status } = this.props
        let {T1, T2, T3, T4} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}
                            <Text style={styles.normal}> ({trainNumber})</Text>
                        </Text>
                        <Text style={styles.smallPrimary}>Depart: {departTime}   |   Arrive: {arriveTime}   |   Duration: {duration}</Text>
                        <TrainStatusBar status={status}/>
                        <View style={styles.listContainer}>
                            {items.map((item, index)=><DetailItem {...item} key={index}/>)}
                        </View>
                        <Text style={styles.normal}>{description}</Text>
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        <View>
                            <Text style={styles.price1}>Fare</Text>
                            <Text style={styles.price2}>{price}</Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <RoundButton
                            title={T4('ADD TO CART')}
                            // disabledUI={(selectedItem.id ? false : true)}
                            // disabled={isLoading || (selectedItem.id ? false : true)}
                            onPress={() => this.addToCart()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = ({language }) => ({language});

const mapDispatchToProps = (dispatch) => ({
});

export default SeatSelection = connect(mapStateToProps, mapDispatchToProps)(SeatSelectionC);

SeatSelection.defaultProps = {
    price: 'USD 209',
    departTime:'00:05',
    arriveTime:'05:25',
    duration:'5:20',
    title: 'MUMBAI RAJDHANI',
    trainNumber:'19019',
    description:'Availability as on 2018-08-29T04:37:01.022+0533',
    items:[
        {selected:false}, {selected:true}, {selected:false}, {selected:false}, {selected:false}
    ]
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottomContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    leftContainer: {
        alignItems: 'flex-end',
        width: 120,
        marginRight: 10
    },
    rightContainer: {
        flex: 1,
    },
    price1: {
        fontSize: 10,
        // textDecorationLine: 'line-through',
        color: Color.text,
    },
    price2: {
        color: Color.primary,
        fontSize: 20,
        fontWeight: 'bold'
    },
    content:{
        padding:15
    },
    listContainer:{
        backgroundColor:Color.lightBack,
        paddingHorizontal:5,
        marginVertical: 10,
        borderRadius:5
    },
    smallPrimary:{
        fontSize:12,
        color:Color.primary,
        marginTop:10
    },
    normal:{
        fontSize:14,
        color:Color.text
    },
    title:{
        fontSize:20,
        color:Color.primary
    }
})