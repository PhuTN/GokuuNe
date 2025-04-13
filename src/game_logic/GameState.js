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
        const res = new Array(4);
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
}
export default GameState;