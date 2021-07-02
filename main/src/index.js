import "./style.scss";
import Engine from "./engine";
console.log("here");
var start = () => {
    var renderer = (data, i, j) => {
        if (data[i][j] > 0) {
            if (data[i][j] & 1) {
                const energy = (data[i][j] >> 4) & 255;
                // map 0 -> 255 to 0 -> 1
                const opc = 1 - energy / 255;
                //const opc = 1;
                ctx.fillStyle = "rgba(0, 10, 255, " + opc + ")";
            } else {
                ctx.fillStyle = "#00ff00";
            }
        } else {
            ctx.fillStyle = "#000";
        }
        ctx.fillRect(i * config.scale, j * config.scale, width - 2, height - 2);
    };
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    const config = {
        scale: 5,
        rows: 70,
        cols: 100,
        sharkRepoTime: parseInt(
            document.getElementById("sharkReproductiveRate").value
        ),
        fishRepoTime: parseInt(
            document.getElementById("fishReproductiveRate").value
        ),
        sharkInitialEnergy: parseInt(
            document.getElementById("sharkInitialEnergy").value
        ),
        fishEnergyValue: parseInt(
            document.getElementById("fishEnergyValue").value
        ),
        fps: parseInt(document.getElementById("fps").value),
        renderer: renderer,
    };

    document.getElementById("addFishes").addEventListener("click", (e) => {
        engine.addFish(5, 5);
    });

    document.getElementById("addSharks").addEventListener("click", (e) => {
        engine.addShark(5, 5);
    });

    document
        .getElementById("sharkReproductiveRate")
        .addEventListener("change", (e) => {
            config.sharkRepoTime = parseInt(e.target.value);
            e.target.parentElement.lastElementChild.innerHTML = e.target.value;
        });

    document
        .getElementById("fishReproductiveRate")
        .addEventListener("change", (e) => {
            config.fishRepoTime = parseInt(e.target.value);
            e.target.parentElement.lastElementChild.innerHTML = e.target.value;
        });

    document
        .getElementById("sharkInitialEnergy")
        .addEventListener("change", (e) => {
            config.sharkInitialEnergy = parseInt(e.target.value);
            e.target.parentElement.lastElementChild.innerHTML = e.target.value;
        });

    document
        .getElementById("fishEnergyValue")
        .addEventListener("change", (e) => {
            config.fishEnergyValue = parseInt(e.target.value);
            e.target.parentElement.lastElementChild.innerHTML = e.target.value;
        });

    document.getElementById("fps").addEventListener("change", (e) => {
        config.fps = parseInt(e.target.value);
        e.target.parentElement.lastElementChild.innerHTML = e.target.value;
    });

    const engine = new Engine(config);
    engine.initialize();
    engine.populate((arr) => {
        arr[0][2] = engine.newFish();
        arr[0][1] = engine.newFish();
        arr[0][0] = engine.newFish();
        arr[0][3] = engine.newShark();
    });
    const width = 1 * config.scale;
    const height = 1 * config.scale;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();

    const draw = () => {
        setTimeout(() => {
            engine.loop();
            window.requestAnimationFrame(draw);
            return false;
        }, 1000 / config.fps);
    };

    draw();
};

start();
