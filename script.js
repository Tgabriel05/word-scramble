
const wordContainer = document.getElementById('word'),
      triesEl = document.getElementById('tries'),
      mistakesEl = document.getElementById('mistakes'),
      lettersContainer = document.getElementById('letters'),
      randomBtn = document.getElementById('random-btn'),
      resetBtn = document.getElementById('reset-btn'),
      triedLetters = document.querySelectorAll('.tried-letter');

const apiUrl = 'https://random-word-api.herokuapp.com/word?length=6';
let tries = 0;
let mistakes = [];
const maxTries = 5;
let currentWord;

//GET RANDOM WORD
function randomWord(){
  fetch(apiUrl)
    .then(response => response.json())
    .then(data =>{
      currentWord = data[0];
      wordContainer.innerHTML = '';
      startGame();
      distributeLetters(shuffleWord(currentWord));
      lettersContainer.querySelector('input').focus();
      console.log(currentWord);

    })
    .catch(error =>{
      console.log('This is happening: ' + error);
      wordContainer.innerHTML = '404'
    })
}
randomBtn.addEventListener('click', randomWord);

//SHUFFLE WORD
function shuffleWord(word){
  let shuffled = '';
  word = word.split('');
  while(word.length > 0){
    shuffled += word.splice(word.length * Math.random() << 0,1)  
  }
  return shuffled;
}

//CREATE H3 ELEMENTS
function distributeLetters(word){
  for(let i = 0; i < word.length; i++){
    let h3 = document.createElement('h3');
    h3.innerHTML = word[i];
    wordContainer.append(h3);
    createLetter();
  }
}
function createLetter(){
  //CREATE LETTERS INPUTS
  lettersContainer.innerHTML = '';
  for(let i = 0; i < currentWord.length; i++){
  let input = document.createElement('input');
  input.textContent = '';
  input.setAttribute('maxlength', '1');
  input.placeholder = '_'
  lettersContainer.appendChild(input);
 }
}
lettersContainer.addEventListener('input',(e)=>{
  const input = e.target;
  const index = Array.from(lettersContainer.children).indexOf(input);
  const nextInput = lettersContainer.children[index + 1];
  const prevInput = lettersContainer.children[index - 1];

  if(input.value){
    if(nextInput){
      nextInput.focus();
    }else if(prevInput){
      prevInput.focus();
    }
  }
  const guess = Array.from(lettersContainer.children).map((input)=>
    input.value.toLowerCase()
  );
    if(guess.every((letter) => letter)){
      verify(guess);
    }

//DELETE PREVIOUS LETTER
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Backspace'){
      e.preventDefault();
      input.value = '';
      prevInput.focus();
    }if(e.code === 'ArrowLeft'){
      e.preventDefault();
      prevInput.focus();
    }if(e.code === 'ArrowRight'){
      e.preventDefault();
      nextInput.focus();
    }
  })
  }
);

//TRIES AND MISTAKES
function verify(guess){
  mistakes = guess.filter((letter, index) => letter !== currentWord[index]);
  mistakesEl.innerHTML = mistakes.join(', ');
  if(mistakes.length){
    tries++
    if(tries < maxTries){
      triesEl.innerHTML = tries;
      triedWord();
    }
  }else{
    alert('Good job.🎉 You succeed');
    location.reload();
  }if(tries >= maxTries){
    alert('You lose. The word was: ' + currentWord);
    location.reload();
  }
}
function triedWord(){
  triedLetters.forEach((dot, index) =>{
    if(index < tries){
      dot.classList.add('check');
    }else{
      dot.classList.remove('check');
    }
  })
}
//RESET GAME
function resetGame(){
  startGame();
  createLetter(currentWord);
  lettersContainer.querySelector('input').focus();
  triedLetters.forEach((dot)=>{
    dot.classList.remove('check');
  });
  tries = 0;
  triesEl.innerHTML = tries;
}
function startGame(){
  triesEl.innerHTML = '';
  lettersContainer.innerHTML = '';
  mistakesEl.innerHTML = '';
}


//BUTTONS ANIMATION
randomBtn.addEventListener('click', ()=>{
  randomBtn.style.animation = 'none';
  void randomBtn.offsetWidth;
  randomBtn.style.animation = 'click 0.1s linear';
});
resetBtn.addEventListener('click', ()=>{
  resetBtn.style.animation = 'none';
  void resetBtn.offsetWidth;
  resetBtn.style.animation = 'click 0.1s linear';
  resetGame();

});



//LIVE FUNCTIONS
randomWord();