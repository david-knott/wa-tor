class SeaCreature {

    constructor(x, y, world, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.world = world;
        this.moveCount = 0;
	this.reproduceRate = 10;

    }
	
   getAndIncrementMoveCount() {
        return ++this.moveCount;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getNorth() {
        return {
            x: this.x,
            y: (this.y - 1 < 0 ? this.world.maxY - 1 : this.y - 1 )
        }
    }

    getSouth() {
        return {
            x: this.x,
            y: (this.y + 1 > this.world.maxY - 1 ? 0 : this.y + 1)
        }
    }


    getEast() {
        return {
            x: (this.x + 1 > this.world.maxX - 1 ? 0 : this.x + 1),
            y: this.y
        }
    }

    getWest() {
        return {
            x: (this.x - 1 < 0 ? this.world.maxX - 1: this.x - 1),
            y: this.y
        }
    }

    getAdjacentSpaces() {
        var adjacentSpaces = [];
        adjacentSpaces.push(this.getNorth());
        //adjacentSpaces.push(this.getNorthWest());
       // adjacentSpaces.push(this.getNorthEast());
        adjacentSpaces.push(this.getSouth());
       // adjacentSpaces.push(this.getSouthWest());
        //adjacentSpaces.push(this.getSouthEast());
        adjacentSpaces.push(this.getEast());
        adjacentSpaces.push(this.getWest());
        return adjacentSpaces;
    }
}

class Fish extends SeaCreature {

    constructor(x, y, world) {
        super(x, y, world, "green");
    }

getReproduceRate() {
return this.world.fishRepoRate;
}
 
    getName() {
        return "fish";
    }

    move() {
        var me = this;
        var adjacentSpaces = this.getAdjacentSpaces();
        adjacentSpaces = adjacentSpaces.filter((as) => {
            return me.world.get(as) == null;
        });
        var nextMoveIndex = Math.floor(Math.random() * adjacentSpaces.length);
        var nextMove;
        if ((nextMove = adjacentSpaces[nextMoveIndex])) {
            if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
                this.world.born.push(this.world.createFishAt(this.x, this.y));
		this.world.fishes++;
                me.moveCount = 0;
            }
            this.setX(nextMove.x);
            this.setY(nextMove.y);
        }
    }
}

exports class Shark extends SeaCreature {

    constructor(x, y, world) {
        super(x, y, world, "red");
        this.energy = this.world.sharkEnergy;
    }


getReproduceRate() {
return this.world.sharkRepoRate;
}

    getName() {
        return "shark";
    }

    eat(fish) {
        this.world.dead.push(fish);
		this.world.fishes--;
        this.energy+= 15;
    }

    move() {
        if(this.energy < 0){
            this.world.dead.push(this);
		this.world.sharks--;
            return;
        }
        this.energy--;
        var me = this;
        var adjacentSpaces = this.getAdjacentSpaces();
        var emptySpaces = adjacentSpaces.filter((as) => {
            return me.world.get(as) == null;
        });
        var fishSpaces = adjacentSpaces.filter((as) => {
            return me.world.get(as) != null && me.world.get(as).getName() == 'fish';
        });
        var spaces = fishSpaces.length > 0 ? fishSpaces : emptySpaces;
        if(spaces.length > 0) {
            let next = spaces[Math.floor(Math.random() * spaces.length)];
            if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
                this.world.born.push(this.world.createSharkAt(next.x, next.y));
		this.world.sharks++;
                me.moveCount = 0;
            }
            let fish = this.world.get(next);
            if(fish)
                this.eat(fish);
            this.setX(next.x);
            this.setY(next.y);
        }
    }
}


var world = {
    dead: [],
    born: [],
    maxX: 3,
    maxY: 3,
    scale: 10,
    sharkRepoRate: 20,
    fishRepoRate: 20,
    sharkEnergy: 10,
    fishes: 8,
    sharks: 1,
    frameRate: 1,
    inner: [],
    creatures: [],
	births: {
		shark:0,
		fish:0
	},
	deaths: {
		shark:0,
		fish:0
	},

    createFishAt: function(x, y) {
        return new Fish(x, y, world);
    },

    createSharkAt: function(x, y) {
        return new Shark(x, y, world);
    },

    init: function() {
        for (let i = 0; i < this.maxX; i++) {
            this.inner[i] = [];
            for (let j = 0; j < this.maxY; j++) {
                this.inner[i][j] = null;
            }
        }
        for (var i = 0; i < this.fishes; i++) {
            let x = Math.floor(Math.random() * this.maxX);
            let y = Math.floor(Math.random() * this.maxY);
            let f = new Fish(x, y, world);
            let c = {
                x: x,
                y: y
            };
            if (this.spaceFilled(c)) {
                i--;
            } else {
                this.add(f);
            }
        }

        for (var i = 0; i < this.sharks; i++) {
            let x = Math.floor(Math.random() * this.maxX);
            let y = Math.floor(Math.random() * this.maxY);
            let f = new Shark(x, y, world);
            let c = {
                x: x,
                y: y
            };
            if (this.spaceFilled(c)) {
                i--;
            } else {
                this.add(f);
            }
        }
    },

    remove: function(seaCreature) {
        var idx = this.creatures.indexOf(seaCreature);
        this.inner[seaCreature.x][seaCreature.y] = null;
        this.creatures.splice(idx, 1);

		if(seaCreature.getName() == 'fish')
	this.deaths.fish++;
else

	this.deaths.shark++;
    },

    spaceFilled: function(cord) {
        return this.inner[cord.x][cord.y] != null;
    },

    add: function(seaCreature) {
        if (this.creatures.length < this.maxX * this.maxY) {
            this.creatures.push(seaCreature);
            this.inner[seaCreature.x][seaCreature.y] = seaCreature;
		if(seaCreature.getName() == 'fish')
	    this.births.fish++;
else 

	    this.births.shark++;
            return true;
        }
        return false;
    },

    get: function(cord) {
        return this.inner[cord.x][cord.y];
    },

    go: function(callback) {
        for (var i = 0; i < this.creatures.length; i++) {
            //  console.log(this.creatures.length);
            var oldX = this.creatures[i].x;
            var oldY = this.creatures[i].y;
            this.inner[oldX][oldY] = null;
            this.creatures[i].move();
            this.inner[this.creatures[i].x][this.creatures[i].y] = this.creatures[i];
            callback({
                x: oldX,
                y: oldY
            }, this.creatures[i]);
            //process the dead and born stacks
            while (this.dead.length > 0) {
                let creature = this.dead.pop();
                this.remove(creature);
                i--;
            }
            while (this.born.length > 0) {
                let creature = this.born.pop();
                if(this.add(creature))
                    i++;
            }
        }
    }
};


/*
function createCanvas(parent, width, height) {
    var canvas = {};
    canvas.node = document.createElement('canvas');
    canvas.context = canvas.node.getContext('2d');
    canvas.node.width = width || 100;
    canvas.node.height = height || 100;
    parent.appendChild(canvas.node);
    return canvas;
}
var canvas;
var ctx;

function init(container) {
    world.init();
    canvas = createCanvas(container, world.maxX * world.scale , world.maxY * world.scale );
    ctx = canvas.context;
    ctx.fillStyle = "#add8e6";
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.node.width, canvas.node.height); //clear canvas
    ctx.fillStyle = "#add8e6";
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
    world.go(function(oldCoords, creature) {
        var width = 1 * world.scale;
        var height = 1 * world.scale;
        ctx.beginPath();
        ctx.fillStyle = creature.color;
	console.log(creature);
        ctx.fillRect(creature.x * world.scale, creature.y * world.scale, width, height);
    });
}

var container = document.getElementById('canvas');
init(container);


var interval = (function() {
    var interval = null,
        running = false;
    return {
        start: function() {
            if (running) return;
            running = true;
            interval = setInterval(draw, 1000 / world.frameRate);
        },
        stop: function() {
            if (!running) return;
            running = false;
            clearInterval(interval);
        },
	restart: function(){
		init(container);
	}
    }
})();

var interval2 = (function() {
    var interval = null,
        running = false;
    return {
        start: function() {
            if (running) return;
            running = true;
            interval = setInterval(function() {
	document.getElementById('birthSharks').innerHTML = world.births.shark;
	document.getElementById('birthFishes').innerHTML = world.births.fish;
document.getElementById('deathSharks').innerHTML = world.deaths.shark;
document.getElementById('deathFishes').innerHTML = world.deaths.fish;
document.getElementById('fishes').innerHTML = world.fishes;
document.getElementById('sharks').innerHTML = world.sharks;


		}, 500);
        },
        stop: function() {
            if (!running) return;
            running = false;
            clearInterval(interval);
        }
    }
})();



interval.start();
interval2.start();
*/
