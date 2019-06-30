import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Switch
} from 'react-native'

import Color from '@common/color'
import TitleBar from './TitleBar';
import Global from "@utils/global";
import Ionicons from '@expo/vector-icons/Ionicons';
const { T1, T2 } = Global.Translate

export default class SwitchEditor extends React.Component {
    state = {
        filterText: '',
        showAll: false
    }
    showAll() {
        this.setState({ showAll: true })
    }
    render() {
        let { title, value, onChanged } = this.props
        let { showAll, filterText } = this.state
        let filteredValues = []
        filteredValues = value.filter(o=>o.title.toLowerCase().indexOf(filterText)>=0)
        return (
            <View style={styles.container}>
                <TitleBar title={title} />

                <View style={styles.content}>
                    {value.length >= 10 && <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search Amentities"
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                            onChangeText={text => this.setState({ filterText: text.toLowerCase() })}
                            value={this.state.filterText}
                        />
                        <Ionicons name="md-search" size={24} color={Color.text} />
                    </View>}
                    {value.map((item, index) => {
                        return ( (filterText==''&&(index<10 || showAll)) || (filterText != '' && item.title.toLowerCase().indexOf(filterText)>=0))?(
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.text}>{item.title}</Text>
                                <Switch
                                    thumbColor="white"
                                    trackColor={{ true: Color.orange, false: Color.lightBack }}
                                    value={item.value}
                                    onValueChange={() => onChanged(index)}
                                />
                            </View>
                        ):null
                    })}
                    {filteredValues.length == 0 && <Text style={styles.emptyText}>No filtered items</Text>}
                    {!showAll && filterText == '' && value.length >= 10 && <View style={styles.moreContainer}>
                        <Text onPress={() => this.showAll()} style={styles.moreText}>MORE</Text>
                        <Ionicons name="ios-arrow-down" size={24} color={Color.lightText} />
                    </View>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    },
    content: {
        padding: 10,
        paddingTop: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: Color.border,
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: Color.border,
        height: 50,
        width: '100%',
        alignItems: 'center',
        paddingTop: 10,
    },
    input: {
        flex: 1,
        marginRight: 10,
        fontSize: 18,
        color: Color.text
    },
    text: {
        fontSize: 18,
        color: Color.lightText,
        flex: 1
    },
    emptyText: {
        fontSize: 18,
        color: Color.lightText,
        textAlign: 'center',
        marginVertical: 8
    },
    moreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%'
    },
    moreText: {
        fontSize: 16,
        color: Color.orange,
        marginRight: 5
    }
})