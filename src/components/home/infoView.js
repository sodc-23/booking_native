import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    View
} from 'react-native'
import Color from '@common/color'
import Global from "@utils/global";

export default class InfoView extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        let { onPress, items, T2 } = this.props
        return (
            <TouchableOpacity onPress={() => onPress()} style={styles.container}>
                <Text style={styles.number}>
                    {/* {rooms || 1}<Text style={styles.text}> {T2('Room')} </Text>
                    {adults || 1}<Text style={styles.text}> {T2('Adult(s)')} </Text>
                    {kids || 0}<Text style={styles.text}> {T2('Children')}</Text> */}
                    {items.map((item, index) => <Text key={index}>
                        {item.value}<Text style={styles.text}> {item.title} </Text>
                    </Text>)}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        marginTop: 5,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        color: Color.orange,
        fontSize: 16,
    },
    text: {
        color: Color.lightText,
        fontSize: 14
    }
})