import React from 'react'

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native'
import Color from '@common/color';
import Ionicons from '@expo/vector-icons/Ionicons'
import Global from "@utils/global";
import _ from 'underscore';

const {T1, T2} = Global.Translate

const nameMapper = [
    {key:'promotions', label:'Recommended'},
    {key:'starrating', label:'Rating'},
    {key:'name', label:'Name'},
    {key:'price', label:'Price'},
    {key:'rate', label:'Price'},
    {key:'airline', label:'Airline'},
    {key:'departure', label:'Departure'},
    {key:'duration', label:'Duration'},
    {key:'arrival', label:'Arrival'},
    {key:'category', label:'Category'},
    {key:'operator', label:'Operator'},
    {key:'departuretime', label:'Departure'},
    {key:'arrivaltime', label:'Arrival'},
]

let getSortList = (list) => {
    return _.sortBy(list, o=>{
        var obj = nameMapper.find(f=>f.key == o.name)
        var pos = obj?nameMapper.indexOf(obj):100
        return pos
    })
}

let getSortName = (sortName) => {
    var mapper = nameMapper||[]
    var obj = mapper.find((o)=>o.key==sortName)
    return obj?obj.label:''
}

const Item=({title, selected, onPress, direction})=>(
    <TouchableOpacity onPress={()=>onPress()} style={styles.itemContainer}>
        <Text style={[styles.itemText,selected?{color:Color.orange}:{}]}>{title}</Text>
        <View style={styles.directionContainer}>
            <Ionicons name="md-arrow-dropup" size={10} color={direction==1&&selected?Color.orange:Color.lightText} style={{marginBottom:-5}}/>
            <Ionicons name="md-arrow-dropdown" size={10} color={direction==-1&&selected?Color.orange:Color.lightText}/>
        </View>
    </TouchableOpacity>
)

export default SortList = ({ selected, list, onPress }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Sort by:</Text>
        {getSortList(list).map((item, index) => {
            var title = getSortName(item.name)
            if(!title) return null
            return (
                <Item
                    title={title}
                    key={index}
                    selected={item.name == selected.name}
                    onPress={()=>{
                        var temp = list.find(o=>o.name==item.name)
                        onPress(list.indexOf(temp))
                    }}
                    direction={selected.order}/>
            )
        }
        )}
    </View>
)


const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title:{
        fontSize:14,
        color:'black',
        fontWeight:'bold',
        marginBottom:10
    },
    itemContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:Color.border,
        borderBottomWidth: 0.5,
        height:40
    },
    itemText:{
        fontSize:13,
    },
    directionContainer:{
        marginLeft:10
    }
})