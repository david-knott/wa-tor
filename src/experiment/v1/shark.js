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
        var e = this.energy;
        var blue = Math.floor(e % 256);
        var green = Math.floor((e / 256) % 256);
        var red = 255; //Math.floor((e / 256 / 256) % 256);
        var s = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
        return s;
    }

    getReproduceRate(world) {
        return world.config.sharkRepoRate;
    }

    getName() {
        return 'shark';
    }

    getCopy(world) {
        return new Shark(this.x, this.y, world.config.sharkEnergy);
    }

    getNextPosition() {
        var adjacentSpaces = world.getAdjacentSpaces(this);
        var fishSpaces = adjacentSpaces.filter(as => {
            return world.get(as) != null && world.get(as).getName() == 'fish';
        });
        if (fishSpaces.length === 0) return super.getNextPosition();
        else {
            let next =
                fishSpaces[Math.floor(Math.random() * fishSpaces.length)];
            return next;
        }
    }

    getMeal() {
        let next = this.getNextPosition();
        let fish = world.get(next);
        return fish;
    }

    isDead() {
        this.energy--;
        if (this.energy <= 0) {
            return true;
        }
        return false;
    }
}

module.exports = Shark;
