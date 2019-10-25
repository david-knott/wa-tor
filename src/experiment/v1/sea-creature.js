class SeaCreature {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.moveCount = 0;
        this.reproduceRate = 10;
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

    getHashCode() {
        return this.x + this.y * 32768;
    }
}

module.exports = SeaCreature;
