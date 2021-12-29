import Model from './qlearning-module/model.js';

export default class Game {
    static POSSIBLE_MOVES = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    static winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    constructor(moveFirst, model = new Model()) {
        this.model = model;
        this.state = [];
        this.moveFirst = moveFirst;
    }

    step(action) {
        let nextState = this.getNextState(this.state, action);
        let reward = this.rewardFunc(nextState);

        this.model.updateQValue(this.state, action, nextState, this.getLegalActions(nextState), reward);
        this.state = nextState;
    }

    rewardFunc(state) {
        if (this.isWin(state)) {
            return 1;
        }
        if (this.isLose(state)) {
            return -1;
        }
        if (this.isDraw(state)) {
            return 0.5;
        }
        return 0;
    }

    reset() {
        this.state = [];
    }

    isWin(state) {
        let agentMoves;
        if (this.moveFirst) {
            agentMoves = state.filter((move, index) => index % 2 === 0);
        } else {
            agentMoves = state.filter((move, index) => index % 2 === 1);
        }

        for (const winCondition of Game.winningConditions) {
            if (agentMoves.includes(winCondition[0]) && agentMoves.includes(winCondition[1]) && agentMoves.includes(winCondition[2])) {
                return true;
            }
        }
        return false;;
    }

    isLose(state) {
        let opponentMoves;
        if (this.moveFirst) {
            opponentMoves = state.filter((move, index) => index % 2 === 1);
        } else {
            opponentMoves = state.filter((move, index) => index % 2 === 0);
        }

        for (const winCondition of Game.winningConditions) {
            if (opponentMoves.includes(winCondition[0]) && opponentMoves.includes(winCondition[1]) && opponentMoves.includes(winCondition[2])) {
                return true;
            }
        }
        return false;
    }

    isDraw(state) {
        return state.length === 9;
    }

    isTerminal(state) {
        return this.isWin(state) || this.isLose(state) || this.isDraw(state);
    }

    getNextState(state, action) {
        let stateCopy = [...state];
        stateCopy.push(action);
        if (stateCopy.length < 9) {
            stateCopy.push(this.getLegalActions(stateCopy)[Math.floor(Math.random() * this.getLegalActions(stateCopy).length)]);
        }
        return stateCopy;
    }
    
    getLegalActions(state) {
        let res = []
        for (const move of Game.POSSIBLE_MOVES) {
            if (!state.includes(move)) {
                res.push(move);
            }
        }
        return res;
    }

    async train() {
        const EPISODES = 2000;
        for (let i = 0; i < EPISODES; ++i) {
            this.reset();
            if (!this.moveFirst) {
                this.state.push(this.getLegalActions(this.state)[Math.floor(Math.random() * this.getLegalActions(this.state).length)]);
            }
            while(!this.isTerminal(this.state)) {
                this.step(this.model.getAction(this.state, this.getLegalActions(this.state)));
                if (this.isWin(this.state)) {
                    this.model.decayEpsilon();
                }
                // console.log(this.model.qTable);
                // await delay(5);
            }
        }
    }

    async demo() {
        console.log("Demoing")
        this.reset();
        this.model.epsilon = 0;
        await delay(1000);
        let intervalId = setInterval(() => {
            if (!this.moveFirst) {
                this.state.push(this.getLegalActions(this.state)[Math.floor(Math.random() * this.getLegalActions(this.state).length)]);
            }
            this.step(this.model.getAction(this.state, this.getLegalActions(this.state)));
            if (this.isTerminal(this.state)) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
}

const delay = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}