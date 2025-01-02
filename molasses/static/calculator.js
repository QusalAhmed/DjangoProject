let currentExpression = '';
let currentResult = '';
const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');

function appendNumber(number) {
    const lastPart = currentExpression.split(/[\+\-\*\/\(\)]/).pop(); // Get the last part of the expression

    // Prevent multiple leading zeros in the current number
    if (lastPart.replaceAll(' ', '') === '0' && number === 0) {
        return; // Ignore the input if it's a second leading zero
    }

    // Replace leading zero with the new number (except for decimal cases)
    if (lastPart.replaceAll(' ', '') === '0' && number !== '.') {
        currentExpression = currentExpression.slice(0, -1) + number;
    } else {
        currentExpression += number;
    }

    autoCalculate();
    updateDisplay();
}

function appendDecimal() {
    const lastNumber = currentExpression.split(/[\+\-\*\/\(\)]/).pop(); // Get the current number

    // Allow decimal point only if not already present in the current number
    if (!lastNumber.includes('.')) {
        if (currentExpression === '' || /[\+\-\*\/]\s*$/.test(currentExpression)) {
            currentExpression += '0.';
        } else {
            currentExpression += '.';
        }
    }
    updateDisplay();
}

function appendBracket(bracket) {
    const lastChar = currentExpression.slice(-1);
    if (bracket === '(' && lastChar !== '') {
        currentExpression += '*';
    }
    currentExpression += bracket;
    if (bracket === ')') {
        autoCalculate();
    }
    updateDisplay();
}

function setOperation(op) {
    if (/[\+\-\*\/]\s*$/.test(currentExpression)) {
        currentExpression = currentExpression.replace(/[\+\-\*\/]\s*$/, ` ${op} `);
    } else {
        currentExpression += ` ${op} `;
    }
    autoCalculate();
    updateDisplay();
}

function autoCalculate() {
    try {
        if (/[0-9]\s*[\+\-\*\/]\s*[0-9]/.test(currentExpression)) {
            currentResult = eval(currentExpression.replace(/×/g, '*').replace(/÷/g, '/')).toString();
        } else {
            currentResult = '';
        }
    } catch {
        currentResult = '';
    }
}

function calculate() {
    if (currentExpression === '') return;
    try {
        currentResult = eval(currentExpression.replace(/×/g, '*').replace(/÷/g, '/')).toString();
    } catch (error) {
        currentResult = 'Error';
        // Set the text color to red for 1s
        resultDisplay.style.color = 'red';
        expressionDisplay.style.color = 'red';
        setTimeout(() => {
            resultDisplay.style.color = '';
            expressionDisplay.style.color = '';
            currentResult = '';
            updateDisplay();
        }, 1000);
    }
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '';
    currentResult = '';
    updateDisplay();
}

function deleteLast() {
    if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
    }
    autoCalculate();
    updateDisplay();
}

function updateDisplay() {
    const formattedExpression = currentExpression
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
    expressionDisplay.textContent = formattedExpression || '';
    if (currentResult === 'Error') {
        resultDisplay.textContent = '= Error';
    } else {
        resultDisplay.textContent = currentResult ? `= ${Number(currentResult).toLocaleString('en-BD')}` : '';
    }
}

// window.onload = function () {
//     console.log('Calculator loaded');
//     document.getElementById('calculator').removeAttribute('hidden');
// }

$(document).ready(function () {
    console.log('Calculator loaded');
    document.getElementById('calculator').removeAttribute('hidden');
});