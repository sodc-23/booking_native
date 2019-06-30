import React, {PureComponent} from 'react'
import {
    ImageBackground,
    StyleSheet,
    BackHandler
} from 'react-native'

import {offline, maintenance} from '@common/image'
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";

class General extends PureComponent{

    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        if ( nextProps.hasInternetConnection ){
            // Actions.pop()    
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        // ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }

    render(){
        return(
            <ImageBackground 
                style={styles.background}
                source={
                    this.props.screenType=='offline'?offline:maintenance
                }/>
        )
    }
}

export default connect(
    state => ({
      hasInternetConnection: state.common.internetConnection,
    }),
    dispatch => ({})
)(General);

const styles = StyleSheet.create({
    background:{
        flex:1,
        alignItems:'center',
        justifyContent: 'flex-end'
    }
})