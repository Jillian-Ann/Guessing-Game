function generateWinningNumber(){
    let returnNum = Math.floor((Math.random()*100)+1);
    if(returnNum===0){
        return 1;
    }
    return returnNum;
}

function shuffle(array){
    var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}


function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber-this.playersGuess);
}

Game.prototype.isLower = function(){
    return this.playersGuess<this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess){
    if(isNaN(guess) || guess<1 || guess>100){
        throw "That is an invalid guess.";
    }
    else { this.playersGuess = guess
        return this.checkGuess();
    };
}

Game.prototype.checkGuess = function(){
    if(this.playersGuess===this.winningNumber){
        this.gameOver();
        return 'You Win!';
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                this.gameOver();
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()){
                    $( "#headers h3" ).text("Guess higher")
                }
                if(!this.isLower()){
                    $( "#headers h3" ).text("Guess lower")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}


let newGame = function(){
    return new Game;
}

Game.prototype.provideHint = function(){
    let array = [this.winningNumber];
    array.push(generateWinningNumber());
    array.push(generateWinningNumber());
    return shuffle(array);
}


Game.prototype.gameOver = function(){
    $("#headers h3").text("Press the reset button to play again!");
    $("#submit, #hint" ).prop("disabled", true);
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $( "#headers h1" ).text(output);
}




$ ( "document" ).ready(function(){

    let game = new Game();

    $('#submit').click(function(e) {
        makeAGuess(game);
     })
 
     $('#player-input').keypress(function(event) {
         if ( event.which == 13 ) {
            makeAGuess(game);
         }
     })

     $( "#hint" ).on("click",function(){
        var hints = game.provideHint();
        $('#headers h1').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })

     $( "#reset" ).on("click",function(){
         game = new Game();
         $('#headers h1').text('GUESSING GAME');
         $('#headers h3').text('Guess a number between 1-100!')
         $('.guess').text('-');
         $('#hint, #submit').prop("disabled",false);
     })
 })