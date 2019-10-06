const SeaCreature = require('./sea-creature');

class Shark extends SeaCreature {
    constructor(x, y, world) {
        super(x, y, world, 'red');
        this.energy = this.world.sharkEnergy;
    }

    getColor() {
        let c = ['#072f5f', '#1261a0', '#3895d3', '#58cced'];
        let i = 3;
        if (this.energy < 10) i = 0;
        if (this.energy < 40) i = 1;
        if (this.energy < 60) i = 2;
        return c[i];
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
        this.energy += 5;
    }

    tryReproduce() {
        var me = this;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
            this.world.born.push(this.world.createSharkAt(this.x, this.y));
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
