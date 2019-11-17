const Shark = require('./shark');
const Fish = require('./fish');
const Config = require('./config').default;
class World {
    constructor(config) {
        this.config = config;
        this.dead = [];
        this.born = [];
        this.inner = [];
        this.creatures = [];
        this.births = {
            shark: 0,
            fish: 0,
        };
        this.deaths = {
            shark: 0,
            fish: 0,
        };
    }

    createFishAt(x, y) {
        return new Fish(x, y);
    }

    createSharkAt(x, y) {
        return new Shark(x, y, this.config.sharkEnergy);
    }

    init() {
        for (let i = 0; i < this.config.maxX; i++) {
            this.inner[i] = [];
            for (let j = 0; j < this.config.maxY; j++) {
                this.inner[i][j] = null;
            }
        }
        for (let i = 0; i < this.config.fishes; i++) {
            let x = Math.floor(Math.random() * this.config.maxX);
            let y = Math.floor(Math.random() * this.config.maxY);
            let f = this.createFishAt(x, y);
            let c = {
                x: x,
                y: y,
            };
            if (this.spaceFilled(c)) {
                i--;
            } else {
                this.add(f);
            }
        }

        for (let i = 0; i < this.config.sharks; i++) {
            let x = Math.floor(Math.random() * this.config.maxX);
            let y = Math.floor(Math.random() * this.config.maxY);
            let f = this.createSharkAt(x, y);
            let c = {
                x: x,
                y: y,
            };
            if (this.spaceFilled(c)) {
                i--;
            } else {
                this.add(f);
            }
        }
    }

    getNorth(seaCreature) {
        return {
            x: seaCreature.x,
            y: seaCreature.y - 1 < 0 ? this.config.maxY - 1 : seaCreature.y - 1,
        };
    }

    getSouth(seaCreature) {
        return {
            x: seaCreature.x,
            y: seaCreature.y + 1 > this.config.maxY - 1 ? 0 : seaCreature.y + 1,
        };
    }

    getEast(seaCreature) {
        return {
            x: seaCreature.x + 1 > this.config.maxX - 1 ? 0 : seaCreature.x + 1,
            y: seaCreature.y,
        };
    }

    getWest(seaCreature) {
        return {
            x: seaCreature.x - 1 < 0 ? this.config.maxX - 1 : seaCreature.x - 1,
            y: seaCreature.y,
        };
    }

    getAdjacentSpaces(seaCreature) {
        var adjacentSpaces = [];
        adjacentSpaces.push(this.getNorth(seaCreature));
        adjacentSpaces.push(this.getSouth(seaCreature));
        adjacentSpaces.push(this.getEast(seaCreature));
        adjacentSpaces.push(this.getWest(seaCreature));
        return adjacentSpaces;
    }

    updatePosition(next, seaCreature) {
        let space;
        if (next === undefined) throw Error('next undefined');
        if (seaCreature === undefined) throw Error('sea creature undefined');
        if ((space = this.inner[next.x][next.y]) != null) {
            return;
        }
        var oldX = seaCreature.x;
        var oldY = seaCreature.y;
        seaCreature.setX(next.x);
        seaCreature.setY(next.y);
        this.inner[oldX][oldY] = null;
        this.inner[seaCreature.x][seaCreature.y] = seaCreature;
    }

    remove(seaCreature) {
        var idx = this.creatures.indexOf(seaCreature);
        this.creatures.splice(idx, 1);
        this.inner[seaCreature.x][seaCreature.y] = null;
    }

    spaceFilled(cord) {
        return this.get(cord) != null;
    }

    add(seaCreature) {
        if (this.creatures.length < this.config.maxX * this.config.maxY) {
            if (this.spaceFilled({x: seaCreature.x, y: seaCreature.y})) {
                return false;
            }
            this.creatures.push(seaCreature);
            this.inner[seaCreature.x][seaCreature.y] = seaCreature;
            return true;
        }
        return false;
    }

    get(cord) {
        if (
            this.inner[cord.x] === undefined ||
            this.inner[cord.x][cord.y] === undefined
        )
            throw Error(
                'Outside of array bounds [' + cord.x + ',' + cord.y + ']'
            );
        return this.inner[cord.x][cord.y];
    }

    go(callback) {
        for (let i = 0; i < this.creatures.length; i++) {
            let creature = this.creatures[i];
            let next = creature.getNextPosition();
            if (next !== null) {
                if (creature.isDead()) {
                    this.remove(creature);
                    i--;
                } else {
                    //if next position is a fish, it must be a shark moving to eat it
                    let fish = this.get(next);
                    if (fish != null) {
                        var j = this.creatures.indexOf(fish);
                        this.remove(fish);
                        creature.energy += world.config.fishEnergy;
                        if (j <= i) {
                            i--;
                        }
                    }
                    //is the animal reproducing ?
                    let baby = creature.reproduce(this);
                    //move animal to new space so baby can be placed in its old place
                    this.updatePosition(next, creature);
                    if (baby !== null) {
                        this.add(baby);
                    }
                }
            }
            //draw the scene
            callback(creature);
        }
    }
}
module.exports = World;
