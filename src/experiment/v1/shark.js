const SeaCreature = require('./sea-creature');
class Shark extends SeaCreature {
    constructor(x, y, energy) {
        super(x, y);
        this.energy = energy;
        this.t = 'shark';
    }

    getColor() {
        var rgbToHex = function(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            return hex;
        };
        var e = this.energy * 30;
        console.log(e);
        var blue = Math.floor(e % 256);
        var green = Math.floor((e / 256) % 256);
        var red = Math.floor((e / 256 / 256) % 256);
        var s = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
        return s;
    }

    getReproduceRate(world) {
        return world.sharkRepoRate;
    }

    getName() {
        return 'shark';
    }

    getPotentialMoves(world) {
        var me = this;
        var adjacentSpaces = world.getAdjacentSpaces(this);
        var emptySpaces = adjacentSpaces.filter(as => {
            return world.get(as) == null;
        });
        var fishSpaces = adjacentSpaces.filter(as => {
            return world.get(as) != null && world.get(as).getName() == 'fish';
        });
        var spaces = fishSpaces.length > 0 ? fishSpaces : emptySpaces;
        return spaces;
    }

    eat(world, fish) {
        //world.kill(fish);
        fish.alive = false;
        world.fishes--;
        this.energy += 5;
    }

    reproduce(world) {
        var me = this;
        var potentialMoves = this.getPotentialMoves(world);
        if(potentialMoves.length === 0)
            return;
        if (me.getAndIncrementMoveCount() > me.getReproduceRate(world)) {
            world.born.push(world.createSharkAt(this.x, this.y));
            world.sharks++;
            me.moveCount = 0;
        }
    }

    move(world) {
        if (this.energy <= 0) {
            this.alive = false;
            world.sharks--;
            return;
        }
        this.energy--;
        var me = this;
        var spaces = this.getPotentialMoves(world);
        if (spaces.length > 0) {
            let next = spaces[Math.floor(Math.random() * spaces.length)];
            let fish = world.get(next);
            if (fish) this.eat(world, fish);
            world.updatePosition(next, me);
        }
    }
}

module.exports = Shark;
