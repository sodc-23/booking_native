import React from 'react'

import Login from '@screens/auth/login'
import Profile from '@screens/profile'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as authAction from '@store/auth';
import * as config from '../../config';

class LoginAndProfile extends React.PureComponent {

    setNavParam(value) {
        this.props.navigation.setParams({
            onRight: () => Actions.Notifications(),
            notifications: 3,
            hideNavBar: value,

        });
    }
    componentWillMount() {
        this.setNavParam(this.props)
        if (this.props.auth.isLoggedIn) {
            this.setNavParam(false)
        }

        if (config.appType == config.B2B) {
            this.props.navigation.setParams({
                hideTabBar: !this.props.auth.isLoggedIn
            })
        }
    }
    componentWillReceiveProps(next) {
        if (next.auth.isLoggedIn != this.props.auth.isLoggedIn) {
            this.setNavParam(this.props.auth.isLoggedIn)
            if (next.auth.needBack && next.auth.isLoggedIn) {
                Actions.jump(next.auth.needBack)
                this.props.actions.setNeedBack(null)
            }

            if (config.appType == config.B2B) {
                this.props.navigation.setParams({
                    hideTabBar: !next.auth.isLoggedIn
                })
            }
        }


    }
    render() {
        let { isLoggedIn } = this.props.auth
        return isLoggedIn ? <Profile /> : <Login />
    }
}

const mapStateToProps = ({ auth }) => ({ auth });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...authAction }, dispatch)
});

export default LoginAndProfile = connect(mapStateToProps, mapDispatchToProps)(LoginAndProfile);