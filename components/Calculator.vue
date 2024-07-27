<template>
    <div class="bg-white/10 backdrop-blur-xl p-4  rounded-lg  ">
        <div class="bg-white  text-gray-600 text-right text-2xl p-2 rounded mb-4">{{ current }}</div>
        <div class=" grid grid-cols-10 gap-1 lg:gap-4 ">
            <template v-for="button in buttons" :key="button">
                <button @click="handleClick(button)" :class="getButtonClass(button)"
                    class="transition duration-300 ease-linear bg-white  hover:shadow-xl py-2 shadow-md rounded-full text-sm lg:text-xl min-w-8">
                    {{ button }}
                </button>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            current: '0',
            operator: null,
            previous: null,
            history: [],
            buttons: [
                '(', ')', 'mc', 'm+', 'm-', 'mr', 'AC', '↩', '%', '÷',
                '2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '7', '8', '9', '×',
                '1/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀', '4', '5', '6', '−',
                'x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+',
                'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '±', '0', '.', '='
            ]
        };
    },
    methods: {
        handleClick (button) {
            this.saveState();
            if (!isNaN(button) || button === '.') {
                this.handleNumber(button);
            } else if (button === 'AC') {
                this.clear();
            } else if (button === '↩') {
                this.undo();
            } else if (button === '=') {
                this.calculate();
            } else if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'ln', 'log₁₀', '²√x', '³√x', 'ʸ√x', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', 'x!', '1/x', 'π', 'Rand', '±', 'Rad', 'EE'].includes(button)) {
                this.handleSpecialFunction(button);
            } else {
                this.handleOperator(button);
            }
        },
        handleNumber (number) {
            if (this.current === '0' && number !== '.') {
                this.current = number;
            } else {
                this.current += number;
            }
        },
        handleOperator (operator) {
            if (this.operator !== null) {
                this.calculate();
            }
            this.previous = this.current;
            this.current = '0';
            this.operator = operator;
        },
        calculate () {
            let result;
            const previous = parseFloat(this.previous);
            const current = parseFloat(this.current);

            if (isNaN(previous) || isNaN(current)) return;

            switch (this.operator) {
                case '+':
                    result = previous + current;
                    break;
                case '−':
                    result = previous - current;
                    break;
                case '×':
                    result = previous * current;
                    break;
                case '÷':
                    result = previous / current;
                    break;
                case 'xʸ':
                    result = Math.pow(previous, current);
                    break;
            }

            this.current = result.toString();
            this.operator = null;
            this.previous = null;
        },
        handleSpecialFunction (func) {
            let result;
            const current = parseFloat(this.current);

            if (isNaN(current)) return;

            switch (func) {
                case 'sin':
                    result = Math.sin(current);
                    break;
                case 'cos':
                    result = Math.cos(current);
                    break;
                case 'tan':
                    result = Math.tan(current);
                    break;
                case 'sinh':
                    result = Math.sinh(current);
                    break;
                case 'cosh':
                    result = Math.cosh(current);
                    break;
                case 'tanh':
                    result = Math.tanh(current);
                    break;
                case 'ln':
                    result = Math.log(current);
                    break;
                case 'log₁₀':
                    result = Math.log10(current);
                    break;
                case '²√x':
                    result = Math.sqrt(current);
                    break;
                case '³√x':
                    result = Math.cbrt(current);
                    break;
                case 'ʸ√x':
                    const y = parseFloat(this.previous);
                    result = Math.pow(current, 1 / y);
                    break;
                case 'x²':
                    result = Math.pow(current, 2);
                    break;
                case 'x³':
                    result = Math.pow(current, 3);
                    break;
                case 'eˣ':
                    result = Math.exp(current);
                    break;
                case '10ˣ':
                    result = Math.pow(10, current);
                    break;
                case 'x!':
                    result = this.factorial(current);
                    break;
                case '1/x':
                    result = 1 / current;
                    break;
                case 'π':
                    result = Math.PI;
                    break;
                case 'Rand':
                    result = Math.random();
                    break;
                case '±':
                    result = current * -1;
                    break;
                case 'Rad':
                    result = current * (Math.PI / 180);
                    break;
                case 'EE':
                    this.current += 'e';
                    return;
            }

            this.current = result.toString();
        },
        factorial (n) {
            return n ? n * this.factorial(n - 1) : 1;
        },
        clear () {
            this.current = '0';
            this.operator = null;
            this.previous = null;
            this.history = [];
        },
        saveState () {
            this.history.push({
                current: this.current,
                operator: this.operator,
                previous: this.previous
            });
        },
        undo () {
            if (this.history.length > 0) {
                const lastState = this.history.pop();
                this.current = lastState.current;
                this.operator = lastState.operator;
                this.previous = lastState.previous;
            }
        },

        getButtonClass (button) {
            if (['+', '−', '×', '÷', '='].includes(button)) {
                return 'text-orange-500 ';
            } else if (!isNaN(button) || button === '.') {
                return 'text-gray-500';
            } else if (['(', ')', 'mc', 'm+', 'm-', 'mr', 'AC', '↩', '%'].includes(button)) {
                return 'text-blue-500 ';
            } else {
                return 'text-rose-600';
            }
        }
    }
};
</script>
