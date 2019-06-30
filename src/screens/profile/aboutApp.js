import React from 'react'

import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

import Color from '@common/color'
import {connect} from 'react-redux'

class AboutApp extends React.PureComponent{
    constructor(props){
        super(props)

        this.state={
            appVersion:'1.0.0'
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: ()=>Actions.Notifications(),
            notifications: 3,
        });
    }

    render(){
        let {appVersion} = this.state

        return(
            <View style={styles.container}>
                <Text style={styles.primary}>appVersion: {appVersion}</Text>
            </View>
        )
    }
}

const mapProps=({language})=>({language})
const mapDispatch=(dispatch)=>({})
export default connect(mapProps, mapDispatch)(AboutApp)

const styles=StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'white'
    },
    primary:{
        fontSize:12,
        color:Color.primary
    }
})