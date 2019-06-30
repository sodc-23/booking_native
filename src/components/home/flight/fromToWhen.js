import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'

import Color from '@common/color'
import { oneWayIcon } from '@common/image'
import moment from 'moment'

export default FromToWhen = ({ fromLocation, toLocation, fromDate, onPress, language:{T3, T4} }) => (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => onPress('fromLocation')} style={styles.buttonContainer}>
            {fromLocation && <Text style={styles.bigText}>{fromLocation.id}</Text>}
            {fromLocation && <Text style={styles.smallText}>{fromLocation.name}</Text>}
            {!fromLocation && <Text style={styles.placehoder}>{T3('From')}</Text>}
        </TouchableOpacity>
        <Image source={oneWayIcon} style={styles.image} />
        <TouchableOpacity onPress={() => onPress('toLocation')} style={styles.buttonContainer}>
            {toLocation && <Text style={styles.bigText}>{toLocation.id}</Text>}
            {toLocation && <Text style={styles.smallText}>{toLocation.name}</Text>}
            {!toLocation && <Text style={styles.placehoder}>{T3('To')}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('when')} style={styles.buttonContainer}>
            {fromDate && <Text style={styles.when}>{moment(fromDate).format('D MMM')}</Text>}
            {!fromDate && <Text style={styles.smallText}>{T3('When')}</Text>}
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bigText: {
        fontSize: 20,
        color: Color.darkText
    },
    smallText: {
        fontSize: 12,
        color: Color.lightText
    },
    placehoder: {
        fontSize: 20,
        color: Color.lightText
    },
    image: {
        marginHorizontal: 5,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    when: {
        fontSize: 12,
        color: Color.darkText
    }
})