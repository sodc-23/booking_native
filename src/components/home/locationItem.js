import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Color from '@common/color'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

const removeGroupString = (original, group) => {
    if(original.endsWith(` - ${group}`)) {
        return original.substr(0, original.length - group.length - 3)
    } else {
        return original
    }
}
export default LocationItem = ({ location, desc, count, group, onPress }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <FontAwesome name="map-marker" size={24} color={Color.lightText} style={styles.icon}/>
        <View style={styles.content}>
            <Text numberOfLines={2} style={styles.locationText}>{removeGroupString(location, group)}</Text>
            {desc&&desc!=''&&<Text numberOfLines={1} style={styles.descText}>{desc}</Text>}
        </View>
        {count>0&&<View style={styles.countContainer}>
            <Text style={styles.countText}>{count} Hotels</Text>
        </View>}
    </TouchableOpacity>
)

const styles=StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomColor: Color.border,
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems:'center',
        height: 60,
        flexDirection:'row'
    },
    locationText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Color.darkText
    },
    content:{
        flex:1
    },
    descText:{
        fontSize:10,
        color: Color.lightText,
        marginTop:5
    },
    countContainer:{
        height:18,
        width:70,
        borderRadius:9,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:Color.lightText
    },
    countText:{
        fontSize:10,
        color:Color.lightText
    },
    icon:{
        width:34,
        textAlign:'center'
    }
})