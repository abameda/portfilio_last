/* ============================================
   MATRIX RAIN EFFECT
   Canvas-based falling characters animation
   ============================================ */

class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:<>?,./~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.isRunning = false;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Start with matrix effect visible but subtle
    this.canvas.style.opacity = '0.05';
    this.start();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    
    // Initialize drops
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }
  
  draw() {
    // Semi-transparent black to create trail effect
    this.ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set text properties
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Draw characters
    for (let i = 0; i < this.drops.length; i++) {
      // Random character
      const char = this.characters[Math.floor(Math.random() * this.characters.length)];
      
      // Calculate position
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      // Vary the color slightly
      if (Math.random() > 0.98) {
        this.ctx.fillStyle = '#ffffff';
      } else if (Math.random() > 0.95) {
        this.ctx.fillStyle = '#39ff14';
      } else {
        this.ctx.fillStyle = '#00f0ff';
      }
      
      this.ctx.fillText(char, x, y);
      
      // Reset drop when it goes off screen
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      // Move drop down
      this.drops[i]++;
    }
  }
  
  animate() {
    if (!this.isRunning) return;
    
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  toggle() {
    if (this.isRunning) {
      this.stop();
      this.canvas.style.opacity = '0';
    } else {
      this.canvas.style.opacity = '0.1';
      this.start();
    }
    return this.isRunning;
  }
  
  setOpacity(value) {
    this.canvas.style.opacity = value;
  }
}

// Style the canvas
const style = document.createElement('style');
style.textContent = `
  #matrix-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    transition: opacity 0.5s ease;
  }
`;
document.head.appendChild(style);

// Initialize
const matrixRain = new MatrixRain('matrix-canvas');

// Expose to global scope for terminal commands
window.matrixRain = matrixRain;
