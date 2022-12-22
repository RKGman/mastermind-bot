const currentSolution = [1, 2, 3, 4];

const processGame = (guess) => {
    console.log("Your guess is: " + guess);

    return currentSolution;
};

module.exports = {
    processGame: processGame
}