import React from 'react'


import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ActivityIndicator
} from 'react-native'

import RoundButton from '@components/general/roundButton'
import Color from '@common/color'

export default class TwoButtonModal extends React.Component {
    state = {
        visible: false
    }
    show() {
        this.setState({ visible: true })
    }
    hide() {
        this.setState({ visible: false })
    }

    renderStandard(type) {
        if (type == 0) {
            return (
                <React.Fragment>
                    {this.props.items.map((item, index)=><View key={index} style={styles.itemContainer1}>
                        <Text style={styles.itemTitle1}>{item.title}</Text>
                        <Text style={styles.itemValue1}>{item.value}</Text>
                    </View>)}
                </React.Fragment>
            )
        }
        if ( type==1){
            return (
                <React.Fragment>
                    {this.props.items.map((item, index)=><View key={index} style={styles.itemContainer2}>
                        <Text style={styles.itemTitle2}>{item.title}</Text>
                        <Text style={styles.itemDelimiter}>:</Text>
                        <Text style={styles.itemValue2}>{item.value}</Text>
                    </View>)}
                </React.Fragment>
            )
        }
    }
    render() {
        let { title, buttons, children, type, isLoading } = this.props
        let { visible } = this.state
        return (
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.cardBody}>
                           {isLoading&&<ActivityIndicator style={{flex:1}} color={Color.primary}/>}
                           {!isLoading&&(children || this.renderStandard(type))}
                           {!isLoading && buttons != null && <View style={styles.cardBottom}>
                                {buttons[0] != null && <View style={{ flex: 1 }}>
                                    <RoundButton
                                        style={{ backgroundColor: Color.orange, height: 36 }}
                                        title={buttons[0].title}
                                        bold
                                        onPress={() => buttons[0].onPress && buttons[0].onPress()}
                                    />
                                </View>}
                                {buttons[1] != null && <View style={{ width: 20 }} />}
                                {buttons[1] != null && <View style={{ flex: 1 }}>
                                    <RoundButton
                                        style={{ backgroundColor: Color.primary, height: 36 }}
                                        title={buttons[1].title}
                                        bold
                                        onPress={() => buttons[1].onPress && buttons[1].onPress()}
                                    />
                                </View>}
                            </View>}
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20
    },
    cardContainer: {
        width: '100%',
        borderRadius: 4,
        backgroundColor: 'white',
        padding: 10,
    },
    cardHeader: {
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        height: 36,
        justifyContent: 'center'
    },
    cardBottom: {
        width: '100%',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        marginTop:10,
    },
    cardBody: {
        paddingVertical: 10,
        height:190,
    },
    title: {
        color: Color.primary,
        fontSize: 16
    },
    itemContainer1:{
        flexDirection:'row',
        alignItems:'center',
        height:32
    },
    itemTitle1:{
        color:Color.primary,
        fontSize:12,
        width:50
    },
    itemValue1:{
        color:Color.text,
        fontSize:12,
    },
    itemContainer2:{
        flexDirection:'row',
        alignItems:'center',
        height:32
    },
    itemTitle2:{
        color:Color.text,
        fontSize:12,
        flex:1
    },
    itemValue2:{
        color:Color.darkText,
        fontSize:12,
        flex:1
    },
    itemDelimiter:{
        color:Color.text,
        fontSize:12,
        width:20
    }
})