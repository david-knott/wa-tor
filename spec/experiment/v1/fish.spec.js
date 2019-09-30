describe('Fish', function() {
    beforeEach(function() {
        Fish = require('../../../src/experiment/v1/fish');
        World = require('../../../src/experiment/v1/world');
        this.world = new World();
        this.world.maxX = 4;
        this.world.maxY = 4;
        this.world.init();
    });

    it('can be created', function() {
        expect(new Fish(0, 0, this.world)).toBeDefined();
    });

    it('potential move returns values 1', function() {
        var f = new Fish(0, 0, this.world);
        this.world.add(f);
        var potentialMoves = f.getPotentialMoves();
        expect(potentialMoves.length).toEqual(4);
    });

    it('potential move returns values 2', function() {
        var f = new Fish(0, 0, this.world);
        this.world.add(f);
        var f2 = new Fish(1, 0, this.world);
        this.world.add(f2);
        var potentialMoves = f.getPotentialMoves();
        expect(potentialMoves.length).toEqual(3);
    });

    it('potential move returns values 3', function() {
        var f = new Fish(0, 0, this.world);
        this.world.add(f);
        this.world.add(new Fish(1, 0, this.world));
        this.world.add(new Fish(0, 3, this.world));
        var potentialMoves = f.getPotentialMoves();
        expect(potentialMoves.length).toEqual(2);
    });

    it('potential move returns values 4', function() {
        var f = new Fish(0, 0, this.world);
        this.world.add(f);
        this.world.add(new Fish(1, 0, this.world));
        this.world.add(new Fish(0, 3, this.world));
        this.world.add(new Fish(3, 0, this.world));
        var potentialMoves = f.getPotentialMoves();
        expect(potentialMoves.length).toEqual(1);
    });

    it('potential move returns values 5', function() {
        var f = new Fish(0, 0, this.world);
        this.world.add(f);
        this.world.add(new Fish(1, 0, this.world));
        this.world.add(new Fish(0, 3, this.world));
        this.world.add(new Fish(3, 0, this.world));
        this.world.add(new Fish(0, 1, this.world));
        var potentialMoves = f.getPotentialMoves();
        expect(potentialMoves.length).toEqual(0);
    });
});
