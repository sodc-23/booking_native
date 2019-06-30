import React from 'react'


import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'

const backColor = 'rgb(240,239,245)'

import Item from './seatItem'
import { screenWidth } from '@common/const'

export default class FloorItem extends React.Component {

    select(seat) {
        this.props.onClickItem(seat)
    }
    swapFloor() {
        this.props.onClickFloor()
    }
    render() {
        let { rows, cols, seats, isTop } = this.props
        const itemWidth = (screenWidth-130)/cols
        const offset = this.props.isSecondFloor ? 6 : 0
        return (
            <View style={styles.container}>
                <View style={{ height: rows * 50 }}>
                    {seats.map((seat, index) => {
                        let {row, col} = seat
                        if (col-offset-1<0|| col-offset-1>=cols) return null
                        return (
                            <View key={index} style={[styles.item, {right:(col-offset-1)*itemWidth, top:(row-1)*50, width:itemWidth}]}>
                                <Item {...seat} onPress={()=>this.select(seat)}/>
                            </View>
                        )
                    })}
                </View>
                {!isTop && <TouchableOpacity style={styles.cover} onPress={() => this.swapFloor()} />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: backColor,
        width: screenWidth - 120,
        borderRadius: 6,
        shadowColor: 'black',
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 3, height: 3 },
        elevation: 5,
        paddingHorizontal: 5,
        paddingVertical: 15
    },
    rowContainer: {
        flexDirection: 'row'
    },
    itemContainer: {
        flex: 1,
    },
    cover: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 6
    },
    item:{
        position:'absolute'
    }
})