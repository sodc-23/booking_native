import React from 'react';

import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from "react-redux";

class MyToast extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps){
        if ( nextProps.showToast ){
            this.refs.toast.show(nextProps.toastText, nextProps.toastDuration)
        }
    }

    render() {
        return (
            <Toast ref="toast" />
        )
    }
}

export default connect(
    state => ({
        toastDuration: state.common.toastDuration,
        toastText: state.common.toastText,
        showToast: state.common.showToast
    }),
    dispatch => ({
        
    })
)(MyToast);