import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import RoundButton from '@components/general/roundButton'
import UtilService from '@utils/utils';
import Global from "@utils/global";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as langAction from '@store/language';

export default class LanguageModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.languages = Global.environment.availableLanguages.map(o => o.cultureName.split('-')[0])
        this.languageOptions = this.languages.map(o => UtilService.getLangName(o))
        this.state = {
            visible: false,
            index: this.languages.indexOf(Global.language)
        }
    }
    show() {
        this.setState({ visible: true })
    }
    done() {
        this.setState({ visible: false })
        this.props.onChange(this.state.index)
        
    }
    render() {
        return (
            <Modal
                transparent
                visible={this.state.visible}
            >
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Change Language</Text>
                        {this.languageOptions.map((item, index) => (
                            <TouchableOpacity onPress={() => this.setState({ index })} key={index} style={styles.itemContainer}>
                                <Text style={[styles.itemText,index==this.state.index?{color:Color.orange}:{}]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.bottom}>
                            <RoundButton
                                title="Save"
                                onPress={() => this.done()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    cardContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 10
    },
    title: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        marginVertical:10
    },
    itemContainer: {
        height: 44,
        width: '100%',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center'
    },
    itemText: {
        fontSize: 14,
        color: Color.text
    },
    bottom:{
        padding:15
    }
})