import './experiment/v1/_custom.scss';
window.oid = 0;
//import 'bootstrap';
const World = require('./experiment/v1/world');
const Config = require('./experiment/v1/config');
var config = new Config({});
var world = new World(config);
window.world = world;

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
    var w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    );
    var h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

    //let width = document.getElementById('canvas-wrapper').offsetWidth;
   // let scale = width / config.maxX;
  //  let maxY = h / scale;
   // config.scale = Math.round(scale);
  //  config.maxY = Math.round(maxY) - 30;
    world.init();
    canvas = createCanvas(
        container,
        config.maxX * config.scale,
        config.maxY * config.scale
    );
    ctx = canvas.context;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.node.width, canvas.node.height); //clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.node.width, canvas.node.height);
    world.go(function(creature) {
        var width = 1 * config.scale;
        var height = 1 * config.scale;
        ctx.beginPath();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        /*
        ctx.rect(
            creature.x * config.scale,
            creature.y * config.scale,
            width,
            height
        );
        
        */
        ctx.stroke();
        ctx.fillStyle = creature.getColor();
        ctx.fillRect(
            creature.x * config.scale ,
            creature.y * config.scale ,
            width - 2,
            height - 2
        );
        
        //    ctx.font = '11px Arial';
        //  ctx.fillStyle = "white";
        //ctx.fillText(creature.id + ':[' + creature.x + ',' + creature.y + ']', creature.x * world.scale + width / 3, creature.y * world.scale + height / 3);
    });
}

function circle(color, context, centerX, centerY, radius) {
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
            interval = setInterval(draw, 1000 / config.frameRate);
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

interval.start();
window.interval = interval;
