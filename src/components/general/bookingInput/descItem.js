import React from 'react'

import {
    Text,
    StyleSheet
} from 'react-native'

import {connect} from 'react-redux'
import Color from '@common/color'

const DescItem = ({ value, language:{T2} }) => (
    <Text style={styles.desc}>{T2(value)}</Text>
)

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(DescItem)

const styles = StyleSheet.create({
    desc: {
        marginVertical: 8,
        fontSize: 11,
        color: Color.text
    }
})