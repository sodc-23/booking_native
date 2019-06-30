import React from 'react'

import {
    View,
    Text,
    Platform,
    WebView,
    StyleSheet,
} from 'react-native'

import Color from '@common/color'

export default class Privacy extends React.PureComponent{
    constructor(props){
        super(props)

        this.state={
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title:this.props.title,
        });
    }

    render(){
        let {html} = this.props
        return(
            <View style={styles.container}>
                <WebView
                    style={{flex:1}}
                    source={{html}}
                    scalesPageToFit={Platform.OS==='android'}
                />
            </View>
        )
    }
}

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