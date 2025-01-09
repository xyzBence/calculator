document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.getElementById('calculator');
    const footer = document.querySelector('footer'); 
    const openButton = document.getElementById('open-calculator');
    const closeButton = document.getElementById('close-calculator');
    const historyDisplay = document.getElementById('history');
    const resultDisplay = document.getElementById('result');
    const datetimeElement = document.getElementById('datetime');

    let currentValue = '';
    let operator = null;
    let previousValue = '';
    let isDragging = false;
    let offsetX = 0, offsetY = 0;


    const centerCalculator = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const centeredLeft = (viewportWidth - calculator.offsetWidth) / 2;
        const centeredTop = (viewportHeight - calculator.offsetHeight) / 2;

        calculator.style.position = 'absolute';
        calculator.style.left = `${centeredLeft}px`;
        calculator.style.top = `${centeredTop}px`;
    };


    openButton.addEventListener('click', () => {
        calculator.classList.remove('closing');
        calculator.classList.add('active');
        centerCalculator();
    });


    closeButton.addEventListener('click', () => {
        calculator.classList.remove('active');
        calculator.classList.add('closing');
        setTimeout(() => {
            calculator.classList.remove('closing');
        }, 400);
    });


    calculator.addEventListener('mousedown', (e) => {
        if (e.target.closest('.header')) {
            isDragging = true;
            const rect = calculator.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            calculator.style.cursor = 'grabbing';
            calculator.style.transition = 'none';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;


        const maxX = window.innerWidth - calculator.offsetWidth;
        const maxY = window.innerHeight - calculator.offsetHeight - footer.offsetHeight; 

        newX = Math.max(0, Math.min(maxX, newX));
        newY = Math.max(0, Math.min(maxY, newY));

        calculator.style.left = `${newX}px`;
        calculator.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            calculator.style.cursor = 'grab';
            calculator.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        }
    });


    const updateDisplay = () => {
        const maxLength = 15; 
        if (currentValue.length > maxLength) {
            resultDisplay.style.fontSize = '24px'; 
        } else {
            resultDisplay.style.fontSize = '36px'; 
        }
        resultDisplay.textContent = currentValue || '0';
    };


    const updateHistory = () => {
        historyDisplay.textContent = previousValue + (operator ? ` ${operator} ` : '') + currentValue;
    };


    const clearCalculator = () => {
        currentValue = '';
        operator = null;
        previousValue = '';
        updateDisplay();
        updateHistory();
    };

    const calculateResult = () => {
        const current = parseFloat(currentValue);
        const previous = parseFloat(previousValue);

        if (isNaN(current) || isNaN(previous)) {
            resultDisplay.textContent = 'Error';
            return;
        }

        switch (operator) {
            case '+':
                currentValue = (previous + current).toString();
                break;
            case '-':
                currentValue = (previous - current).toString();
                break;
            case '*':
                currentValue = (previous * current).toString();
                break;
            case '/':
                currentValue = current === 0 ? 'Error' : (previous / current).toString();
                break;
            case '%':
                currentValue = (previous % current).toString();
                break;
            default:
                return;
        }

        operator = null;
        previousValue = '';
        updateDisplay();
        updateHistory();
    };


    document.querySelector('.buttons').addEventListener('click', (e) => {
        const button = e.target;
        if (!button.classList.contains('btn')) return;

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value) {
            currentValue += value;
            updateDisplay();
            updateHistory();
        } else if (action) {
            switch (action) {
                case 'clear':
                    clearCalculator();
                    break;
                case 'delete':
                    currentValue = currentValue.slice(0, -1);
                    updateDisplay();
                    updateHistory();
                    break;
                case 'calculate':
                    calculateResult();
                    break;
                default:
                    if (currentValue) {
                        previousValue = currentValue;
                        currentValue = '';
                        operator = action;
                        updateHistory();
                    }
                    break;
            }
        }
    });

 
    const updateDateTime = () => {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        datetimeElement.textContent = now.toLocaleDateString('en-GB', options);
    };

    setInterval(updateDateTime, 1000);
    updateDateTime();

    centerCalculator();
    window.addEventListener('resize', centerCalculator);
});
