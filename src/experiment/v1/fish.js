const SeaCreature = require('./sea-creature');

class Fish extends SeaCreature {
    constructor(x, y) {
        super(x, y);
        this.t = 'fish';
    }

    getColor() {
        var rgbToHex = function(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            return hex;
        };
        var e = this.energy * 10;
        var blue = Math.floor(e % 256);
        var green = 255; // Math.floor((e / 256) % 256);
        var red = Math.floor((e / 256 / 256) % 256);
        var s = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
        return 'green';
    }

    getReproduceRate(world) {
        return world.config.fishRepoRate;
    }

    getName() {
        return 'fish';
    }

    getCopy(world) {
        return new Fish(this.x, this.y);
    }
}

module.exports = Fish;
