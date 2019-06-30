import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native'

import Modal from 'react-native-modalbox';
import Color from '@common/color'
import { TextInput } from 'react-native-gesture-handler';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

const {width:screenWidth} = Dimensions.get('window')

export default class SpecialModal extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            comment:this.props.description||''
        }
    }
    render () {
        let {title, onDone, onRef} = this.props
        let {comment} = this.state
        return (
            <Modal ref={e=>onRef(e)} position="center" style={styles.modal}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{title}</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText = {(comment)=>this.setState({comment})}
                        value={comment}
                        multiline={true}
                        style={styles.input}
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={()=>onDone(comment)}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        height:180,
        borderRadius:8,
        width: screenWidth-30
    },
    headerContainer:{
        backgroundColor:Color.lightBack,
        paddingHorizontal:15,
        justifyContent:'center',
        height:40,
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomWidth:0.5,
        borderBottomColor:Color.border
    },
    content:{
        paddingHorizontal:15,
        paddingTop:10,
        paddingBottom:20,
        flex:1
    },
    headerText:{
        fontWeight:'bold',
        color:Color.dark,
        fontSize:14
    },
    button:{
        height:40,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Color.orange,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    buttonText:{
        fontSize:16,
        color:Color.white,
        fontWeight:'bold'
    },
    bodyContainer:{
        padding:5,
    },
    input:{
        width:'100%',
        height:90,
        borderWidth:1,
        borderColor:Color.border,
        padding:5
    }
})