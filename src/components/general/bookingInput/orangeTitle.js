import React from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import {connect} from 'react-redux'

const OrangeItem = ({ title, language:{T3} }) => (
    <View style={styles.container}>
        <Text style={styles.travelerText}>{T3(title)}</Text>
    </View>
)

const styles = StyleSheet.create({
    container:{
        width: '100%',
        marginTop:5,
        justifyContent: 'center',
    },
    travelerText: {
        fontSize: 12,
        color: Color.orange,
    },
})

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(OrangeItem)