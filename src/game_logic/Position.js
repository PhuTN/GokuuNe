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
        
        if(!this.canBreath(isVisited,res)) {
            this.state='0';

            return false;
        } 
        this.state='0';
        return true;
        
    }
}
export default Position;