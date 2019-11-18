class SeaCreature {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.moveCount = 0;
        this.id = window.oid++;
    }

    isDead(){
        return false;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getPosition() {
        return {x: this.x, y: this.y};
    }

    getHashCode() {
        return this.x + this.y * 32768;
    }

    getMeal() {
        return null;
    }

    reproduce(world) {
        var me = this;
        ++this.moveCount;
        if (this.moveCount > me.getReproduceRate(world)) {
            this.moveCount = 0;
            let baby = this.getCopy(world);
            return baby;
        }
        return null;
    }

    getNextPosition(world) {
        var adjacentSpaces = world.getAdjacentSpaces(this);
        var spaces = adjacentSpaces.filter(as => {
            return world.get(as) == null;
        });
        if(spaces.length === 0)
            return null;
        let next = spaces[Math.floor(Math.random() * spaces.length)];
        return next;
    }
}
module.exports = SeaCreature;
