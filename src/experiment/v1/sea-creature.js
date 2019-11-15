class SeaCreature {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.baby = false;
        this.moveCount = 0;
        this.id = window.oid++;
    }

    getAndIncrementMoveCount() {
        return ++this.moveCount;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    reproduce(world) {
        var me = this;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate(world)) {
            me.moveCount = 0;
            return true;
        }
        return false;
    }

    getPosition() {
        return {x: this.x, y: this.y};
    }

    getHashCode() {
        return this.x + this.y * 32768;
    }

    move(world) {
        var me = this;
        var adjacentSpaces = world.getAdjacentSpaces(this);
        var spaces = adjacentSpaces.filter(as => {
            return world.get(as) == null;
        });
        if(spaces.length == 0) return {
            state: 'NA' 
        };
        var baby = null;
        let next = spaces[Math.floor(Math.random() * spaces.length)];
        if (this.reproduce(world)) {
            baby = this.getCopy();
            baby.setX(this.x);
            baby.setY(this.y);
            return {
                state: 'BABY',
                thing: baby,
                position: next
            };
        }
        return {
            state: 'MOVE',
            thing: this,
            position: next
        };
    }
}

module.exports = SeaCreature;
