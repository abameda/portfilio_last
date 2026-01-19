/* ============================================
   HIDDEN TERMINAL EASTER EGG
   Activate with backtick (`) key
   ============================================ */

class HiddenTerminal {
    constructor() {
        this.terminal = document.getElementById('hidden-terminal');
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.closeBtn = document.querySelector('.hidden-terminal-close');

        if (!this.terminal || !this.output || !this.input) return;

        this.history = [];
        this.historyIndex = -1;
        this.isOpen = false;

        this.commands = {
            help: this.cmdHelp.bind(this),
            about: this.cmdAbout.bind(this),
            skills: this.cmdSkills.bind(this),
            projects: this.cmdProjects.bind(this),
            contact: this.cmdContact.bind(this),
            matrix: this.cmdMatrix.bind(this),
            clear: this.cmdClear.bind(this),
            whoami: this.cmdWhoami.bind(this),
            ls: this.cmdLs.bind(this),
            cat: this.cmdCat.bind(this),
            sudo: this.cmdSudo.bind(this),
            exit: this.cmdExit.bind(this),
            secret: this.cmdSecret.bind(this),
            hack: this.cmdHack.bind(this),
        };

        this.init();
    }

    init() {
        // Keyboard shortcut to open terminal
        document.addEventListener('keydown', (e) => {
            if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.toggle();
            }

            // Escape to close
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Input handling
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value);
                this.history.push(this.input.value);
                this.historyIndex = this.history.length;
                this.input.value = '';
            }

            // History navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Click outside to close
        this.terminal.addEventListener('click', (e) => {
            if (e.target === this.terminal) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.terminal.classList.add('active');
        this.isOpen = true;
        this.input.focus();

        if (this.output.children.length === 0) {
            this.print('Welcome to the secret terminal!', 'success');
            this.print('Type "help" to see available commands.', 'muted');
            this.print('');
        }
    }

    close() {
        this.terminal.classList.remove('active');
        this.isOpen = false;
    }

    print(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-output-line ${type}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    printCommand(cmd) {
        this.print(`<span class="prompt">visitor@portfolio:~$</span> ${cmd}`);
    }

    executeCommand(input) {
        const trimmed = input.trim().toLowerCase();
        this.printCommand(input);

        if (!trimmed) return;

        const args = trimmed.split(' ');
        const cmd = args[0];

        if (this.commands[cmd]) {
            this.commands[cmd](args.slice(1));
        } else {
            this.print(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
        }
    }

    // Commands
    cmdHelp() {
        this.print(`
<span class="text-cyan">Available Commands:</span>

  <span class="text-green">help</span>      - Show this help message
  <span class="text-green">about</span>     - Navigate to about section
  <span class="text-green">skills</span>    - Navigate to skills section
  <span class="text-green">projects</span>  - Navigate to projects section
  <span class="text-green">contact</span>   - Navigate to contact section
  <span class="text-green">matrix</span>    - Toggle matrix rain effect
  <span class="text-green">clear</span>     - Clear terminal
  <span class="text-green">whoami</span>    - Display user info
  <span class="text-green">ls</span>        - List directory contents
  <span class="text-green">exit</span>      - Close terminal

<span class="text-muted">Try discovering hidden commands...</span>
    `);
    }

    cmdAbout() {
        this.print('Navigating to about section...', 'success');
        this.close();
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }

    cmdSkills() {
        this.print('Navigating to skills section...', 'success');
        this.close();
        document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
    }

    cmdProjects() {
        this.print('Navigating to projects section...', 'success');
        this.close();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }

    cmdContact() {
        this.print('Navigating to contact section...', 'success');
        this.close();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    cmdMatrix() {
        if (window.matrixRain) {
            const isRunning = window.matrixRain.toggle();
            if (isRunning) {
                window.matrixRain.setOpacity('0.15');
                this.print('Matrix rain activated. Welcome to the simulation.', 'success');
            } else {
                this.print('Matrix rain deactivated.', 'muted');
            }
        } else {
            this.print('Matrix module not loaded.', 'error');
        }
    }

    cmdClear() {
        this.output.innerHTML = '';
    }

    cmdWhoami() {
        this.print(`
<span class="text-cyan">╔════════════════════════════════════╗
║         USER INFORMATION           ║
╠════════════════════════════════════╣
║  Username: visitor                 ║
║  Access:   guest                   ║
║  Session:  active                  ║
║  Location: portfolio/              ║
╚════════════════════════════════════╝</span>
    `);
    }

    cmdLs() {
        this.print(`
<span class="text-cyan">drwxr-xr-x</span>  about/
<span class="text-cyan">drwxr-xr-x</span>  projects/
<span class="text-cyan">drwxr-xr-x</span>  skills/
<span class="text-cyan">drwxr-xr-x</span>  experience/
<span class="text-cyan">drwxr-xr-x</span>  contact/
<span class="text-green">-rw-r--r--</span>  README.md
<span class="text-green">-rw-r--r--</span>  .secrets
    `);
    }

    cmdCat(args) {
        if (!args.length) {
            this.print('Usage: cat <filename>', 'muted');
            return;
        }

        const file = args[0];

        if (file === 'README.md') {
            this.print(`
<span class="text-cyan"># Portfolio README</span>

Welcome to my portfolio! This is a hacker-themed 
showcase of my projects and skills.

Built with vanilla HTML, CSS, and JavaScript.
No frameworks, just pure code.

<span class="text-muted">© 2024 - All rights reserved</span>
      `);
        } else if (file === '.secrets') {
            this.print('Permission denied. Nice try though! 😏', 'error');
        } else {
            this.print(`cat: ${file}: No such file or directory`, 'error');
        }
    }

    cmdSudo() {
        this.print(`
<span class="text-red">
██╗    ██╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
██║    ██║██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ 
██║ █╗ ██║███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
██║███╗██║██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
╚███╔███╔╝██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
</span>
visitor is not in the sudoers file. This incident will be reported. 🚨
    `);
    }

    cmdExit() {
        this.print('Closing terminal...', 'muted');
        setTimeout(() => this.close(), 500);
    }

    cmdSecret() {
        this.print(`
<span class="text-purple">
🔮 You found a secret command!

Here are some things you might not know:
• Press Ctrl + Shift + I to see hidden ASCII art in the console
• The matrix background can be intensified with the matrix command
• This portfolio was coded with ♥ and lots of coffee

Keep exploring... there might be more secrets hidden.
</span>
    `);
    }

    cmdHack() {
        this.print('<span class="text-green">Initiating hack sequence...</span>');

        const messages = [
            'Bypassing firewall...',
            'Accessing mainframe...',
            'Decrypting passwords...',
            'Downloading secret files...',
            'ERROR: Just kidding! This is a portfolio, not a hacking tool 😄',
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                this.print(messages[i], i === messages.length - 1 ? 'error' : 'muted');
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);
    }
}

// Add terminal styles
const terminalStyles = document.createElement('style');
terminalStyles.textContent = `
  .hidden-terminal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  .hidden-terminal.active {
    opacity: 1;
    visibility: visible;
  }
  
  .hidden-terminal-content {
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    background: var(--bg-primary);
    border: 1px solid var(--color-cyan-dim);
    border-radius: 8px;
    box-shadow: 0 0 40px rgba(0, 240, 255, 0.2);
    overflow: hidden;
    transform: translateY(20px);
    transition: transform 0.3s ease;
  }
  
  .hidden-terminal.active .hidden-terminal-content {
    transform: translateY(0);
  }
  
  .hidden-terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    background: var(--bg-tertiary);
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }
  
  .hidden-terminal-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.5rem;
    transition: color 0.2s ease;
  }
  
  .hidden-terminal-close:hover {
    color: var(--color-red);
  }
  
  .hidden-terminal-body {
    padding: var(--space-lg);
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .hidden-terminal-output {
    margin-bottom: var(--space-md);
  }
  
  .terminal-output-line {
    font-size: var(--font-size-sm);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .terminal-output-line.error {
    color: var(--color-red);
  }
  
  .terminal-output-line.success {
    color: var(--color-green);
  }
  
  .terminal-output-line.muted {
    color: var(--text-muted);
  }
  
  .terminal-output-line .prompt {
    color: var(--color-green);
  }
  
  .terminal-output-line .text-cyan {
    color: var(--color-cyan);
  }
  
  .terminal-output-line .text-green {
    color: var(--color-green);
  }
  
  .terminal-output-line .text-purple {
    color: var(--color-purple);
  }
  
  .terminal-output-line .text-red {
    color: var(--color-red);
  }
  
  .terminal-output-line .text-muted {
    color: var(--text-muted);
  }
  
  .hidden-terminal-input-line {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
  
  .hidden-terminal-input-line .prompt {
    color: var(--color-green);
    font-size: var(--font-size-sm);
    white-space: nowrap;
  }
  
  .hidden-terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    outline: none;
    caret-color: var(--color-cyan);
  }
`;
document.head.appendChild(terminalStyles);

// Initialize
const hiddenTerminal = new HiddenTerminal();

// Console easter egg
console.log(`
%c╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗             ║
║   ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗            ║
║   ███████║███████║██║     █████╔╝ █████╗  ██████╔╝            ║
║   ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗            ║
║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║            ║
║   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝            ║
║                                                               ║
║   Welcome to the matrix, curious developer!                   ║
║   Press \` (backtick) to open the hidden terminal.             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`, 'color: #00f0ff; font-family: monospace;');
