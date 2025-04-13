class Position {
    constructor(row,column,state,arounds) {
        this.row=row;
        this.column=column;
        this.state=state;
        this.arounds=arounds;
    }
    canBreath(isVisited) {
        isVisited[this.row][this.column]=true;
        
        for(let i=0;i<this.arounds.length;i++) {
            const child = this.arounds[i];
            if(child.state=='0') {
                return true;
            }
            else {
                if(!isVisited[child.row][child.column]&&child.state===this.state) {
                    if(child.canBreath(isVisited)) {
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
        const isVisited =new Array(13).fill(new Array(13).fill(false));
        this.state=state;
        if(!this.canMove(isVisited)) {
            this.state='0';
            return false;
        } 
        return true;
        
    }
}
export default Position;