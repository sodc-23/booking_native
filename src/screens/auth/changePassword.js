import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Alert
} from 'react-native'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import RoundButton from '@components/general/roundButton'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userAction from '@store/user';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

class ChangePasswordC extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: ()=>Actions.Notifications(),
            notifications: 3,
        });
    }

    done(){
        let {oldPassword, newPassword, confirmPassword} = this.state

        if(!newPassword || !confirmPassword) {
            return
        }
        let {T1} = this.props.language
        if(newPassword != confirmPassword) {
            return alert(T1('message1'))
        }
        this.props.actions.setPassword(oldPassword, newPassword). then((err)=>{
            if(err) {
                if(err == 'NOT_FOUND') {
                    Alert.alert(T1('message2'))
                }
            } else {
                Alert.alert('', T1('message3'), [
                    {text:'OK', onPress:()=>Actions.pop()}
                ],
                {cancelable: false})
            }
        })
    }

    render() {
        let {newPassword, confirmPassword, oldPassword} = this.state
        let {status} = this.props.user
        const isLoading = status==userAction.LOADING
        let {T3, T2} = this.props.language
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <FloatLabelTextInput
                        placeholder={T3("Old Password")}
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={oldPassword}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({oldPassword:text})}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FloatLabelTextInput
                        placeholder={T2("New Passowrd(minimum 6 characters)")}
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={newPassword}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({newPassword:text})}
                        onSubmitEditing={()=>this.confirm.focus()}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FloatLabelTextInput
                        ref={e=>this.confirm=e}
                        placeholder={T3("Confirm New Password")}
                        placeholderTextColor={Color.lightText}
                        style={styles.input}
                        value={confirmPassword}
                        secureTextEntry={true}
                        onChangeText={(text)=>this.setState({confirmPassword:text})}
                        onSubmitEditing={()=>this.done()}
                    />
                </View>
                <RoundButton
                    disabled={isLoading || newPassword != confirmPassword || newPassword.length < 6 || !oldPassword}
                    disabledUI={newPassword != confirmPassword || newPassword.length < 6}
                    title={T3("Change Password")}
                    isLoading={isLoading}
                    onPress={()=>this.done()}
                    style={styles.button}
                    textStyle={styles.buttonText}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ user, language }) => ({ user, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...userAction }, dispatch)
});

export default ChangePassword = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding:20,
    },
    inputContainer:{
        height:50,
        width:'100%',
    },
    button:{
        marginTop:20
    },
    buttonText:{
        fontWeight:'bold'
    },
    input:{
        color:Color.primary
    }
})