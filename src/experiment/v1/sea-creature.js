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
      y: this.y - 1 < 0 ? this.world.maxY - 1 : this.y - 1
    };
  }

  getSouth() {
    return {
      x: this.x,
      y: this.y + 1 > this.world.maxY - 1 ? 0 : this.y + 1
    };
  }

  getEast() {
    return {
      x: this.x + 1 > this.world.maxX - 1 ? 0 : this.x + 1,
      y: this.y
    };
  }

  getWest() {
    return {
      x: this.x - 1 < 0 ? this.world.maxX - 1 : this.x - 1,
      y: this.y
    };
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

module.exports = SeaCreature;
