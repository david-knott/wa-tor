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
        var blue = Math.floor(e % 256);
        var green = Math.floor((e / 256) % 256);
        var red = Math.floor((e / 256 / 256) % 256);
        var s = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
        return 'red';
    }

    getReproduceRate(world) {
        return world.config.sharkRepoRate;
    }

    getName() {
        return 'shark';
    }

    getCopy(x, y, world) {
        return new Shark(x, y, 20);
    }

    move(world) {
        this.energy--;
        //remove shark from world
        if (this.energy <= 0) {
            return {
                state: 'SHARK_DEAD',
                thing: this
            };
        }
        var adjacentSpaces = world.getAdjacentSpaces(this);
        var fishSpaces = adjacentSpaces.filter(as => {
            return world.get(as) != null && world.get(as).getName() == 'fish';
        });
        if (fishSpaces.length === 0) {
            return super.move(world);
        } else {
            let next =
                fishSpaces[Math.floor(Math.random() * fishSpaces.length)];
            let fish = world.get(next);
            this.energy += world.config.fishEnergy;
            return {
                state: 'FISH_DEAD',
                thing: fish,
                position: next
            };
        }
    }
}

module.exports = Shark;
