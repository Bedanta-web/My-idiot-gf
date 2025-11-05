const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnDisplay = document.getElementById('turnDisplay');
const aiToggle = document.getElementById('aiToggle');
const restartBtn = document.getElementById('restart');
const resetScoreBtn = document.getElementById('resetScore');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const drawScoreEl = document.getElementById('drawScore');
const winnerLine = document.getElementById('winnerLine');

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let running = true;
let scores = {X:0,O:0,draws:0};

function init(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    boardEl.appendChild(cell);
  }
  updateTurnDisplay();
  statusEl.textContent = 'Game ready — X starts';
  running = true;
  board.fill('');
  winnerLine.style.display = 'none';
}

function handleCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(!running || board[idx]) return; // ignore

  makeMove(idx, currentPlayer);

  if(checkWin(currentPlayer)){
    scores[currentPlayer]++;
    updateScoreboard();
    statusEl.textContent = `${currentPlayer} wins!`;
    running = false;
    highlightWinningCombo(currentPlayer);
    return;
  }

  if(isDraw()){
    scores.draws++;
    updateScoreboard();
    statusEl.textContent = `It's a draw`;
    running = false;
    return;
  }

  swapTurns();

  // If AI enabled and it's O's turn (by default AI plays O)
  if(aiToggle.checked && running && currentPlayer === 'O'){
    setTimeout(() => {
      const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null);
      const choice = empties[Math.floor(Math.random()*empties.length)];
      makeMove(choice, 'O');

      if(checkWin('O')){
        scores.O++;
        updateScoreboard();
        statusEl.textContent = `O wins!`;
        running = false;
        highlightWinningCombo('O');
        return;
      }

      if(isDraw()){
        scores.draws++;
        updateScoreboard();
        statusEl.textContent = `It's a draw`;
        running = false;
        return;
      }

      swapTurns();
    }, 300);
  }
}

function makeMove(idx, player){
  board[idx] = player;
  const cell = boardEl.querySelector(`.cell[data-index='${idx}']`);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.classList.add('disabled');
}

function swapTurns(){
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnDisplay();
  statusEl.textContent = `${currentPlayer}'s turn`;
}

function updateTurnDisplay(){
  turnDisplay.textContent = currentPlayer;
}

function checkWin(player){
  return WIN_COMBOS.some(combo => combo.every(i => board[i] === player));
}

function isDraw(){
  return board.every(cell => cell !== '');
}

function updateScoreboard(){
  xScoreEl.textContent = `X: ${scores.X}`;
  oScoreEl.textContent = `O: ${scores.O}`;
  drawScoreEl.textContent = `Draws: ${scores.draws}`;
}

function highlightWinningCombo(player){
  const combo = WIN_COMBOS.find(c => c.every(i => board[i] === player));
  if(!combo) return;
  winnerLine.style.display = 'block';
  winnerLine.textContent = `${player} wins!`;
}

restartBtn.addEventListener('click', ()=>{
  init();
  currentPlayer = 'X';
  updateTurnDisplay();
  statusEl.textContent = 'Restarted — X starts';
});

resetScoreBtn.addEventListener('click', ()=>{
  scores = {X:0,O:0,draws:0};
  updateScoreboard();
  init();
  currentPlayer = 'X';
  statusEl.textContent = 'Scores reset — X starts';
});

document.addEventListener('keydown', e=>{
  if(e.key.toLowerCase() === 'r') restartBtn.click();
});

init();
