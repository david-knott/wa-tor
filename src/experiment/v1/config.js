class Config {
    constructor(options) {
        if (options) {
            this.maxX = options.maxX | 160;
            this.maxY = options.maxY | 120;
            this.scale = options.scale| 10;
            this.sharkRepoRate = options.sharkRepoRate | 6;
            this.fishRepoRate = options.fishRepoRate | 4;
            this.sharkEnergy = options.sharkEnergy | 10;
            this.fishEnergy = options.fishEnergy | 10;
            this.fishes = options.fishes | 500;
            this.sharks = options.sharks | 20;
            this.frameRate = options.frameRate | 10;
        }
    }
}
module.exports = Config;
