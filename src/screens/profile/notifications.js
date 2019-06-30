import React from 'react'

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native'

import Color from '@common/color'
import moment from 'moment'

const NotificationItem = ({ date, title, description }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemDate}>{moment(date).format('dd mmm, yyyy')}</Text>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDate}>{description}</Text>
    </View>
)

export default class Notifcations extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            notifications: [
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' },
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' },
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' },
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' },
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' },
                { date: new Date(), title: 'Planning to travel Soon?', description: 'Praesent finibus neque non venenatis tristique. Lorem ipsum dolor sit amet, consectetur' }

            ]
        }
    }

    render() {
        let { notifications } = this.state
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={styles.container}>
                    {notifications.map((item, index) => <NotificationItem key={index} {...item} />)}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    primary: {
        fontSize: 12,
        color: Color.primary
    },
    itemContainer:{
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
        paddingVertical:10
    },
    itemDate:{
        fontSize:14,
        color:Color.lightText,
    },
    itemTitle:{
        fontSize:18, 
        color:Color.orange,
        marginVertical:8
    },
})