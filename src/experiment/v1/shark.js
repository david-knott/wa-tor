const SeaCreature = require('./sea-creature');

class Shark extends SeaCreature {
    constructor(x, y, world) {
        super(x, y, world, 'red');
        this.energy = this.world.sharkEnergy;
    }

    getReproduceRate() {
        return this.world.sharkRepoRate;
    }

    getName() {
        return 'shark';
    }

    getPotentialMoves() {
        var me = this;

        var adjacentSpaces = this.getAdjacentSpaces();
        var emptySpaces = adjacentSpaces.filter(as => {
            return me.world.get(as) == null;
        });
        var fishSpaces = adjacentSpaces.filter(as => {
            return (
                me.world.get(as) != null && me.world.get(as).getName() == 'fish'
            );
        });
        var spaces = fishSpaces.length > 0 ? fishSpaces : emptySpaces;
        return spaces;
    }

    eat(fish) {
        this.world.dead.push(fish);
        this.world.fishes--;
        this.energy += 15;
    }

    tryReproduce() {
        var me = this;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
            this.world.born.push(this.world.createSharkAt(next.x, next.y));
            this.world.sharks++;
            me.moveCount = 0;
        }
    }

    move() {
        if (this.energy < 0) {
            this.world.dead.push(this);
            this.world.sharks--;
            return;
        }
        this.energy--;
        var me = this;
        var spaces = this.getPotentialMoves();
        if (spaces.length > 0) {
            let next = spaces[Math.floor(Math.random() * spaces.length)];
            me.tryReproduce();
            let fish = this.world.get(next);
            if (fish) this.eat(fish);
            this.setX(next.x);
            this.setY(next.y);
        }
    }
}

module.exports = Shark;
