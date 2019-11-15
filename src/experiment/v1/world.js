const Shark = require('./shark');
const Fish = require('./fish');
const Config = require('./config');
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
        var space;
        if ((space = this.inner[next.x][next.y]) != null) {
            /*
            console.log(
                'Space not empty: Cannot move ' +
                    seaCreature.t +
                    ', space contains a  ' +
                    space.t +
                    '  [' +
                    space.x +
                    ',' +
                    space.y +
                    ']'
            );*/
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
        var c = 0;
        for (var i = 0; i < this.creatures.length; i++) {
            let creature = this.creatures[i];
            let result = creature.move(this);
            switch (result.state) {
                case 'NA':
                    break;
                case 'SHARK_DEAD':
                    this.remove(result.thing);
                    i++;
                    break;
                case 'FISH_DEAD':
                    var j = this.creatures.indexOf(result.thing);
                    if(j < i) {
                        i--;
                    }
                    this.remove(result.thing);
                    this.updatePosition(result.position, creature);
                    break;
                case 'MOVE':
                    this.updatePosition(result.position, result.thing);
                    break;
                case 'BABY':
                    this.updatePosition(result.position, creature);
                    this.add(result.thing);
                    break;
            }
            


            callback(creature);
        }
    }
}
module.exports = World;
