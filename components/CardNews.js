import * as React from 'react';
import { TouchableOpacity,  Linking, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

function CardNews(props){
    return(
        <Card style={{  marginHorizontal:5, 
                        width:175,
                        height:175,
                        borderRadius:15,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        
                        elevation: 3,
                    }}
        >
            <Card.Title title={ props.title }
                        titleStyle={{ fontSize:12, fontFamily:'normal-font', fontWeight:'bold', lineHeight:15,  color:"#262731" }}
                        titleNumberOfLines={2}
            />
            <Card.Cover source={{ uri: props.urlToImage }} style={{ height:75 }} />
            <Card.Actions style={{ justifyContent:'flex-end' }}>
                <TouchableOpacity   style={{ flexDirection:'row', alignItems:'center' }}
                                    onPress={ () => {
                                    Linking.openURL(props.url)
                                    .catch(err => {
                                        console.error("Failed opening page because: ", err)
                                        alert('Failed to open page')
                                    })}}>
                    <Avatar.Icon size={25} icon="launch" color="#262731" style={{backgroundColor:'white'}} />
                    <Text style={{ fontSize:10, fontFamily:'normal-font', fontWeight:'bold' }}>SEE MORE</Text>
                </TouchableOpacity>
            </Card.Actions>
        </Card>
    )
};

export default CardNews;