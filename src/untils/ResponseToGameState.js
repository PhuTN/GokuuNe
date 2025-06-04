import { GameState } from "../logic/GameLogic";

export  function ResponseToGameState(moveStringArr) {
    const res =[];
    let isBlackTurn=true;
    const gameState = new GameState();
    for(let i=0;i<moveStringArr.length;i++) {
        if(moveStringArr[i].move=="Black pass") {
            res.push("Black pass");
            isBlackTurn=false;
            continue;
        } 
        if(moveStringArr[i].move=="White pass") {
            res.push("White pass");
            isBlackTurn=true;
            continue;
        }
        const horizontalPos = (""+moveStringArr[i].move).substring(0,1);
        const verticalPos =(""+ moveStringArr[i].move).substring(1,moveStringArr[i].move.length);
        console.log(verticalPos);
        const x = 19-parseInt(verticalPos);
        const y = (horizontalPos+"").charCodeAt(0)-65;
        console.log("X and Y",x,y);

        gameState.move(x,y,isBlackTurn?'B':'W');
        isBlackTurn=!isBlackTurn;
        res.push(copyPosArrayToAnotherArray(gameState.posArray));
        
    }
    return res;

}
function copyPosArrayToAnotherArray(posArray) {
    const res = new Array(19);
    for(let i=0;i<19;i++) {
        res[i]= []
        for(let j=0;j<19;j++) {
            res[i].push(posArray[i][j]);
        }
    }
    return res;
}

