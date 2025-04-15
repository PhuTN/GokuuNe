import Position from "./Position";

class GameState {
    constructor() {
        this.posArray = new Array(13);
        this.whiteScore=2.5;
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
        
        this.checkAfterMove();
    }
    checkAfterMove() {
        
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(this.posArray[i][j].state=='0') {
                    continue;
                }
                const isVisited= new Array(13);
                for(let i=0;i<13;i++) {
                    isVisited[i]= new Array(13).fill(false);
                }
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
    isTechnicallyDead(r,c) {
        const pos = this.posArray[r][c];
        const group=[];
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array().fill(false);
        } 
        pos.findGroup(isVisited,group);
        for(let p of group) {
            for(let i=0;i<p.arounds.length;i++) {
                const aroundPos = p.arounds[i];
                if(aroundPos.state=='0'&&aroundPos.isFree()) {
                    return false;
                }
            }
        }
    }

    territoryAt(row, column, isVisited) {
        if (this.posArray[row][column].state !== '0') {
            isVisited[row][column]=true;
            return ; 
        }
    
        //const isVisited = Array.from({ length: 13 }, () => Array(13).fill(false));
        const queue = [[row, column]];
        const territory = [];
        let hasBlack = false, hasWhite = false;
        let score=0;
        const corners= [0,0,0,0];
        while (queue.length > 0) {
            const [r, c] = queue.pop();
            if (isVisited[r][c]) continue;
            isVisited[r][c] = true;
            territory.push(this.posArray[r][c]);
    
            for (const [nr, nc] of this.aroundPositions(r, c)) {
                if (!isVisited[nr][nc]) {
                    if (this.posArray[nr][nc].state === '0') {
                        queue.push([nr, nc]);
                        if(nr==0) {
                            corners[0]=1;
                        }
                        if(nr==12) {
                            corners[1]=2;
                        } 
                        if(nc==0) {
                            corners[2]=1;
                        } 
                        if(nc==12) {
                            corners[3]=1;
                        }
                        score++;
                        
                    } else if (this.posArray[nr][nc].state === 'B') {
                        hasBlack = true;
                    } else if (this.posArray[nr][nc].state === 'W') {
                        hasWhite = true;
                    }
                }
            }
        }
    
        if (hasBlack && !hasWhite) {
            if(corners[0]+corners[1]+corners[2]+corners[3]>=3) {
                this.blackScore+=(score+1);
            }
            
            
            return;
        } 
        if (hasWhite && !hasBlack) { 
            if(corners[0]+corners[1]+corners[2]+corners[3]>=3) {
                this.whiteScore+=(score+1);
            }


            return;
        } 
        return;
    }
    calculateScore() {
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array(13).fill(false);
        } 
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(!isVisited[i][j]) {
                    this.territoryAt(i,j,isVisited);
                }
            }
        }
    }

    canContinuePlay(nextState) {
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(this.posArray[i][j].canMove(nextState)) {
                    return true;
                }
            }
        }
        return false;
    }

}
export default GameState;