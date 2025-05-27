import React, { useState } from "react"; 
import { View } from "react-native";
import Header from "../components/common/Header";
import ChallengeBoard from "../components/common/ChallengeScreen/ChallengeBoard";
import ResultChallenge from "../components/common/ChallengeScreen/ResultChallenge";
export default function ChallengeDetail({navigation}) {
    const [winOrLose, setWinOrLose] = useState(1); //2:win,0:lose;

    return (<View style={{height:'100%'}}>
        <Header title="Challenge"></Header>
        {winOrLose!=1&&<ResultChallenge  isWin={winOrLose==2} navigation={navigation} setLoseOrWin={setWinOrLose}></ResultChallenge>}
        <ChallengeBoard navigation={navigation} setWinOrLose={setWinOrLose}></ChallengeBoard>
    </View>)
}