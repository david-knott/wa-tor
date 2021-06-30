import "./style.scss";
import Engine from "./engine";
console.log("here");
var start = () => {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    const config = {
        scale: 10,
        rows: 100,
        cols: 100,
        sharkRepoTime: parseInt(document.getElementById('sharkReproductiveRate').value),
        fishRepoTime: parseInt(document.getElementById('fishReproductiveRate').value),
        sharkInitialEnergy: parseInt(document.getElementById('sharkInitialEnergy').value),
        fishEnergyValue: parseInt(document.getElementById('sharkInitialEnergy').value)
    };

    document.getElementById('addFishes').addEventListener('click', (e) => {
      //  config.sharkRepoTime = parseInt(e.target.value);
        engine.addFish(5, 5);
    });

    document.getElementById('addSharks').addEventListener('click', (e) => {
      //  config.sharkRepoTime = parseInt(e.target.value);
        engine.addShark(5, 5);
    });

    document.getElementById('sharkReproductiveRate').addEventListener('change', (e) => {
        config.sharkRepoTime = parseInt(e.target.value);
    });

    document.getElementById('fishReproductiveRate').addEventListener('change', (e) => {
        config.fishRepoTime = parseInt(e.target.value);
    });

    document.getElementById('sharkInitialEnergy').addEventListener('change', (e) => {
        config.sharkInitialEnergy = parseInt(e.target.value);
    });

    document.getElementById('fishEnergyValue').addEventListener('change', (e) => {
        config.fishEnergyValue = parseInt(e.target.value);
    });

    const engine = new Engine(config);
    console.log(config);
    engine.initialize();
    engine.populate((arr) => {
        arr[0][2] = engine.newFish();
        arr[0][1] = engine.newFish();
        arr[0][0] = engine.newFish();
        arr[0][3] = engine.newShark();
    });
    const width = 1 * config.scale;
    const height = 1 * config.scale;
    var renderer = (data) => {
        //console.log(data);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;

        ctx.stroke();
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[i].length; ++j) {
                if (data[i][j] > 0) {
                    if(data[i][j] & 1) {
                        const energy = (data[i][j] >> 4) & 255;
                        // map 0 -> 255 to 0 -> 1
                        const opc = 1 - energy / 255;
                        ctx.fillStyle = "rgba(255, 0, 0, " + opc + ")";
                    } else {
                        ctx.fillStyle = "#00ff00";
                    }
                } else {
                    ctx.fillStyle = "#000";
                }
                ctx.fillRect(
                    i * config.scale,
                    j * config.scale,
                    width - 2,
                    height - 2
                );
            }
        }
    };

    const draw = () => {
        setTimeout(() => {
            engine.loop(renderer);
            window.requestAnimationFrame(draw);
            return false;
        }, 1000 / 10);
    };

    draw();
};

start();
