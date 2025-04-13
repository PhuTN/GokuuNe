import Position from "./Position";

class GameState {
    constructor() {
        this.posArray = new Array(13);
        this.whiteScore=0;
        this.blackScore=0;
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
        
        this.posArray[row][column].state = state;
        
        //this.checkAfterMove();
    }
    checkAfterMove() {
        
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(this.posArray[i][j].state=='0') {
                    continue;
                }
                const isVisited= new Array(13).fill(new Array(13).fill(false));
                const group=new Array();
                if(!this.posArray[i][j].canBreath(isVisited,group)) {
                    for(let k=0;k<group.length;k++) {
                        if(group[k].state=='B') {
                            this.whiteScore++;
                        }
                        if(group[k].state=='W') {
                            this.blackScore++;
                        }
                        const r = group[k].row;
                        const c=group[k].column;
                        this.posArray[r][c].state='0';
                    }
                    
                }
            }
        }
    }

}
export default GameState;