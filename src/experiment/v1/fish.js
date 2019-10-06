const SeaCreature = require('./sea-creature');

class Fish extends SeaCreature {
    constructor(x, y, world) {
        super(x, y, world, 'green');
    }

    getColor(){
        return "green";
    }

    getReproduceRate() {
        return this.world.fishRepoRate;
    }

    getName() {
        return 'fish';
    }

    tryReproduce() {
        var me = this;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
            this.world.born.push(this.world.createFishAt(this.x, this.y));
            this.world.fishes++;
            me.moveCount = 0;
        }
    }
    getPotentialMoves() {
        var me = this;
        var adjacentSpaces = this.getAdjacentSpaces();
        return adjacentSpaces.filter(as => {
            return me.world.get(as) == null;
        });
    }

    move() {
        var me = this;
        var potentialMoves = this.getPotentialMoves();
        var nextMoveIndex = Math.floor(Math.random() * potentialMoves.length);
        var nextMove;
        if ((nextMove = potentialMoves[nextMoveIndex])) {
            me.tryReproduce();
            this.setX(nextMove.x);
            this.setY(nextMove.y);
        }
    }
}

module.exports = Fish;
