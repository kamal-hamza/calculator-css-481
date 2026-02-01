// Get calculator elements
const calculator = document.querySelector('.calculator');
const keys = document.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');

// Calculator state
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Update the display
function updateDisplay() {
    display.value = displayValue;
}

// Input a digit
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Input a decimal point
function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }
    
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Perform calculation
function calculate(first, second, operator) {
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            return first / second;
        default:
            return second;
    }
}

// Reset calculator
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Handle key press
keys.addEventListener('click', (event) => {
    const { target } = event;
    
    if (!target.matches('button')) {
        return;
    }
    
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }
    
    if (target.classList.contains('decimal')) {
        inputDecimal();
        updateDisplay();
        return;
    }
    
    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }
    
    if (target.classList.contains('equal-sign')) {
        handleOperator(target.value);
        displayValue = `${parseFloat(displayValue)}`;
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
        updateDisplay();
        return;
    }
    
    inputDigit(target.value);
    updateDisplay();
});

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputDigit(key);
        updateDisplay();
    } else if (key === '.') {
        inputDecimal();
        updateDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleOperator('=');
        displayValue = `${parseFloat(displayValue)}`;
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
        updateDisplay();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        resetCalculator();
        updateDisplay();
    } else if (key === 'Backspace') {
        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
        } else {
            displayValue = '0';
        }
        updateDisplay();
    }
});