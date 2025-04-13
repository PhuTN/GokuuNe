import Position from "./Position";

class GameState {
    constructor() {
        this.posArray = new Array(13);
        
        for(let i=0;i<13;i++) {
            const row = new Array(13);
            for(let j=0;j<13;j++) {
                row[j]= new Position(i,j,'0',[]);
            }
            this.posArray[i]=row;
        }
        this.connectPositions();
        /*for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                const arounds = this.aroundPositions(i,j);
                for(let k=0;k<arounds.length;k++) {
                    this.posArray[i][j].arounds.push(this.posArray[arounds[k][0]][arounds[k][1]]);
                }
            }
        }*/
    }
    connectPositions() {
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                const arounds = this.aroundPositions(i,j);
                for(let k=0;k<arounds.length;k++) {
                    this.posArray[i][j].arounds.push(this.posArray[arounds[k][0]][arounds[k][1]]);
                }
            }
        }
    }
    aroundPositions(row,column) {
        const res = [];
        if(row+1<=12) {
            res.push([row+1,column]);
        }
        if(row-1>=0) {
            res.push([row-1,column]);
        } 
        if(column+1<=12) {
            res.push([row,column+1]);
        } 
        if(column-1>=0) {
            res.push([row,column-1]);
        }
        return res;
    }
    convertToBoardData() {
        const boardData= new Array(13);
        for(let i=0;i<13;i++) {
            const row = new Array(13);
            for(let j=0;j<13;j++){
                row[j]= this.posArray[i][j].state;
            }
            boardData[i]=row;
        } 
        return boardData;
    } 
    move(row, column, state) {
        if(!this.posArray[row][column].canMove()) {
            return;
        }
        this.posArray[row][column] = state;
    }

}
export default GameState;