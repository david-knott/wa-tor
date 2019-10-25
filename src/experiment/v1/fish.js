const SeaCreature = require('./sea-creature');

class Fish extends SeaCreature {
    constructor(x, y) {
        super(x, y);

        this.t = 'fish';
    }

    getColor(){
        return "green";
    }

    getReproduceRate(world) {
        return world.fishRepoRate;
    }

    getName() {
        return 'fish';
    }

    reproduce(world) {
        var me = this;
        var potentialMoves = this.getPotentialMoves(world);
        if(potentialMoves.length === 0)
            return;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate(world)) {
            world.born.push(world.createFishAt(this.x, this.y));
            world.fishes++;
            me.moveCount = 0;
        }
    }

    getPotentialMoves(world) {
        var adjacentSpaces = world.getAdjacentSpaces(this);
        return adjacentSpaces.filter(as => {
            return world.get(as) == null;
        });
    }

    move(world) {
        var me = this;
        var potentialMoves = this.getPotentialMoves(world);
        var nextMoveIndex = Math.floor(Math.random() * potentialMoves.length);
        var nextMove;
        if ((nextMove = potentialMoves[nextMoveIndex])) {
            world.updatePosition(nextMove, me);
        }
    }
}

module.exports = Fish;
