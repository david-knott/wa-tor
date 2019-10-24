import './experiment/v1/_custom.scss';
import 'bootstrap';
const World = require('./experiment/v1/world');
var world = new World();
window.world = world;
world.maxX = 25;
world.maxY = 20;
world.sharks = 1;
world.frameRate = 1;
world.fishes = 400;

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
    canvas = createCanvas(
        container,
        world.maxX * world.scale,
        world.maxY * world.scale
    );
    ctx = canvas.context;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.node.width, canvas.node.height); //clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
    world.go(function(oldCoords, creature) {
        var width = 1 * world.scale;
        var height = 1 * world.scale;
        ctx.beginPath();
        ctx.strokeStyle = '#000'; 
        ctx.rect(
            creature.x * world.scale,
            creature.y * world.scale,
            width,
            height
        );
        ctx.stroke();

        ctx.fillStyle = creature.getColor();
        ctx.fillRect(
            creature.x * world.scale,
            creature.y * world.scale,
            width,
            height
        );
//        circle(creature.getColor(), ctx, creature.x * world.scale, creature.y * world.scale, world.scale);
    });
}

function circle(color, context, centerX, centerY, radius){
    context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color; 
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
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
        restart: function() {
            init(container);
        },
    };
})();

var interval2 = (function() {
    var interval = null,
        running = false;
    return {
        start: function() {
            if (running) return;
            running = true;
            interval = setInterval(function() {
                document.getElementById('birthSharks').innerHTML =
                    world.births.shark;
                document.getElementById('birthFishes').innerHTML =
                    world.births.fish;
                document.getElementById('deathSharks').innerHTML =
                    world.deaths.shark;
                document.getElementById('deathFishes').innerHTML =
                    world.deaths.fish;
                document.getElementById('fishes').innerHTML = world.fishes;
                document.getElementById('sharks').innerHTML = world.sharks;
            }, 500);
        },
        stop: function() {
            if (!running) return;
            running = false;
            clearInterval(interval);
        },
    };
})();

interval.start();
interval2.start();
