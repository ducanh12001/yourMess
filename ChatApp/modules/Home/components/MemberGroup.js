import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Checkbox } from 'react-native-paper';

const MemberGroup = () => {
  
  const [checked,setChecked] = React.useState(false);
  return (
    <View>
    <TouchableOpacity style = {styles.viewMember}> 
                    <View>
                      
                    </View>
                    <View>
                       <Text style={styles.viewName}>yêu Đạt quá 00 </Text>
                       <Text style = {styles.viewMes}>kkk</Text>
                    </View>
                    <View style={{position : 'absolute',right : 10,top : 20}}>
                    <Checkbox
                      status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                    </View>
    </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    container : {
      display : 'flex',
      flexDirection : 'column'
    },
    avatar :{
      justifyContent: 'center',
      alignItems :'center',
      width : '100%',
      marginTop : 20
    },
    viewMember : {
        display : 'flex',
        flexDirection : 'row',
        marginTop : 5,
        padding : 10,
        borderBottomColor : 'gray',
        borderBottomWidth : 0.3
    },
    viewName : {
        display : 'flex',
        fontSize : 18,
        fontWeight : 'bold',
        color : 'black',
        paddingLeft : 10
    },
    viewMes : {
        display : 'flex',
        paddingLeft : 10,
        color : 'black'
    },
    search :{
        borderRadius : 100,
        margin : 10,
    },
    Appbar : {
        backgroundColor : 'white'
    }
})

export default MemberGroup