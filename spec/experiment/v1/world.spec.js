describe("4x4 World", function() {
  var a;

  beforeEach(function() {
    World = require("../../../src/experiment/v1/world");
    this.world = new World();
    this.world.maxX = 4;
    this.world.maxY = 4;
    this.world.init();
  });

  it("can be created", function() {
    expect(this.world).toBeDefined();
  });

  it("can be initialized", function() {
    var me = this;
    expect(this.world.get({ x: 0, y: 0 })).toBeDefined();
    expect(function() {
      me.world.get({ x: 4, y: 4 });
    }).toThrow();
    expect(function() {
      me.world.get({ x: -1, y: -1 });
    }).toThrow();
  });

  it("cannot add to a cell that is filled", function() {
    expect(this.world.add(new Shark(0, 0, this.world))).toBeTruthy();
    expect(this.world.add(new Shark(0, 0, this.world))).toBeFalsy();
  });

  it("go method works 10 iterations", function() {
    this.world.add(new Shark(0, 0, this.world));
    this.world.add(new Shark(1, 1, this.world));
    var me = this;
    for (let i = 0; i < 10; i++) {
      this.world.go(function(o, c) {
        expect(o.x).toBeLessThan(4);
        expect(o.y).toBeLessThan(4);
        expect(c.x).toBeLessThan(4);
        expect(c.y).toBeLessThan(4);

        expect(o.x).toBeGreaterThan(-1);
        expect(o.y).toBeGreaterThan(-1);
        expect(c.x).toBeGreaterThan(-1);
        expect(c.y).toBeGreaterThan(-1);
      });
    }
  });
});
