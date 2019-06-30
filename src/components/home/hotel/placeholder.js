import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'
import Color from '@common/color';
import Global from "@utils/global";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
const { T1, T2 } = Global.Translate

const PlaceholderItem = () => (
    <View style={styles.itemContainer}>
        <ShimmerPlaceHolder duration={1500} autoRun style={styles.leftItem} />
        <View style={styles.centerItemContainer}>
            <ShimmerPlaceHolder duration={1500} autoRun style={styles.centerItem} />
            <ShimmerPlaceHolder duration={1500} autoRun style={styles.centerItem} />
            <ShimmerPlaceHolder duration={1500} autoRun style={styles.centerItem} />
        </View>
        <View style={styles.rightItemContainer}>
            <ShimmerPlaceHolder duration={1500} autoRun style={styles.rightItem} />
            <ShimmerPlaceHolder duration={1500} autoRun style={styles.rightItem} />
        </View>
    </View>
)

export default PlaceHolder = ({ isLoading }) => isLoading ? (
    <View style={styles.container}>
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
    </View>
) : null


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.comment,
        paddingVertical: 10,
    },
    leftItem: {
        width: 80,
        height: 80,
        backgroundColor: Color.comment
    },
    centerItemContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    centerItem: {
        width: '100%',
        height: 15,
        backgroundColor: Color.comment,
        marginBottom: 3
    },
    rightItemContainer: {
        width: 100,
        height: 80,
        justifyContent: 'flex-end'
    },
    rightItem: {
        width: '100%',
        height: 10,
        backgroundColor: Color.comment,
        marginTop: 2
    }
})