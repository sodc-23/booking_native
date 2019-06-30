import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native'
import Color from '@common/color'
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigationIcon } from '@common/image';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

import Marquee from '@components/general/react-native-text-ticker'

export default SearchLocation = ({ location, onPress, language }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.container}>
        <Ionicons name="ios-search" size={28} color={Color.lightText} />
        <View style={{ flex:1, paddingHorizontal: 15 }}>
            <Marquee style={styles.locationText}>{location ? location : (language?language.T2('location').toProperCase():'Location')}</Marquee>
        </View>
        <Image source={navigationIcon} style={styles.rightIcon} />
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        height: 44,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    locationText: {
        color: Color.lightText,
        fontSize: 14,
    },
    rightIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
    }
})