<template>
    <div class="flex justify-center items-center">
        <div class="flex flex-col">
            <!-- Display Section -->
            <section class="flex flex-col mb-2">
                <div class="text-gray-600 text-right text-sm mb-1" id="history-display">{{ history }}</div>
                <div class="text-gray-900 text-right text-4xl font-medium" id="main-display">{{ display }}</div>
            </section>

            <!-- Memory Buttons -->
            <section class="flex mb-2 space-x-1">
                <button class="flex-1 font-medium text-sm py-1">MC</button>
                <button class="flex-1 font-medium text-sm py-1">MR</button>
                <button class="flex-1 font-medium text-sm py-1">M+</button>
                <button class="flex-1 font-medium text-sm py-1">M-</button>
                <button class="flex-1 font-medium text-sm py-1">MS</button>
                <button class="flex-1 font-medium text-sm py-1">M</button>
            </section>

            <!-- Scientific Buttons -->
            <div class="flex gap-4">
                <section class="hidden lg:grid grid-cols-4 gap-1 mt-2 min-w-80">
                    <button v-for="button in scientificButtons" :key="button"
                        class="bg-white/70 text-center py-2 rounded hover:bg-white hover:shadow-2xl"
                        @click="handleButtonClick(button)">
                        {{ button }}
                    </button>
                </section>

                <!-- Basic Buttons -->
                <section class="grid grid-cols-4 gap-1 mt-2 min-w-80">
                    <button v-for="button in basicButtons" :key="button"
                        class="bg-white/70 text-center py-2 rounded hover:bg-white hover:shadow-2xl"
                        @click="handleButtonClick(button)">
                        {{ button }}
                    </button>
                </section>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const display = ref('0')
const history = ref('')

// Buttons array
const scientificButtons = [
    '(', ')', '2nd', 'x³', 'xʸ', 'eˣ', '10ˣ', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀',
    'x!', 'sin', 'cos', 'tan', 'e', 'EE', 'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand'
]
const basicButtons = [
    '%', 'CE', 'C', '<', 'sqrt', 'x²', '1/x', '/', '7', '8', '9', 'X', '4', '5', '6', '-',
    '1', '2', '3', '+', '+/-', '0', '.', '='
]

// Handling button clicks
const handleButtonClick = (button) => {
    switch (button) {
        case 'CE':
            display.value = '0'
            break
        case 'C':
            display.value = '0'
            history.value = '0'
            break
        case '<':
            display.value = display.value.slice(0, -1) || '0'
            break
        case '=':
            try {
                display.value = eval(display.value.replace(/X/g, '*').replace(/÷/g, '/')).toString()
                history.value = display.value
            } catch (e) {
                display.value = 'Error'
            }
            break
        default:
            if (display.value === '0') {
                display.value = button
            } else {
                display.value += button
            }
            break
    }
}
</script>
