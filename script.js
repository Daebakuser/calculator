// Basic arithmetic functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Div by 0";
    }
    return a / b;
}

function percentage(a) {
    return a / 100;
}

// Calculator state variables
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let displayValue = '0';
let resetDisplay = false;

// Operation function
function operate(operator, a, b = null) {
    let result;
    switch (operator) {
        case '+':
            result = add(a, b);
            break;
        case '-':
            result = subtract(a, b);
            break;
        case '*':
            result = multiply(a, b);
            break;
        case '/':
            if (b === 0) {
                display.textContent = "Error: Div by 0";
                firstOperand = null;
                secondOperand = null;
                currentOperator = null;
                resetDisplay = true;
                return "Error: Div by 0";
            }
            result = divide(a, b);
            break;
        case '%':
            result = percentage(a);
            break;
        default:
            return null;
    }
    return Math.round(result * 100000) / 100000;  // Round to 5 decimal places
}

// Display update function
const display = document.querySelector('#display');

function updateDisplay() {
    display.textContent = displayValue;
}

// Clear function
function clear() {
    displayValue = '0';
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    resetDisplay = false;
    updateDisplay();
}

// Backspace function
function backspace() {
    displayValue = displayValue.slice(0, -1) || '0';
    updateDisplay();
}

// Digit handling function
function handleDigit(digit) {
    if (resetDisplay) {
        displayValue = digit;
        resetDisplay = false;
    } else {
        if (digit === '.' && displayValue.includes('.')) return;
        if (displayValue === '0' && digit !== '.') {
            displayValue = digit;
        } else {
            displayValue += digit;
        }
    }
    updateDisplay();
}

// Operator handling function
function handleOperator(operator) {
    if (operator === '%') {
        firstOperand = parseFloat(displayValue);
        displayValue = String(operate(operator, firstOperand));
        updateDisplay();
        firstOperand = null;
        currentOperator = null;
    } else {
        if (firstOperand === null) {
            firstOperand = parseFloat(displayValue);
        } else if (currentOperator) {
            secondOperand = parseFloat(displayValue);
            firstOperand = operate(currentOperator, firstOperand, secondOperand);
            displayValue = String(firstOperand);
            updateDisplay();
        }
        currentOperator = operator;
        resetDisplay = true;
    }
}

// Equals handling function
function handleEquals() {
    if (currentOperator && firstOperand !== null) {
        secondOperand = parseFloat(displayValue);
        displayValue = String(operate(currentOperator, firstOperand, secondOperand));
        console.log(`Operands: ${firstOperand}, ${secondOperand}`);
        console.log(`Operator: ${currentOperator}`);
        
        updateDisplay();
        firstOperand = null;
        currentOperator = null;
        resetDisplay = true;
    }
}

// Decimal handling function
function handleDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

// Event listeners
document.querySelector('#clear').addEventListener('click', clear);
document.querySelector('#backspace').addEventListener('click', backspace);
document.querySelector('#equals').addEventListener('click', handleEquals);
document.querySelector('#decimal').addEventListener('click', handleDecimal);
document.querySelector('#percentage').addEventListener('click', () => handleOperator('%'));

document.querySelectorAll('.digit').forEach(button => {
    button.addEventListener('click', (e) => handleDigit(e.target.textContent));
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', (e) => handleOperator(e.target.textContent));
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
    } else if (e.key === '.') {
        handleDecimal();
    } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clear();
    } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
        handleOperator(e.key);
    }
});
