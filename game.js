class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 150;
         document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 添加移动端控制
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.target.className.split(' ')[1];
                const directionMap = {
                    'up': 'ArrowUp',
                    'down': 'ArrowDown',
                    'left': 'ArrowLeft',
                    'right': 'ArrowRight'
                };
                this.handleKeyPress({ key: directionMap[direction] });
            });
        });
        
        // 防止移动设备上的滚动和缩放
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturestart', (e) => e.preventDefault());
    }
     generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }
     drawSquare(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }
     draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 画蛇
        this.snake.forEach((segment, index) => {
            this.drawSquare(segment.x, segment.y, index === 0 ? '#4CAF50' : '#45a049');
        });
         // 画食物
        this.drawSquare(this.food.x, this.food.y, 'red');
    }
     move() {
        const head = {...this.snake[0]};
         switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
         // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.generateFood();
            this.score += 10;
            document.getElementById('scoreText').textContent = this.score;
        } else {
            this.snake.pop();
        }
         // 检查游戏结束条件
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
         this.snake.unshift(head);
        this.draw();
    }
     checkCollision(head) {
        // 撞墙
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }
         // 撞到自己
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }
     handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
         const newDirection = keyMap[event.key];
        if (!newDirection) return;
         const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
         // 防止蛇反向移动
        if (opposites[newDirection] !== this.direction) {
            this.direction = newDirection;
        }
    }
     startGame() {
        if (this.gameLoop) {
            this.gameOver();
        }
         // 重置游戏状态
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        document.getElementById('scoreText').textContent = '0';
        this.food = this.generateFood();
         // 开始游戏循环
        this.gameLoop = setInterval(() => this.move(), this.gameSpeed);
    }
     gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        alert('游戏结束！你的得分是: ' + this.score);
    }
}

// 初始化游戏
window.onload = () => {
    new SnakeGame();
};