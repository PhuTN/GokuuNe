export class GameState {
    constructor() {
        this.posArray = new Array(13);
        this.history1= new Array(13);
        this.history2= new Array(13);
        for(let i=0;i<13;i++) {
            this.posArray[i]=new Array(13).fill('0');
            this.history1[i]= new Array(13).fill('0');
            this.history2[i]= new Array(13).fill('0');
        }
       
        this.whiteScore=6.5;
        this.blackScore=0;
    }
    canBreath(isVisited, row, column) {
        
        const a= this.arounds(row, column);
        isVisited[row][column]=true;
        for(let i=0;i<a.length;i++) {
            const childRow = a[i][0];
            const childColmun=a[i][1];
            if(this.posArray[childRow][childColmun]=='0') {
                return true;
            }

            if(!isVisited[childRow][childColmun]&&this.posArray[childRow][childColmun]==this.posArray[row][column]&&this.canBreath(isVisited,childRow,childColmun)) {
                return true;
            }
        }
        return false;
        
    }
    move(row, column, state) {
        if(this.posArray[row][column]!='0') {
            return false;
        }
        const currentGameState = new Array(13);
        for(let i=0;i<13;i++) {
            currentGameState[i]= new Array(13);
            for(let j=0;j<13;j++) {
                currentGameState[i][j]= this.posArray[i][j];
            }
        }
        this.posArray[row][column]=state;
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array(13).fill(false);
        }
        const currentBlackSocre= this.blackScore;
        const currentWhiteScore= this.whiteScore;
        
        if(this.canBreath(isVisited,row,column)) {
            const a = this.arounds(row,column);
            
            for(let i=0;i<a.length;i++) {
                const childRow=a[i][0];
                const childColmun=a[i][1];
                if(this.posArray[childRow][childColmun]!='0'&&this.posArray[childRow][childColmun]!=this.posArray[row][column]) {
                    const isV = new Array(13);
                    for(let i=0;i<13;i++) {
                        isV[i]= new Array(13).fill(false);
                    }
                    if(!this.canBreath(isV,childRow,childColmun)) {
                        console.log("Capture");
                        this.clearCapture(childRow,childColmun);
                    }
                }
            }
            if(this.isRepeat()) {
                this.posArray=currentGameState;
                this.blackScore=currentBlackSocre;
                this.whiteScore=currentWhiteScore;
                return false;
            }
            else {
                this.saveHistory();
                return true;
            }
        }
        else {
            console.log("New pos can not breath");
            const a = this.arounds(row,column);
            let isCapture=true;
            for(let i=0;i<a.length;i++) {
                const childRow=a[i][0];
                const childColmun=a[i][1];
                if(this.posArray[childRow][childColmun]!='0'&&this.posArray[childRow][childColmun]!=state) {
                    const isV = new Array(13);
                    for(let i=0;i<13;i++) {
                        isV[i]= new Array(13).fill(false);
                    }
                    if(!this.canBreath(isV,childRow,childColmun)) {
                        isCapture=false;
                        this.clearCapture(childRow,childColmun);
                    }
                }
            }
            if(isCapture) {
                this.state='0';
                return false;
            }
            if(this.isRepeat()) {
                this.posArray=currentGameState;
                this.blackScore=currentBlackSocre;
                this.whiteScore=currentWhiteScore;
                return false;
            }
            else {
                this.saveHistory();
                return true;
            }
        }
    }
    isRepeat() {
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(this.posArray[i][j]!=this.history1[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    saveHistory() {
        
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                this.history1[i][j]=this.history2[i][j];
                this.history2[i][j]=this.posArray[i][j];
            }
        }
    }
    arounds(row, column) {
        const res=[];
        if(row-1>=0) {
            res.push([row-1,column]);
        }
        if(row+1<=12) {
            res.push([row+1,column]);
        } 
        if(column-1>=0) {
            res.push([row,column-1]);
        } 
        if(column+1<=12) {
            res.push([row,column+1]);
        }
        return res;
    }
    findGroup(isVisited, row, column, res) {
        res.push([row,column]);
        isVisited[row][column]=true;
        const a = this.arounds(row,column);
        for(let i=0;i<a.length;i++) {
            const childRow= a[i][0];
            const childColmun=a[i][1];
            if(!isVisited[childRow][childColmun]&&this.posArray[childRow][childColmun]==this.posArray[row][column]) {
                this.findGroup(isVisited,childRow,childColmun,res);
            }
        }
    }
    
    clearCapture(row,column) {
        console.log("Clear capture");
        const res=[];
        const isVisited= new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array(13).fill(false);
        }
        this.findGroup(isVisited,row,column,res);
        const isPlusBlack = this.posArray[row][column]=='B'?false:true;
        for(let i=0;i<res.length;i++) {
            if(isPlusBlack) {
                this.blackScore++;
            } 
            else {
                this.whiteScore++;
            }
            this.posArray[res[i][0]][res[i][1]]='0';
        }
    }
    dfs(isVisited, row, column, corner, touch,res) {
        isVisited[row][column]=true;
       
        if(row==0) {
            corner[0]=1;
        } 
        if(row==12) {
            corner[1]=1;
        } 
        if(column==0) {
            corner[2]=1;
        } 
        if(column==12) {
            corner[3]=1;
        }
        const a =this.arounds(row,column);
        res.push([row,column]);
        for(let i=0;i<a.length;i++) {
            const childRow=a[i][0];
            const childColmun=a[i][1];
            if(isVisited[childRow][childColmun]) {
                continue;
            }
            if(this.posArray[childRow][childColmun]=='0') {
                this.dfs(isVisited,childRow,childColmun,corner,touch,res);
            }
            if(this.posArray[childRow][childColmun]=='B') {
                touch.black=true;
                
           }
           if(this.posArray[childRow][childColmun]=='W') {
                touch.white=true;
                
            }
        }
    }
    isFree(row, column, isVisited) {
        
        
        const corner=[0,0,0,0]; 
        const touch={
            black:false,
            white:false
        }
        const res=[];
        this.dfs(isVisited,row,column,corner,touch,res);
        const cornerSum = corner[0]+corner[1]+corner[2]+corner[3];
        return cornerSum>=3;
    }
    isDeathTechnique(row, column) { 
        
        if(this.posArray[row][column]!='0') {
            const res=[];
            const isVisited = new Array(13);
            for(let i=0;i<13;i++) {
                isVisited[i]=new Array(13).fill(false);
            }
            this.findGroup(isVisited,row,column,res);
            const surroundedPos=[];
            for(let i=0;i<res.length;i++) {
                const allieRow=res[i][0];
                const allieColumn=res[i][1];
                const aroundAllie= this.arounds(allieRow,allieColumn);
                
                const isV = new Array(13);
                for(let k=0;k<13;k++) {
                    isV[k]= new Array(13).fill(false);
                }
                for(let j=0;j<aroundAllie.length;j++) {
                    const childRow=aroundAllie[j][0];
                    const childColmun=aroundAllie[j][1];
                    if(this.posArray[childRow][childColmun]=='0') {
                        
                        const corner=[0,0,0,0]; 
                        const touch={
                            black:false,
                            white:false
                        }
                        const res=[];
                        if(!isV[childRow][childColmun]) {
                            this.dfs(isV,childRow,childColmun,corner,touch,res);
                            const cornerSum= corner[0]+corner[1]+corner[2]+corner[3];
                            if(cornerSum>=3){
                                return {
                                    isDeath:false,
                                    group:res
                                }
                            }
                            surroundedPos.push([childRow,childColmun]);
                    }

                    }
                }

            }
            return {
                isDeath:surroundedPos.length<2,
                group:res
            }

        }
        return {
            isDeath:false,
            group:[]
        }

    }
    clearDeathTechnique() {
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                const boxData = this.isDeathTechnique(i,j);
                if(boxData.isDeath) {
                    for(let k=0;k<boxData.group.length;k++) {
                        this.posArray[boxData.group[k][0]][boxData.group[k][1]]='0';
                    }
                }
            }
        }
    }
    calculateScore() {
        this.clearDeathTechnique();
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]=new Array(13).fill(false);
        }
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(!isVisited[i][j]) {
                    const corner =[0,0,0,0];
                    const res=[];
                    const touch={
                        black:false,
                        white:false
                    };
                    
                    if(this.posArray[i][j]=='0') {
                        this.dfs(isVisited,i,j,corner,touch,res);
                        const cornerSum= corner[0]+corner[1]+corner[2]+corner[3];
                        if(cornerSum<3) {
                            if(touch.black==true&&touch.white==false) {
                                this.blackScore+=res.length;
                            } 
                            if(touch.black==false&&touch.white==true) {
                                this.whiteScore+=res.length;
                            }
                        }
                    }
                }
            }
        }
        console.log("BlackScore",this.blackScore);
        console.log("WhiteScore",this.whiteScore)
    }
}