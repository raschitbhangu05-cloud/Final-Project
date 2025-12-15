function askPlayerNames(){
  let p1 = "";
  let p2 = "";
  while (!p1) p1 = prompt("Enter Player 1 name:")?.trim() || "";
  while (!p2) p2 = prompt("Enter Player 2 name:")?.trim() || "";
  return [p1 || "Player 1", p2 || "Player 2"];
}

const [player1, player2] = askPlayerNames();

    const ROWS = 6;
    const COLS = 3;
    let board = [];
    let currentPlayer = 1;
    let gameOver = false;
    let restartTimer = null;

    const boardDiv = document.getElementById("board");
    const statusDiv = document.getElementById("status");
    const celebration = document.getElementById("celebration");
    const celebrateText = document.getElementById("celebrateText");

    function initBoard() {
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      boardDiv.innerHTML = "";

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.addEventListener("click", () => dropDisc(c));
          boardDiv.appendChild(cell);
        }
      }
      updateStatus();
    }

    function dropDisc(col) {
      if (gameOver) return;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
          board[r][col] = currentPlayer;
          placeDisc(r, col);
          if (checkWin(r, col)) {
            const winnerName = currentPlayer === 1 ? player1 : player2;
            showCelebration(winnerName);
            statusDiv.textContent = "";
            gameOver = true;
          } else if (isBoardFull()) {
            showTie();
            gameOver = true;
          } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
          }
          return;
        }
      }
    }

    function placeDisc(r, col) {
      const index = r * COLS + col;
      const cell = boardDiv.children[index];
      const disc = document.createElement("div");
      disc.className = "disc";
      disc.classList.add(currentPlayer === 1 ? 'p1' : 'p2');
      disc.style.background = currentPlayer === 1 ? "var(--p1-color)" : "var(--p2-color)";
      cell.appendChild(disc);
    }

    function checkWin(r, c) {
      const p = currentPlayer;
      const directions = [
        [[0,1], [0,-1]],
        [[1,0], [-1,0]],
        [[1,1], [-1,-1]],
        [[1,-1], [-1,1]]
      ];

      for (const dir of directions) {
        let count = 1;
        for (const [dr, dc] of dir) {
          let rr = r + dr;
          let cc = c + dc;
          while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
            count++;
            rr += dr;
            cc += dc;
          }
        }
        if (count >= 3) return true;
      }
      return false;
    }

    function updateStatus() {
      const name = currentPlayer === 1 ? player1 : player2;
      statusDiv.textContent = `${name}'s turn`;
    }

    function isBoardFull() {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c] === 0) return false;
        }
      }
      return true;
    }

    function startRestartCountdown(seconds = 3) {
      if (restartTimer) {
        clearInterval(restartTimer);
        restartTimer = null;
      }
      let remaining = seconds;
      const baseText = celebrateText.textContent || '';
      celebrateText.dataset.base = baseText;
      celebrateText.textContent = `${baseText}\nRestarting in ${remaining}...`;
      statusDiv.textContent = `Restarting in ${remaining}...`;
      restartTimer = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          celebrateText.textContent = `${baseText}\nRestarting in ${remaining}...`;
          statusDiv.textContent = `Restarting in ${remaining}...`;
        } else {
          clearInterval(restartTimer);
          restartTimer = null;
          resetGame();
        }
      }, 1000);
    }

    function showTie() {
      celebrateText.textContent = `It's a tie!`;
      celebration.style.display = 'flex';
      celebration.setAttribute('aria-hidden', 'false');
      launchFireworks(8);
      startRestartCountdown(3);
      statusDiv.textContent = "It's a tie!";
    }

    function resetGame() {
      currentPlayer = 1;
      gameOver = false;
      if (restartTimer) { clearInterval(restartTimer); restartTimer = null; }
      document.querySelectorAll('.firework-particle').forEach(n => n.remove());
      celebration.style.display = 'none';
      celebration.setAttribute('aria-hidden', 'true');
      statusDiv.textContent = '';
      initBoard();
    }

    document.getElementById("restartBtn").addEventListener("click", resetGame);

    function showCelebration(winner) {
      celebrateText.textContent = `${winner} WINS!`;
      celebration.style.display = 'flex';
      celebration.setAttribute('aria-hidden', 'false');
      launchFireworks(30);
      startRestartCountdown(3);
    }

    function launchFireworks(count = 20) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'firework-particle';
        p.style.background = `hsl(${Math.floor(Math.random()*360)}, 90%, 55%)`;
        p.style.left = centerX + 'px';
        p.style.top = centerY + 'px';
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 220;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        p.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1), opacity 900ms linear';
        p.getBoundingClientRect();
        p.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0.9)`;
        p.style.opacity = '0';

        setTimeout(() => p.remove(), 1000 + Math.random()*400);
      }
    }

    initBoard();
