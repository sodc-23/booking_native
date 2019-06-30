import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import FloorItem from './floorItem';

export default class DeckItem extends React.Component {

    state = {
        isFirstFloor: true
    }

    oneFloor() {
        return (
            <View style={styles.oneContainer}>
                <FloorItem
                    {...this.props}
                    isTop={this.state.isFirstFloor}
                    onClickFloor={() => this.setState({ isFirstFloor: true })}
                />
            </View>
        )
    }

    twoFloor() {
        let {isFirstFloor} = this.state
        return (
            <View style={styles.twoContainer}>
                <Text style={[styles.leftText, isFirstFloor?styles.boldText:styles.normalText]}>Floor-1</Text>
                <Text style={[styles.rightText, !isFirstFloor?styles.boldText:styles.normalText]}>Floor-2</Text>
                <View style={[styles.firstContainer,{zIndex:isFirstFloor?100:10}]}>
                    <FloorItem
                        {...this.props}
                        isTop={isFirstFloor}
                        onClickFloor={() => this.setState({ isFirstFloor: true })}
                    />
                </View>
                <View style={[styles.secondContainer,{zIndex:isFirstFloor?10:100}]}>
                    <FloorItem
                        {...this.props}
                        isTop={!isFirstFloor}
                        isSecondFloor={true}
                        onClickFloor={() => this.setState({ isFirstFloor: false })}
                    />
                </View>
            </View>
        )
    }

    render() {
        let { floors } = this.props
        return (
            <View style={styles.container}>
                {floors == 2 ? this.twoFloor() : this.oneFloor()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    oneContainer: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    twoContainer: {
        width: '100%',
        marginVertical:10
    },
    boldText:{
        fontWeight:"600",
    },
    normalText:{
        fontWeight:"400",
    },
    leftText: {
        position: 'absolute',
        left: 0,
        top: 20,
        fontSize: 14,
        color: Color.darkText,
        transform: [{ rotate: '270deg' }],
    },
    rightText: {
        position: 'absolute',
        right: 0,
        top: 20,
        fontSize: 14,
        color: Color.darkText,
        transform: [{ rotate: '90deg' }]
    },
    firstContainer: {
        // position: 'absolute',
        // left: 40,
        // top: 0
        marginLeft:40,
        marginRight:80
    },
    secondContainer: {
        position: 'absolute',
        right: 40,
        top: 0
    }
})