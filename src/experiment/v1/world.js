const Shark = require('./shark');
const Fish = require('./fish');
class World {
    constructor() {
        this.dead = [];
        this.born = [];
        this.maxX = 1;
        this.maxY = 1;
        this.scale = 10;
        this.sharkRepoRate = 20;
        this.fishRepoRate = 20;
        this.sharkEnergy = 10;
        this.fishes = 0;
        this.sharks = 0;
        this.frameRate = 1;
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
        return new Fish(x, y, this);
    }

    createSharkAt(x, y) {
        return new Shark(x, y, this);
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

    remove(seaCreature) {
        var idx = this.creatures.indexOf(seaCreature);
        this.inner[seaCreature.x][seaCreature.y] = null;
        this.creatures.splice(idx, 1);
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
            throw Error('Outside of array bounds');
        return this.inner[cord.x][cord.y];
    }

    go(callback) {
        for (var i = 0; i < this.creatures.length; i++) {
            //  console.log(this.creatures.length);
            var oldX = this.creatures[i].x;
            var oldY = this.creatures[i].y;
            this.inner[oldX][oldY] = null;
            this.creatures[i].move();
            this.inner[this.creatures[i].x][
                this.creatures[i].y
            ] = this.creatures[i];
            callback(
                {
                    x: oldX,
                    y: oldY,
                },
                this.creatures[i]
            );
			//process the dead and born stacks
            while (this.dead.length > 0) {
                let creature = this.dead.pop();
                this.remove(creature);
                i--;
            }
            while (this.born.length > 0) {
                let creature = this.born.pop();
                if (this.add(creature)) i++;
            }
        }
    }
}

module.exports = World;
