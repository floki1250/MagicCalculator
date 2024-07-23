<template>
    <div>
        <input v-model="text" placeholder="Write something..." />
        <canvas ref="myCanvas" width="500" height="500"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
    name: 'CanvasTextComponent',
    setup () {
        const text = ref<string>('');
        const myCanvas = ref<HTMLCanvasElement | null>(null);
        let context: CanvasRenderingContext2D | null = null;

        onMounted(() => {
            if (myCanvas.value) {
                context = myCanvas.value.getContext('2d');
                drawText();
            }
        });

        const drawText = () => {
            if (context && myCanvas.value) {
                // Clear the canvas
                context.clearRect(0, 0, myCanvas.value.width, myCanvas.value.height);

                // Set text styles
                context.font = '30px Arial';
                context.fillStyle = 'black';
                context.textAlign = 'center';
                context.textBaseline = 'middle';

                // Draw the text
                context.fillText(text.value, myCanvas.value.width / 2, myCanvas.value.height / 2);
            }
        };

        // Watch for changes to the text and redraw the canvas
        watch(text, () => {
            drawText();
        });

        return {
            text,
            myCanvas,
            drawText
        };
    }
});
</script>

<style>
canvas {
    border: 1px solid black;
}
</style>
