import React from 'react'

import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native'

import Color from '@common/color'
import {aboutus} from '@common/image'

export default class AboutUs extends React.PureComponent{
    constructor(props){
        super(props)

        this.state={
            backImage:aboutus,
            contents:[
                '"Madarat AI Tawasol" company was established in 2015 to participate effeciently in developing and qualifying electronic (software?) business infrastructures and raising the awareness about the benefits which follows upgading the business technologically using software.',
                'the compayny has achieved a tangible success during the passing last years and that is utterly proved by the big trust the company has earned from its customers which was built by introducing state-of-the-art solutions that fits their needs followed by a continuous support and desire to boost the succes of their businesses which lead, eventulally, to achieve the targeted goals.',
                "We've determined to be one of the leading pioneers in the IT field since the company was established hence we sued the technological and managerial tools to be able to do our destined role in the most convincing way which compiles with the international standards."
            ]
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: ()=>Actions.Notifications(),
            notifications: 3,
        });
    }

    render(){
        let {backImage, contents} = this.state
        return(
            <View style={styles.container}>
                <Image source={backImage} style={styles.image}/>
                {contents.map((item, index)=>(
                    <Text key={index} style={styles.contentText}>{item}</Text>
                ))}

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
    image:{
        width:'100%',
        height:180,
        resizeMode:'cover'
    },
    contentText:{
        marginTop:20,
        fontSize:12,
        color:Color.lightText
    }
})