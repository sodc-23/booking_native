import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    View
} from 'react-native'
import Color from '@common/color'
import { Ionicons } from '@expo/vector-icons'
import { ImagePicker, Permissions, ImageManipulator } from 'expo'
import { emptyAvatar } from '@common/image'
import ActionSheet from 'react-native-actionsheet'

export default class AvatarSelector extends PureComponent {

    async takePicture() {
        let res = await Permissions.askAsync(Permissions.CAMERA)
        if (res.status === 'granted') {
            let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status === 'granted') {

                let image = await ImagePicker.launchCameraAsync({
                    quality: 0.3,
                    allowsEditing: true,
                    aspect: [1, 1]
                })
                if (!image.cancelled) {
                    const manipResult = await ImageManipulator.manipulateAsync(
                        image.uri,
                        [{ resize: { width: 512 } }],
                        { format: 'jpeg', compress: 0.6 }
                    );
                    if (this.props.onChange)
                        this.props.onChange(manipResult.uri)
                }

            }
        }
    }

    async fromLibrary(){
        let res = await Permissions.askAsync(Permissions.CAMERA)
        if (res.status === 'granted') {
            let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status === 'granted') {

                let image = await ImagePicker.launchImageLibraryAsync({
                    quality: 0.3,
                    allowsEditing: true,
                    aspect: [1, 1],
                    mediaTypes:ImagePicker.MediaTypeOptions.Images
                })
                if (!image.cancelled) {
                    const manipResult = await ImageManipulator.manipulateAsync(
                        image.uri,
                        [{ resize: { width: 512 } }],
                        { format: 'jpeg', compress: 0.6 }
                    );
                    if (this.props.onChange)
                        this.props.onChange(manipResult.uri)
                }

            }
        }
    }

    showActionButtons(){
        this.ActionSheet.show()
    }

    render() {
        let { url, onChange } = this.props
        return (
            <TouchableOpacity onPress={() => this.showActionButtons()} style={styles.container}>
                <Image source={url ? { uri: url } : emptyAvatar} style={styles.image} />
                <View style={styles.iconContainer}>
                    <Ionicons name="ios-camera" size={18} color={Color.primary} />
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    // title={'Which one do you like ?'}
                    options={['Take a Picture', 'From Photo Library', 'Cancel']}
                    cancelButtonIndex={2}
                    tintColor={Color.middlePrimary}
                    destructiveButtonIndex={0}
                    onPress={(index) => { 
                        if ( index == 0 ) this.takePicture()
                        if ( index == 1 ) this.fromLibrary()
                     }}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Color.primary
    },
    iconContainer: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Color.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }
})