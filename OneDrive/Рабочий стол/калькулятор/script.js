const calculator = {
    currentInput: '',
    formula: '',
    resetNextInput: false,
    history: [],
    memory: 0,
    scientificMode: false
};

function appendNumber(number) {
    if (calculator.resetNextInput) {
        calculator.currentInput = number;
        calculator.resetNextInput = false;
    } else {
        if (number === '0' && calculator.currentInput === '0') return;
        if (number === '.' && calculator.currentInput.includes('.')) return;
        
        calculator.currentInput += number;
    }
    updateDisplay();
    
    if (event instanceof MouseEvent) {
        animateButton(event.target);
    }
}

function clearAll() {
    calculator.currentInput = '';
    calculator.formula = '';
    updateDisplay();
    animateButton(event.target);
}

function handleOperator(op) {
    if (event instanceof MouseEvent) {
        animateButton(event.target);
    }
    
    if (op === '=') {
        try {
            let expression = calculator.formula + calculator.currentInput;

            expression = expression.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)');
            expression = expression.replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)');
            expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(toRadians($1))');
            expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(toRadians($1))');
            expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(toRadians($1))');
            expression = expression.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
            expression = expression.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
            expression = expression.replace(/factorial\(([^)]+)\)/g, 'factorial($1)');
            expression = expression.replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');
            expression = expression.replace(/π/g, 'Math.PI');
            expression = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

            const result = eval(expression);
            
            let formattedResult = result;
            if (Number.isInteger(result)) {
                formattedResult = result.toString();
            } else {
                formattedResult = parseFloat(result.toFixed(8)).toString();
            }
            
            calculator.history.push(`${calculator.formula}${calculator.currentInput} = ${formattedResult}`);
            calculator.currentInput = formattedResult;
            calculator.formula = '';
            calculator.resetNextInput = true;
            updateHistory();
        } catch (e) {
            showError();
        }
        updateDisplay();
        return;
    }

    if (calculator.currentInput === '' && calculator.formula === '') return;

    calculator.formula += calculator.currentInput + op;
    calculator.currentInput = '';
    updateDisplay();
}

function handleSpecial(symbol) {
    if (event instanceof MouseEvent) {
        animateButton(event.target);
    }
    
    if (symbol === '√') {
        calculator.currentInput = '√' + calculator.currentInput;
    } else if (symbol === '^') {
        calculator.formula += calculator.currentInput + '^';
        calculator.currentInput = '';
    } else if (symbol === '±') {
        if (calculator.currentInput.startsWith('-')) {
            calculator.currentInput = calculator.currentInput.substring(1);
        } else if (calculator.currentInput !== '') {
            calculator.currentInput = '-' + calculator.currentInput;
        }
    } else if (symbol === 'π') {
        if (calculator.resetNextInput) {
            calculator.currentInput = 'π';
            calculator.resetNextInput = false;
        } else {
            calculator.currentInput += 'π';
        }
    }
    updateDisplay();
}

function handleFunction(func) {
    if (event instanceof MouseEvent) {
        animateButton(event.target);
    }
    if (calculator.currentInput === '') return;
    calculator.currentInput = `${func}(${calculator.currentInput})`;
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('display');
    const previous = document.getElementById('previous');
    
    display.textContent = calculator.currentInput || '0';
    previous.textContent = calculator.formula;
    
    document.getElementById('memory-indicator').textContent = calculator.memory !== 0 ? 'M' : '';
}

function showError() {
    calculator.currentInput = 'Ошибка';
    calculator.formula = '';
    calculator.resetNextInput = true;
    document.getElementById('display').classList.add('error');
    setTimeout(() => {
        document.getElementById('display').classList.remove('error');
    }, 1000);
}

function toRadians(deg) {
    return deg * (Math.PI / 180);
}

function toggleTheme() {
    animateButton(event.target);
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const themeIcon = document.querySelector('.theme-icon');

    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '🌙';
    } else {
        html.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☀️';
    }
}

function toggleMode() {
    animateButton(event.target);
    calculator.scientificMode = !calculator.scientificMode;
    const modeBtn = document.querySelector('.mode-btn');
    
    if (calculator.scientificMode) {
        modeBtn.textContent = 'Научный режим';
        document.querySelector('.calculator').classList.add('scientific-mode');
    } else {
        modeBtn.textContent = 'Обычный режим';
        document.querySelector('.calculator').classList.remove('scientific-mode');
    }
}

function updateHistory() {
    const historyItems = document.getElementById('history-items');
    historyItems.innerHTML = '';

    calculator.history.slice().reverse().forEach(entry => {
        const item = document.createElement('div');
        item.textContent = entry;
        item.onclick = function() {
            const expr = entry.split('=')[0].trim();
            calculator.currentInput = '';
            calculator.formula = expr;
            calculator.resetNextInput = false;
            updateDisplay();
            animateButton(this);
        };
        historyItems.appendChild(item);
    });
}

function clearHistory() {
    animateButton(event.target);
    calculator.history = [];
    updateHistory();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function memoryClear() {
    animateButton(event.target);
    calculator.memory = 0;
    updateDisplay();
}

function memoryRecall() {
    animateButton(event.target);
    if (calculator.memory !== 0) {
        calculator.currentInput = String(calculator.memory);
        updateDisplay();
    }
}

function memoryAdd() {
    animateButton(event.target);
    if (calculator.currentInput) {
        calculator.memory += parseFloat(calculator.currentInput) || 0;
        updateDisplay();
    }
}

function memorySubtract() {
    animateButton(event.target);
    if (calculator.currentInput) {
        calculator.memory -= parseFloat(calculator.currentInput) || 0;
        updateDisplay();
    }
}

function animateButton(button) {
    if (button && event instanceof MouseEvent) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 200);
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    let button = null;

    if (/[0-9]/.test(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        button = document.querySelector(`button.orange[onclick*="'${key}'"]`);
        if (button) handleOperator.call({target: button}, key);
    } else if (key === 'Enter' || key === '=') {
        button = document.querySelector(`button.orange[onclick*="'='"]`);
        if (button) handleOperator.call({target: button}, '=');
    } else if (key === 'Escape') {
        button = document.querySelector(`button.gray[onclick*="clearAll"]`);
        if (button) clearAll.call({target: button});
    } else if (key === 'Backspace') {
        calculator.currentInput = calculator.currentInput.slice(0, -1);
        updateDisplay();
    } else if (key === '(' || key === ')') {
        button = document.querySelector(`button.func-btn[onclick*="'${key}'"]`);
        if (button) appendNumber.call({target: button}, key);
    } else if (key.toLowerCase() === 'm') {
        button = document.querySelector(`button.memory-btn[onclick*="memoryRecall"]`);
        if (button) memoryRecall.call({target: button});
    } else if (key.toLowerCase() === 'c' && event.ctrlKey) {
        button = document.querySelector(`button.memory-btn[onclick*="memoryClear"]`);
        if (button) memoryClear.call({target: button});
    } else if (key === '+') {
        button = document.querySelector(`button.memory-btn[onclick*="memoryAdd"]`);
        if (button) memoryAdd.call({target: button});
    } else if (key === '_') {
        button = document.querySelector(`button.memory-btn[onclick*="memorySubtract"]`);
        if (button) memorySubtract.call({target: button});
    } else if (key === 't') {
        button = document.querySelector(`button.mode-btn`);
        if (button) toggleMode.call({target: button});
    } else if (key === 'p' && event.shiftKey) {
        button = document.querySelector(`button.func-btn[onclick*="'π'"]`);
        if (button) handleSpecial.call({target: button}, 'π');
    }
});