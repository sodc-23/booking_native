import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import * as _ from 'underscore'
import Global from "@utils/global";
import ReadMore from 'react-native-read-more-text';
const { T1, T2 } = Global.Translate

export default class Descriptions extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showAll: false
        }
    }
    render() {
        let { descriptions, language:{T1, T2} } = this.props
        let { showAll } = this.state

        var decodeHtmlEntity = function (str) {
            var temp = str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });

            return _.unescape(temp).replace(/<\/?[^>]+(>|$)/g, "")
        };

        return (
            <View style={styles.container}>
                {descriptions.map((item, index) => (
                    <View key={index} style={[styles.itemContainer, { borderTopWidth: index != 0 ? 0.5 : 0 }]}>
                        <Text style={styles.title} >{T2(item.title.toLowerCase()).toUpperCase()}</Text>
                        {/* <Text style={styles.desc} numberOfLines={showAll?0:3}>
                            {decodeHtmlEntity(item.description)}
                        </Text>
                        <Text onPress={()=>this.setState({showAll:!showAll})} style={styles.link}>{showAll?'Show Less':'Read More'}</Text> */}
                        <ReadMore
                            numberOfLines={3}
                            renderTruncatedFooter={onPress=><Text onPress={onPress} style={styles.link}>Read More</Text>}
                            renderRevealedFooter={onPress=><Text onPress={onPress} style={styles.link}>Show Less</Text>}
                        >
                            <Text style={styles.desc}>
                                {decodeHtmlEntity(item.description)}
                            </Text>
                        </ReadMore>
                    </View>
                ))}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    itemContainer: {
        paddingVertical: 20,
        borderTopColor: Color.border
    },
    title: {
        fontSize: 13,
        color: Color.darkText,
        fontWeight: 'bold',
        marginBottom:10
    },
    desc: {
        fontSize: 12,
        color: Color.text,
    },
    link: {
        fontSize: 13,
        color: Color.primary,
        marginTop: 10
    }
})