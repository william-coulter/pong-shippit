const K = 40;

// player 2 beats player 1
const player1Elo = 2000;
const player2Elo = 1600;

// 1 for a win
// 0 for a loss
const player1Actual = 0;

// NB: player1Expected + player2Expected = 1
const player1Expected = 1 / (1 + Math.pow(10, (player2Elo - player1Elo) / 400));
console.log(`player 1 expected: ${player1Expected}`);

const player1New = player1Elo + K * (player1Actual - player1Expected);
console.log(`player 1 new: ${player1New}`);
