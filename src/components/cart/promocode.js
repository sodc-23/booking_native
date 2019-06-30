import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,

} from 'react-native'

import Color from '@common/color'
import Ionicons from '@expo/vector-icons/Ionicons';

const styles = StyleSheet.create({
    container:{
        padding:15
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        height:60,
    },
    input:{
        fontSize:16,
        borderBottomWidth:0.5,
        borderBottomColor:Color.lightText,
        height:36,
        marginRight:15,
        flex:1
    },
    applyText:{
        color:Color.orange,
        fontSize:18,
    },
    bigText:{
        fontSize:16,
        color:Color.text,
        marginTop:15
    },
    optionContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    buttonContainer:{
        width:24,
        height:24,
        borderRadius:12,
        marginRight:10,
        borderColor:Color.lightText,
        borderWidth:0.5,
    },
    codeContainer:{
        borderStyle:'dashed',
        borderColor:Color.orange,
        borderWidth:1
    },
    codeText:{
        fontSize:24,
        color:Color.orange,
        padding:10,
    },
    desc:{
        fontSize:13,
        color:Color.lightText,
        marginTop:15,
    },
    itemContainer:{
        marginTop:15,
        marginLeft:10
    },
    selectedButton:{
        height:30,
        borderWidth:0,
    }
})

const CodeItem=({value, selected, desc, onChange})=>(
    <View style={styles.itemContainer}>
        <View style={styles.optionContainer}>
            <TouchableOpacity onPress={onChange} style={[styles.buttonContainer, selected?styles.selectedButton:{}]}>
                {selected&&<Ionicons name="ios-checkmark-circle" size={29} color={Color.orange}/>}
            </TouchableOpacity>
            <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{value}</Text>
            </View>
        </View>
        <Text style={styles.desc}>
            {desc}
        </Text>
    </View>
)

export default class PromoCode extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            value:'',
            selectedIndex:0,
            codeItems:[
                {value:'YASJFDK', desc:'pinef jifs fesfiefe feifjef efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf'},
                {value:'JDJFDNF', desc:'pinef jifs fesfiefe feifjef efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf efijef sofe fiefjs fiefeijf'},
            ]
        }
    }
    render(){
        let {value, selectedIndex, codeItems} = this.state
        let {onChange} = this.props
        return(
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={value}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={Color.text}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={text=>this.setState({value:text})}
                        placeholder="Enter Code"
                        style={styles.input}
                    />
                    <Text onPress={()=>onChange(value)} style={styles.applyText}>Apply</Text>
                </View>
                <Text style={styles.bigText}>Or choose from below offers</Text>
                {codeItems.map((item, index)=><CodeItem
                    selected={index==selectedIndex}
                    key={index}
                    {...item}
                    onChange={()=>{
                        onChange(item.value)
                        this.setState({selectedIndex:index})
                    }}
                />)}
            </View>
        )
    }
}

