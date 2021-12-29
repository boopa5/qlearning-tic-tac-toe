import Game from './Game.js';
import Model from './qlearning-module/model.js';

let model = new Model({
    learningRate: 0.9,
    discountFactor: 0.95,
    epsilon: 0.1,
    epsilonDecay: 0.99,
});

let game = new Game(true, model);

function setup() {
    createCanvas(1000, 1000);
}

function drawGame(game) {
    let state = game.state;
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (state.indexOf(i * 3 + j) !== -1) {
                if (state.indexOf(i * 3 + j) % 2 === 0) {
                    if (game.moveFirst) {
                        fill(0);
                        stroke(0);
                        rect(i * 50, j * 50, 50, 50);
                    } else {
                        fill(255, 0, 0)
                        stroke(0);
                        rect(i * 50, j * 50, 50, 50);
                    }
                } else {
                    if (game.moveFirst) {
                        fill(255, 0, 0);
                        stroke(0);
                        rect(i * 50, j * 50, 50, 50);
                    } else {
                        fill(0);
                        stroke(0);
                        rect(i * 50, j * 50, 50, 50);
                    }
                }
            } else {
                fill(255);
                stroke(0);
                rect(i * 50, j * 50, 50, 50);
            }
        }
    }
}

function draw() {
    background(255);
    drawGame(game);
}

window.setup = setup;
window.draw = draw;

await game.train();
game.demo();