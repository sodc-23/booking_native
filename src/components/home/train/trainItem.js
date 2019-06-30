import React from 'react'

import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import moment from 'moment';
import UtilService from '@utils/utils';

export default class TrainItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isFetched: false
        }
    }

    componentDidMount() {
        // setTimeout(() => this.setState({ isFetched: true }), 3000)
    }

    render() {
        let { onPress, title, departTime, arriveTime, duration, startingPrice, trainNumber, isFetched } = this.props
        // let { isFetched } = this.state
        return (
            <TouchableOpacity disabled={!isFetched} onPress={() => onPress()} style={styles.container}>
                <ShimmerPlaceHolder autoRun visible={isFetched} style={[styles.shimmerStyle, {height:20}]}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.number}> ({trainNumber})</Text>
                    </View>
                </ShimmerPlaceHolder>
                <View style={styles.content}>
                    <View style={styles.left}>
                        <ShimmerPlaceHolder autoRun visible={isFetched} style={styles.shimmerStyle}>
                            <Text style={styles.normal}>Depart: {departTime}</Text>
                        </ShimmerPlaceHolder>
                        <ShimmerPlaceHolder autoRun visible={isFetched} style={styles.shimmerStyle}>
                            <Text style={styles.normal}>Arrive: {arriveTime}</Text>
                        </ShimmerPlaceHolder>
                        <ShimmerPlaceHolder autoRun visible={isFetched} style={styles.shimmerStyle}>
                            <Text style={styles.normal}>Duration: {duration}</Text>
                        </ShimmerPlaceHolder>
                    </View>
                    <View style={styles.right}>
                        <ShimmerPlaceHolder autoRun style={[styles.shimmerStyle, {width:100}]} visible={isFetched}>
                            <Text style={styles.grey}>Starting from:
                                <Text style={styles.price}> {startingPrice}</Text>
                            </Text>
                        </ShimmerPlaceHolder>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

TrainItem.defaultProps = {
    title: 'MUMBAI RAJDHANI',
    departTime: '00:05',
    arriveTime: '05:25',
    duration: '3h 25min',
    startingPrice: 'SAR 200',
    trainNumber: '19019'
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal:5,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'flex-end'
    },
    shimmerStyle:{
        height:15,
        width:250,
        marginTop:5
    },
    title: {
        fontSize: 16,
        color: Color.primary,
    },
    number:{
        fontSize:14,
        color:'grey'
    },
    content:{
        width:'100%',
        marginTop:8
    },
    right:{
        alignItems:'flex-end'
    },
    left:{
        
    },
    normal:{
        fontSize:12,
        color:Color.primary
    },
    grey:{
        fontSize:12,
        color:Color.text
    },
    price:{
        fontSize:14,
        color:Color.orange,
        fontWeight:'bold'
    }
})