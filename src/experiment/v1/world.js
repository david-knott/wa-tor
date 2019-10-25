const Shark = require('./shark');
const Fish = require('./fish');
class World {
    constructor() {
        this.dead = [];
        this.born = [];
        this.maxX = 0;
        this.maxY = 0;
        this.scale = 10;
        this.sharkRepoRate = 15;
        this.fishRepoRate = 7;
        this.sharkEnergy = 10;
        this.fishes = 0;
        this.sharks = 0;
        this.frameRate = 0.5;
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
        return new Shark(x, y, this.sharkEnergy);
    }

    init() {
        for (let i = 0; i < this.maxX; i++) {
            this.inner[i] = [];
            for (let j = 0; j < this.maxY; j++) {
                this.inner[i][j] = null;
            }
        }
        for (let i = 0; i < this.fishes; i++) {
            let x = Math.floor(Math.random() * this.maxX);
            let y = Math.floor(Math.random() * this.maxY);
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

        for (let i = 0; i < this.sharks; i++) {
            let x = Math.floor(Math.random() * this.maxX);
            let y = Math.floor(Math.random() * this.maxY);
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
            y: seaCreature.y - 1 < 0 ? this.maxY - 1 : seaCreature.y - 1,
        };
    }

    getSouth(seaCreature) {
        return {
            x: seaCreature.x,
            y: seaCreature.y + 1 > this.maxY - 1 ? 0 : seaCreature.y + 1,
        };
    }

    getEast(seaCreature) {
        return {
            x: seaCreature.x + 1 > this.maxX - 1 ? 0 : seaCreature.x + 1,
            y: seaCreature.y,
        };
    }

    getWest(seaCreature) {
        return {
            x: seaCreature.x - 1 < 0 ? this.maxX - 1 : seaCreature.x - 1,
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
        if( (space = this.inner[next.x][next.y]) != null){
            console.log("Space not empty: Cannot move " + seaCreature.t + ", space contains a  " + space.t + "  [" + space.x + "," + space.y + "]");
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
        if (seaCreature.getName() == 'fish') this.deaths.fish++;
        else this.deaths.shark++;
    }

    spaceFilled(cord) {
        return this.get(cord) != null;
    }

    add(seaCreature) {
        if (this.creatures.length < this.maxX * this.maxY) {
            if (this.spaceFilled({x: seaCreature.x, y: seaCreature.y}))
                return false;
            this.creatures.push(seaCreature);
            this.inner[seaCreature.x][seaCreature.y] = seaCreature;
            if (seaCreature.getName() == 'fish') this.births.fish++;
            else this.births.shark++;
            return true;
        }
        return false;
    }

    get(cord) {
        if (
            this.inner[cord.x] === undefined ||
            this.inner[cord.x][cord.y] === undefined
        )
            throw Error('Outside of array bounds [' + cord.x + ',' + cord.y + ']');
        return this.inner[cord.x][cord.y];
    }

    kill(seaCreature){
        world.dead.push(seaCreature);
     //   this.inner[seaCreature.x][seaCreature.y] = null;
    }

    go(callback) {
        var c = 0;
        for (var i = 0; i < this.creatures.length; i++) {
            if(!this.creatures[i].alive){
                this.remove(this.creatures[i]);
                i--;
                continue;
            } 
            if(this.creatures[i].reproduce(this)){
                let creature = this.born.pop();
                if (this.add(creature)) i++;
            }
            this.creatures[i].move(this);
            callback(this.creatures[i]);
        }
    }
}
module.exports = World;
