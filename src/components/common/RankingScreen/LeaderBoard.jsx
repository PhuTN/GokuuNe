import {StyleSheet, Text,View} from 'react-native';
import LeaderBoardInfo from './LeaderBoardInfo';
export default function LeaderBoard({listLeaderBoard,user}) {
    return (<View style={style.container}>
        {
            listLeaderBoard.map((item,index)=>{
                let isPlayer=false;
                if(item.userId===user.userId)  
                {
                    isPlayer=true;
                }
                return <LeaderBoardInfo info={item} index={index+4} isPlayer={isPlayer}></LeaderBoardInfo>
            })
        }
    </View>
    )
}
const style= StyleSheet.create( {
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
})