import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native'

import Color from '@common/color'
import TitleBar from './TitleBar'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
const { width: screenWidth } = Dimensions.get('window')
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default RangeSelectBar = ({ step, range, minText, maxText, value, onChanged, title }) => (
    <View style={styles.container}>
        <TitleBar title={title} />
        <View style={styles.content}>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{minText}</Text>
                <Text style={styles.value}>{maxText}</Text>
            </View>
            <MultiSlider
                isMarkersSeparated={true}
                values={value}
                step={step}
                onValuesChange={value=>onChanged(value[0], value[1])}
                selectedStyle={styles.selected}
                min={range[0]}
                max={range[1]}
                customMarkerLeft={(e) => <View style={styles.buttonContainer}>
                    <View style={styles.buttonCenter} />
                </View>}
                customMarkerRight={(e) => <View style={styles.buttonContainer}>
                    <View style={styles.buttonCenter} />
                </View>}
                sliderLength={screenWidth - 40}
            />

        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonCenter: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Color.orange
    },
    selected: {
        backgroundColor: Color.orange,
    },
    valueContainer: {
        marginTop:10,
        paddingHorizontal:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    value: {
        color: Color.primary,
        fontSize: 14
    },
})