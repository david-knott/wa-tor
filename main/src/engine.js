"use strict";

class Engine {
    constructor(config) {
        this.config = config || {};
        this.config.rows = config.rows || 30;
        this.config.cols = config.cols || 30;
        this.config.fishRepoTime = config.fishRepoTime || 3;
        this.config.sharkRepoTime = config.sharkRepoTime || 30;
        this.config.fishEnergyValue = config.fishEnergyValue || 2;
        this.config.sharkInitialEnergy = config.sharkInitialEnergy || 20;
        this.config.fishInitialEnergy = config.fishInitialEnergy || 10;
        this.readArray = [];
        this.writeArray = [];
    }

    initialize() {
        for (let i = 0; i < this.config.rows; ++i) {
            this.readArray.push([]);
            this.writeArray.push([]);
            for (let j = 0; j < this.config.cols; ++j) {
                this.readArray[this.readArray.length - 1].push(0);
                this.writeArray[this.writeArray.length - 1].push(0);
            }
        }
    }

    populate(populateProvider) {
        populateProvider(this.readArray);
    }

    /**
     * Value is greater than zero and lsb is 1
     */
    isFish(el) {
        return el != 0 && (el & 1) === 0;
    }

    /**
     * Value is greater than zero and lsb is 0
     */
    isShark(el) {
        return el != 0 && (el & 1) === 1;
    }

    /**
     * Return energy.
     */
    energy(e) {
        return (e >> 4) & 255;
    }

    /**
     * Decrement energy counter  and return
     * new bit packed number.
     */
    decrementEnergy(e) {
        let energy = ((e >> 4) & 255) - 1;
        return (this.repoTime(e) << 12) | (energy << 4) | this.isShark(e);
    }

    addFish(i, j) {
        this.readArray[i][j] = this.newFish();
    }

    addShark(i, j) {
        this.readArray[i][j] = this.newShark();
    }

    /**
     * Increment energy counter  and return
     * new bit packed number.
     */
    incrementEnergy(e) {
        let energy = ((e >> 4) & 255) + this.config.fishEnergyValue;
        if(energy > 255) {
            energy = 255;
        }
        return (this.repoTime(e) << 12) | (energy << 4) | this.isShark(e);
    }

    /**
     * Return repoductive count.
     */
    repoTime(e) {
        return (e >> 12) & 255;
    }

    /**
     * Increment repoductive count and return
     * new bit packed number.
     */
    incrementRepoTime(e) {
        const repo = ((e >> 12) & 255) + 1;
        if(repo > 255) {
            repo = 255;
        }
        return (repo << 12) | (this.energy(e) << 4) | this.isShark(e);
    }

    /**
     * Set reproductive counter to zero and return
     * new bit packed number.
     */
    zeroRepoTime(e) {
        return (0 << 12) | (this.energy(e) << 4) | this.isShark(e);
    }

    /**
     * Return number for new shark.
     */
    newShark() {
        return (0 << 12) | (this.config.sharkInitialEnergy << 4) | 1;
    }

    /**
     * Return number for new fish.
     */
    newFish() {
        return (0 << 12) | (this.config.fishInitialEnergy << 4) | 0;
    }

    right(i, j, arr) {
        let jLen = arr[0].length;
        let off = j + 1 < 0 ? jLen : 0;
        return { i: i, j: ((j + 1) % jLen) + off };
    }

    left(i, j, arr) {
        let jLen = arr[0].length;
        let off = j - 1 < 0 ? jLen : 0;
        return { i: i, j: ((j - 1) % jLen) + off };
    }

    down(i, j, arr) {
        let iLen = arr.length;
        let off = i - 1 < 0 ? iLen : 0;
        return { i: ((i - 1) % iLen) + off, j: j };
    }

    up(i, j, arr) {
        let iLen = arr.length;
        let off = i + 1 < 0 ? iLen : 0;
        return { i: ((i + 1) % iLen) + off, j: j };
    }

    /**
     * array 0, 1, 2, 3, 4, 5, 0, 1 ( len =  6 )
     * if I request -1, i would expect 5 to be returned ( -1 % length + length = 1 )
     * if I request -2, i would expect 4 to be returned ( -2 % length + length = 1 )
     * if I request 6, i would expect 0 to be returned. ( 6 % length = 0 )
     * if I request 7, i would expect 1 to be returned. ( 7 % length = 1 )
     */
    fishStrategy(i, j, arr) {
        let free = [];
        const add = (posFun, arr, free) => {
            const pos = posFun(i, j, arr);
            if (arr[pos.i][pos.j] === 0) {
                free.push({
                    i: pos.i,
                    j: pos.j,
                });
            }
        };
        add(this.up, arr, free);
        add(this.down, arr, free);
        add(this.left, arr, free);
        add(this.right, arr, free);
        // return next space or current space.
        return free.length > 0
            ? free[Math.floor(Math.random() * free.length)]
            : { i: i, j: j };
    }

    sharkStrategy(i, j, arr) {
        let free = [];
        const fishes = (posFun, arr, free) => {
            const pos = posFun(i, j, arr);
            if (this.isFish(arr[pos.i][pos.j])) {
                free.push({
                    i: pos.i,
                    j: pos.j,
                });
            }
        };
        fishes(this.up, arr, free);
        fishes(this.down, arr, free);
        fishes(this.left, arr, free);
        fishes(this.right, arr, free);
        if(free.length > 0) {
            return free[Math.floor(Math.random() * free.length)];
        }
        free = [];
        const add = (posFun, arr, free) => {
            const pos = posFun(i, j, arr);
            if (arr[pos.i][pos.j] === 0 || this.isFish(arr[pos.i][pos.j])) {
                free.push({
                    i: pos.i,
                    j: pos.j,
                });
            }
        };
        add(this.up, arr, free);
        add(this.down, arr, free);
        add(this.left, arr, free);
        add(this.right, arr, free);
        // return next space or current space.
        return free.length > 0
            ? free[Math.floor(Math.random() * free.length)]
            : { i: i, j: j };
    }

    /**
     * Update dst array based on information in src array.
     */
    update(dstArray, fishStrategy, sharkStrategy) {
        fishStrategy = fishStrategy || this.fishStrategy;
        sharkStrategy = sharkStrategy || this.sharkStrategy;
        for (let i = 0; i < dstArray.length; ++i) {
            for (let j = 0; j < dstArray[i].length; ++j) {
                let animal = dstArray[i][j];
                // is item at ( i, j )  a fish or a shark ?
                if (this.isFish(animal)) {
                    animal = this.incrementRepoTime(animal);
                    // move to adjacent empty space
                    const tup = fishStrategy.apply(this, [i, j, dstArray]);
                    // if fish can move and has survied for x chronons,
                    // fish reproduces, moves to new square and
                    // leaves offspring in old position.
                    if (i !== tup.i || j !== tup.j) {
                        if (this.repoTime(animal) == this.config.fishRepoTime) {
                            dstArray[i][j] = this.newFish();
                            animal = this.zeroRepoTime(animal);
                        } else {
                            dstArray[i][j] = 0;
                        }
                    }
                    dstArray[tup.i][tup.j] = animal;
                    continue;
                }
                // if shark, move to adjacent spage with fish or empty space if no fish nearby.
                if (this.isShark(animal)) {
                    // if shark, at each chronon decrement energy by 1
                    animal = this.decrementEnergy(animal);
                    animal = this.incrementRepoTime(animal);

                    const tup = this.sharkStrategy.apply(this, [
                        i,
                        j,
                        dstArray,
                    ]);

                    // if shark eats fish, increment energy
                    if (this.isFish(dstArray[tup.i][tup.j])) {
                        animal = this.incrementEnergy(animal);
                    }

                    // if shark can move and it has survied for x chronons, shark reproduces
                    if (i !== tup.i || j !== tup.j) {
                        if (
                            this.repoTime(animal) === this.config.sharkRepoTime
                        ) {
                            dstArray[i][j] = this.newShark();
                            animal = this.zeroRepoTime(animal);
                        } else {
                            dstArray[i][j] = 0;
                        }
                    }

                    //if shark enegy == 0, shark dies
                    if (this.energy(animal) > 0) {
                        dstArray[tup.i][tup.j] = animal;
                    } else {
                        dstArray[i][j] = 0;
                    }
                    continue;
                }
            }
        }
    }

    /**
     * Update and render data
     */
    loop(renderer) {
        // render data
        renderer(this.readArray);

        // copy current to next.
        this.writeArray = JSON.parse(JSON.stringify(this.readArray));
        this.update(this.writeArray);

        // swap arrays.
        this.readArray = this.writeArray;
    }
}

export default Engine;
