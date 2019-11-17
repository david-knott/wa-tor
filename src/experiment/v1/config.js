class Config {
    constructor(options) {
        if (options) {
            this.maxX = options.maxX | 110;
            this.maxY = options.maxY | 40;
            this.scale = options.scale| 15;
            this.sharkRepoRate = options.sharkRepoRate | 5;
            this.fishRepoRate = options.fishRepoRate | 1;
            this.sharkEnergy = options.sharkEnergy | 4;
            this.fishEnergy = options.fishEnergy | 2;
            this.fishes = options.fishes | 150;
            this.sharks = options.sharks | 50 ;
            this.frameRate = options.frameRate | 50;
        }
    }
}
module.exports = Config;
