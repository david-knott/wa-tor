class Config {
    constructor(options) {
        if (options) {
            this.maxX = options.maxX | 16;
            this.maxY = options.maxY | 12;
            this.scale = options.scale| 50;
            this.sharkRepoRate = options.sharkRepoRate | 6;
            this.fishRepoRate = options.fishRepoRate | 3;
            this.sharkEnergy = options.sharkEnergy | 20;
            this.fishEnergy = options.fishEnergy | 1;
            this.fishes = options.fishes | 1;
            this.sharks = options.sharks | 1;
            this.frameRate = options.frameRate | 1;
        }
    }
}
module.exports = Config;
