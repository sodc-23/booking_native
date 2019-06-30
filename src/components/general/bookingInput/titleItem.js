import React from 'react'

import{
    View,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import {connect} from 'react-redux'

const TitleItem = ({ title, language:{T3} }) => (
    <View style={styles.titleView}>
        <Text style={styles.titleText}>{T3(title)}</Text>
    </View>
)

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(TitleItem)

const styles = StyleSheet.create({
    titleView: {
        width: "100%",
        padding: 15,
        backgroundColor: '#eeeeee',
    },
    titleText: {
        fontSize: 16,
        color: Color.primary,
        fontWeight: 'bold',
    },
})