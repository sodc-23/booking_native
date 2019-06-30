import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import Color from '@common/color'
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default GroupTitle = ({ title }) => (
    <View style={styles.groupTitleContainer}>
        <Text style={styles.groupTitleText}>{title}</Text>
    </View>
)

const styles=StyleSheet.create({
    groupTitleContainer: {
        backgroundColor: Color.lightBack,
        borderTopColor: Color.border,
        borderTopWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 36
    },
    groupTitleText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Color.lightText
    },
})