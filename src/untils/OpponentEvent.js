import { EventRegister } from "react-native-event-listeners";
import { currentPlayerMove } from "../components/common/MatchRankScreen/ChessBoard";
export  function OnOpponentMove(gameState, isCurrentPlayerWhite) {
    const randomState = Math.floor(Math.random()*2);
    if(randomState<=1) {
        return randomState;
    }
    let randomRow = Math.floor(Math.random()*13);
    let randomCol = Math.floor(Math.random()*13);
    const nextState = isCurrentPlayerWhite?'B':'W';
    while(!gameState.posArray[randomRow][randomCol].canMove(nextState)) {
        randomRow = Math.floor(Math.random()*13);
        randomCol = Math.floor(Math.random()*13);
    } 
    
    return [randomCol,randomRow];
}

