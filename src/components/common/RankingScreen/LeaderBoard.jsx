import {StyleSheet, Text,View} from 'react-native';
import LeaderBoardInfo from './LeaderBoardInfo';
import { useTheme } from '@react-navigation/native';

export default function LeaderBoard({listLeaderBoard,user}) {
    const {theme, toggleTheme} = useTheme();
    const style = (theme!=='dark')?whiteStyle:darkStyle; 
    return (<View style={style.container}>
        {
            listLeaderBoard.map((item,index)=>{
                let isPlayer=false;
                if(item.userId===user.userId)  
                {
                    isPlayer=true;
                }
                return <LeaderBoardInfo info={item} index={index+4} isPlayer={isPlayer} key={"LeaderBoard"+index}></LeaderBoardInfo>
            })
        }
    </View>
    )
}
const whiteStyle= StyleSheet.create( {
    container:{
        marginTop:70,
        marginHorizontal:5,
        padding:20,
        display:'flex',
        flexDirection:'column',
        gap:20,
        backgroundColor:'#6B50F699',
        borderRadius:20
    }
});
const darkStyle = StyleSheet.create( {
    container:{
        marginTop:70,
        marginHorizontal:5,
        padding:20,
        display:'flex',
        flexDirection:'column',
        gap:20,
        backgroundColor:'rgba(107, 80, 246, 0.6)',
        borderRadius:20
    }
});