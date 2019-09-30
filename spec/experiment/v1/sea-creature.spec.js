describe('Shark', function() {
    beforeEach(function() {
        Shark = require('../../../src/experiment/v1/shark');
        World = require('../../../src/experiment/v1/world');
        this.world = new World();
    });

    it('getNorth from 0,0 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;
        this.shark = new Shark(0, 0, this.world);
        expect(this.shark.getNorth()).toEqual({x: 0, y: 4});
    });

    it('getSouth from 0,0 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;
        this.shark = new Shark(0, 0, this.world);
        expect(this.shark.getSouth()).toEqual({x: 0, y: 1});
    });

    it('getEast from 0, 0 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(0, 0, this.world);
        expect(this.shark.getEast()).toEqual({x: 1, y: 0});
    });

    it('getWest from 0, 0 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(0, 0, this.world);
        expect(this.shark.getWest()).toEqual({x: 4, y: 0});
    });

    it('getNorth from 1,1 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(1, 1, this.world);
        expect(this.shark.getNorth()).toEqual({x: 1, y: 0});
    });

    it('getSouth from 1,1 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(1, 1, this.world);
        expect(this.shark.getSouth()).toEqual({x: 1, y: 2});
    });

    it('getEast from 1,1 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(1, 1, this.world);
        expect(this.shark.getEast()).toEqual({x: 2, y: 1});
    });

    it('getWest from 1, 1 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(1, 1, this.world);
        expect(this.shark.getWest()).toEqual({x: 0, y: 1});
    });

    it('getNorth from 4,4 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(4, 4, this.world);
        expect(this.shark.getNorth()).toEqual({x: 4, y: 3});
    });

    it('getSouth from 4,4 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(4, 4, this.world);
        expect(this.shark.getSouth()).toEqual({x: 4, y: 0});
    });

    it('getEast from 4,4 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(4, 4, this.world);
        expect(this.shark.getEast()).toEqual({x: 0, y: 4});
    });

    it('getWest from 4, 4 moves correctly', function() {
        this.world.maxX = 5;
        this.world.maxY = 5;

        this.shark = new Shark(4, 4, this.world);
        expect(this.shark.getWest()).toEqual({x: 3, y: 4});
    });
});
