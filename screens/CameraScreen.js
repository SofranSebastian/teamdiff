import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { ImageManipulator } from 'expo-image-crop'
export default class CameraScreen extends React.Component {
    constructor() {
        super();
        this.camera = null;
        this.state = {
            cameraType: Camera.Constants.Type.back,
            isFlashOn: 'off',
            showPicture: false,
            image: {},
        };
    }

    snap = async () => {
        let options={
            base64:true
        }
        if (this.camera) {
          let photo = await this.camera.takePictureAsync(options);
            this.setState({     showPicture:true,
                                image: photo,
            }) 
   
        }
      };

    render() {
        return(                     
                <Camera     type={this.state.cameraType}
                            style={{flex: 1,width:"100%", height:'100%'}}
                            ratio='16:9'
                            ref={ref => {
                                this.camera = ref;
                            }}
                            flashMode={this.state.isFlashOn}
                >
                    <View style={{position:'absolute', bottom:20, zIndex:98, marginHorizontal:"40%", alignItems:'center', justifyContent:'center'}}> 
                            <IconButton icon="camera"
                                        size={40}
                                        color="white"
                                        style={{backgroundColor:"#262731"}}
                                        onPress={async() => await this.snap()}
                            />
                    </View>
                    <View style={{position:'absolute', top:'10%', right:'5%', alignItems:'center', justifyContent:'center'}}> 
                            <IconButton icon="camera-switch"
                                        size={30}
                                        color="white"
                                        style={{backgroundColor:"#262731"}}
                                        onPress={() => { 
                                            this.state.cameraType === Camera.Constants.Type.back ?
                                                this.setState({cameraType: Camera.Constants.Type.front})
                                            :
                                                this.setState({cameraType: Camera.Constants.Type.back})
                                        }}
                            />
                    </View>
                    <View style={{position:'absolute', top:'17.5%', right:'5%', alignItems:'center', justifyContent:'center'}}> 
                            <IconButton icon="flash"
                                        size={30}
                                        color={ this.state.isFlashOn === 'off' ? "white" : "#262731"}
                                        style={this.state.isFlashOn ==='off' ? {backgroundColor:"#262731"} : {backgroundColor:"white"}}
                                        onPress={() => { 
                                            this.state.isFlashOn === 'off' ?
                                                this.setState({isFlashOn: 'on'})
                                            :
                                                this.setState({isFlashOn: 'off'})
                                        }}
                            />
                    </View>
                    <View style={{position:'absolute', top:'10%', left:'5%', alignItems:'center', justifyContent:'center'}}> 
                            <IconButton icon="chevron-left"
                                        size={30}
                                        color="white"
                                        style={{backgroundColor:"#262731"}}
                                        onPress={() => this.props.navigation.navigate('AddBug',{image:null})}
                            />
                    </View>
                    { this.state.showPicture === true ?
                            <View style={{width:'100%', height:'100%', backgroundColor:'black'}}>
                         
                            <ImageManipulator
                                photo={this.state.image}
                                isVisible={true}
                                onPictureChoosed={uriM =>  this.props.navigation.navigate('AddBug',{image:this.state.image})}
                                onToggleModal={()=>this.setState({showPicture:false})}
                                saveOptions={{
                                    compress: 1,
                                    format: 'jpeg',
                                    base64: true, 
                                }}
                                btnTexts={{
                                    done: 'Ok',
                                    crop: 'Crop',
                                    processing: 'Process',
                                }}
                            /> 
                            </View>
                    :
                        null
                    }
                </Camera>
        )
    }
}