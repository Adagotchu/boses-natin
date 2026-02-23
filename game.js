document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('game-overlay');
    const startBtn = document.getElementById('start-btn');
    const diffBtns = document.querySelectorAll('.diff-btn');
    
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const timerElement = document.getElementById('timer');

    canvas.width = 800;
    canvas.height = 600;

    let selectedDiff = "easy";
    const difficultySettings = {
        easy: { speed: 2, spawnRate: 1200, penalty: 15 },
        normal: { speed: 3.5, spawnRate: 900, penalty: 25 },
        hard: { speed: 5, spawnRate: 600, penalty: 40 }
    };

    let score = 0, credibility = 100, gameActive = false, fallingItems = [];
    let mouseX = canvas.width/2, mouseY = canvas.height/2;
    let secondsElapsed = 0, gameClock, spawnInterval, baseSpeed, currentSpawnRate;

    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDiff = btn.getAttribute('data-level');
        });
    });

    function startClock() {
        gameClock = setInterval(() => {
            if (gameActive) {
                secondsElapsed++;
                let mins = Math.floor(secondsElapsed / 60);
                let secs = secondsElapsed % 60;
                timerElement.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                if (secondsElapsed % 10 === 0) levelUp();
            }
        }, 1000);
    }

    function levelUp() {
        baseSpeed += 0.4;
        if (currentSpawnRate > 250) {
            currentSpawnRate -= 100;
            resetSpawner();
        }
    }

    function resetSpawner() {
        clearInterval(spawnInterval);
        spawnInterval = setInterval(spawnItem, currentSpawnRate);
    }

    startBtn.addEventListener('click', () => {
        const config = difficultySettings[selectedDiff];
        score = 0; credibility = 100; secondsElapsed = 0;
        baseSpeed = config.speed;
        currentSpawnRate = config.spawnRate;
        fallingItems = [];
        
        scoreElement.innerText = "0";
        livesElement.innerText = "100";
        timerElement.innerText = "0:00";
        
        gameActive = true;
        overlay.style.display = 'none';
        document.body.classList.add('game-running'); // Reveal UI
        
        startClock();
        resetSpawner();
    });

    function spawnItem() {
        if (!gameActive) return;
        const isFact = Math.random() > 0.4;
        fallingItems.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -20,
            speed: Math.random() * 2 + baseSpeed,
            radius: 15,
            type: isFact ? 'fact' : 'lie',
            color: isFact ? '#0038A8' : '#CE1126'
        });
    }

    function endGame() {
        gameActive = false;
        document.body.classList.remove('game-running'); // Dim UI
        clearInterval(gameClock);
        clearInterval(spawnInterval);
        overlay.style.display = 'flex';
        
        document.getElementById('overlay-title').innerText = "MISYON ENDED";
        document.getElementById('overlay-text').innerHTML = `
            <div style="text-transform: uppercase; color: #f1c40f; font-weight: bold; margin-bottom:10px;">Mode: ${selectedDiff}</div>
            Final Awareness Score: <strong>${score}</strong><br>
            Time Survived: ${timerElement.innerText}
        `;
        startBtn.innerText = "Play Again";
    }

    function update() {
        if (!gameActive) return;
        for (let i = fallingItems.length - 1; i >= 0; i--) {
            let item = fallingItems[i];
            item.y += item.speed;

            const dx = mouseX - item.x;
            const dy = mouseY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20 + item.radius) {
                if (item.type === 'fact') {
                    score += 10;
                    scoreElement.innerText = score;
                } else {
                    credibility -= difficultySettings[selectedDiff].penalty;
                    livesElement.innerText = credibility;
                }
                fallingItems.splice(i, 1);
            } else if (item.y > canvas.height + 20) {
                fallingItems.splice(i, 1);
            }
            if (credibility <= 0) endGame();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = selectedDiff === 'hard' ? "rgba(206, 17, 38, 0.08)" : "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
        for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
        ctx.fillStyle = gameActive ? "#00ff00" : "#444";
        ctx.shadowBlur = gameActive ? 20 : 0;
        ctx.shadowColor = "#00ff00";
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;

        fallingItems.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
        });
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});