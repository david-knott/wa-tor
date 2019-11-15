const SeaCreature = require('./sea-creature');

class Fish extends SeaCreature {
    constructor(x, y) {
        super(x, y);
        this.t = 'fish';
    }

    getColor() {
        return 'green';
    }

    getReproduceRate(world) {
        return world.config.fishRepoRate;
    }

    getName() {
        return 'fish';
    }

    getCopy(x, y) {
        return new Fish(x, y);
    }
}

module.exports = Fish;
