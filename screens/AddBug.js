import React from 'react';
import { View, Text, Picker } from 'react-native';
import { IconButton, TextInput, Button, HelperText } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class AddBug extends React.Component {
    constructor() {
        super();
        this.titleErrorMessage = "";
        this.categoryErrorMessage = "";
        this.descriptionErrorMessage = "";
        this.pointsErrormessage = "";

        this.state = {
            selectedCategory: "-",
            selectedPoints: "-",
            descriptionFromInput: "",
            titleFromInput: "",
            errorFromTitleInput: false,
            errorFromCategoryInput: false,
            errorFromDescriptionInput: false,
            errorFromPointsInput: false
        };
    }

    postBug = async () => {
        console.log('post bug');
    }

    render() {
        return(
            <View style={ {flex: 1, backgroundColor: 'white'} }>
                <IconButton
                    icon='arrow-left-thick'
                    style={ {flex: 0.1, position: 'absolute', marginTop: 40, zIndex: 1} }
                    size={35} 
                    onPress={ () => this.props.navigation.navigate("Home") }
                />

                <Text style={ {flex: 0.1, fontWeight: 'bold', textAlign: 'center', fontSize: 20, marginTop: 50, color: "#262731", marginBottom: 10} }>
                    ADD BUG
                </Text>

                <KeyboardAwareScrollView style={ {flex: 0.7} }>
                    <View style={ {marginLeft: 20, marginRight: 20} }>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginTop: 10} }>
                            TITLE
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white', marginBottom: 20} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            placeholder='Bug Title'
                            left={ <TextInput.Icon icon="text-short" size={20}/> }
                            onChangeText={ title => this.setState({titleFromInput: title}) } 
                        />
                        <HelperText  type="error" visible={ this.state.errorFromTitleInput } style={{width:'90%'}}>
                            { this.titleErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            CATEGORY
                        </Text>
                        <View style={ { borderWidth: 1.7, borderRadius: 3000000, borderColor: "#262731", marginBottom: 20} }>
                            <Picker
                                selectedValue={ this.state.selectedCategory }
                                onValueChange={ (category) => this.setState({selectedCategory: category}) }
                            >
                                <Picker.Item label='-' value='-'/>
                                <Picker.Item label='Java' value='java'/>
                                <Picker.Item label='C' value='C'/>
                                <Picker.Item label='Python' value='Python'/>
                            </Picker>
                        </View>
                        <HelperText  type="error" visible={ this.state.errorFromCategoryInput } style={{width:'90%'}}>
                            { this.categoryErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            DESCRIPTION
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white', marginBottom: 20} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            multiline={true}
                            placeholder="Bug Description"
                            onChangeText={ bugD => this.setState({descriptionFromInput: bugD}) }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromDescriptionInput } style={{width:'90%'}}>
                            { this.descriptionErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            BUG POINTS
                        </Text>
                        <View style={ { borderWidth: 1.7, borderRadius: 30, borderColor: "#262731"} }>
                            <Picker
                                selectedValue={ this.state.selectedPoints }
                                onValueChange={ (points) => this.setState({selectedPoints: points}) }
                            >
                                <Picker.Item label='-' value=''/>
                                <Picker.Item label='100' value='100'/>
                                <Picker.Item label='25' value='25'/>
                                <Picker.Item label='50' value='50'/>
                            </Picker>
                        </View>
                        <HelperText  type="error" visible={ this.state.errorFromPointsInput } style={{width:'90%'}}>
                            { this.pointsErrorMessage }
                        </HelperText>
                    </View>
                </KeyboardAwareScrollView>
                <Button 
                    style={ {backgroundColor: "#262731", marginTop: "5%", marginBottom:"5%", width:"40%", height: 40, alignSelf: 'center'} }
                    theme={ {roundness: 20} }
                    mode="contained"
                    onPress = { async () => this.postBug() }
                >
                    POST BUG
                </Button>
            </View>
        )
    }
}