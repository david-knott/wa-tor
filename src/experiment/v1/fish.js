class Fish extends SeaCreature {
    constructor(x, y, world) {
        super(x, y, world, 'green')
    }

    getReproduceRate() {
        return this.world.fishRepoRate
    }

    getName() {
        return 'fish'
    }

    move() {
        var me = this
        var adjacentSpaces = this.getAdjacentSpaces()
        adjacentSpaces = adjacentSpaces.filter(as => {
            return me.world.get(as) == null
        })
        var nextMoveIndex = Math.floor(Math.random() * adjacentSpaces.length)
        var nextMove
        if ((nextMove = adjacentSpaces[nextMoveIndex])) {
            if (me.getAndIncrementMoveCount() > me.getReproduceRate()) {
                this.world.born.push(this.world.createFishAt(this.x, this.y))
                this.world.fishes++
                me.moveCount = 0
            }
            this.setX(nextMove.x)
            this.setY(nextMove.y)
        }
    }
}

module.exports = Fish
