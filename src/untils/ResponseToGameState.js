import { GameState } from "../logic/GameLogic";

export  function ResponseToGameState(moveStringArr) {
    const res =[];
    let isBlackTurn=true;
    const gameState = new GameState();
    for(let i=0;i<moveStringArr.length;i++) {
        if(moveStringArr[i].move=="Black Pass") {
            res.push("Black Pass");
            isBlackTurn=false;
            continue;
        } 
        if(moveStringArr[i].move=="White Pass") {
            res.push("White Pass");
            isBlackTurn=true;
            continue;
        }
        const horizontalPos = moveStringArr[i].move.substring(0,1);
        const verticalPos = moveStringArr[i].move.substring(1,moveStringArr[i].move.length-1);
        let x,y;
        gameState.move(x,y,isBlackTurn?'B':'W');
        isBlackTurn=!isBlackTurn;
        res.push(gameState.posArray);
        
    }
    return res;
}

