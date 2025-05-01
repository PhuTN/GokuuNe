class Position {
    constructor(row,column,state,arounds) {
        this.row=row;
        this.column=column;
        this.state=state;
        this.arounds=arounds;
    }
    canBreath(isVisited,res) {
        isVisited[this.row][this.column]=true;
        res.push(this);
        
        
        
        for(let i=0;i<this.arounds.length;i++) {
            const child = this.arounds[i];
            if(child.state=='0') {
                
                return true;
            }
            else {
                if(!isVisited[child.row][child.column]&&child.state==this.state) {
                    
                    if(child.canBreath(isVisited,res)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    dfs(corners,isVisited,res) {
        isVisited[this.row][this.column]=true;
        res.push(this);
        for(let i=0;i<this.arounds.length;i++){
            if(!isVisited[child.row][child.column]&&child.state=='0') {
                if(child.column==0) corners[0]=1;
                if(child.row==0) corners[1]=1;
                if(child.column==12) corners[2]=1;
                if(child.row==12) corners[3]=1;
                child.dfs(corners,isVisited);

            }
        }
    }
    isFree() {
        const corners = new Array(4).fill(0);
        const isVisited= new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array(13).fill(false);
        }
        this.dfs(corners, isVisited,[]);
        const result = corners[0]+corners[1]+corners[2]+corners[3];
        return result>=3;
    }
    canMove(state) {
        if(this.state!='0') {
            return false;
        }
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i]= new Array(13).fill(false);
        }
        const res=[];
        this.state=state;
        if(this.canBreath(isVisited,[])) {
            return true;
        }
        
        for(let i=0;i<this.arounds.length;i++) {
            const child = this.arounds[i];
            if(child.state!='0'&&child.state!=this.state) {
                const isV = new Array(13);
                for(let j=0;j<13;j++) {
                    isV[j]= new Array(13).fill(false);
                }
                if(!child.canBreath(isV,[])) 
                {
                    this.state=state;
                    
                    return true;
                }
            }
            
        }
        this.state='0';
        
        return false;
        
    }
    
    findGroup(isVisited,res) {
        isVisited[this.row][this.column]= true;
        res.push(this);
        for(let i=0;i<this.arounds;i++) {
            const child = this.arounds[i];
            if(!isVisited[child.row][child.column]&&child.state==this.state) {
                child.findGroup(isVisited,res);
            }
        }
    }
    findAllLiberties() {
        const res=[];
        const isVisited = new Array(13);
        for(let i=0;i<13;i++) {
            isVisited[i] = new Array(13).fill(false);
        } 
        const corners = new Array(4).fill(0);
        for(let i=0;i<this.arounds.length;i++) {
            const child = this.arounds[i];
            if(child.state=='0') {
                child.dfs(corners,isVisited,res);
            }
        }
        if(corners[0]+corners[1]+corners[2]+corners[3]>=3) {
            return {
                isSurround:false,
                liberties:res
            }
        }
        return {
            isSurround:true,
            liberties:res
        }
    }
    /*findGroup() {
        let isVisited = new Set();
        let queue = [this];
        let group=[];
        let liberties = new Set();
        while(queue.length>0) {
            let current = queue.shift();
            if(isVisited.has(`${current.row},${current.column}`)) {
                continue;
            } 
            isVisited.add(`${current.row},${current.column}`);
            group.push(current);
            for(let neighbor of current.arounds) {
                if(neighbor.state=='0') {
                    liberties.add(`${neighbor.row},${neighbor.column}`); 

                }
                else if(neighbor.state==this.state) {
                    group.add(`${neighbor.row},${neighbor.column}`);
                }
            }
        }
        return {group,liberties};
    }*/
    
}
export default Position;