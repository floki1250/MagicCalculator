<template>
    <div>
        <div class="flex items-center justify-end  backdrop-blur-lg">
            <div>
                <UButton variant="ghost" color="gray" label="Undo" icon="i-ph-arrow-arc-left-duotone" @click="undo()" />
                <UButton variant="ghost" color="red" icon="i-ph-x-circle-duotone" label="Clear" @click="clear()" />
                <UButton variant="ghost" color="blue" icon="i-ph-check-circle-duotone" :disabled="!canPost"
                    :loading="saving" @click="save()" label="Solve" />
            </div>
        </div>
        <canvas ref="canvas" />
    </div>
</template>
<!-- eslint-disable @stylistic/indent -->
<script setup lang="ts">
import SignaturePad from "signature_pad";
const text = ref<string>('');
const props = defineProps({
    saveLabel: {
        type: String,
        default: "Save",
    },
    saveType: {
        type: String,
        default: "image/jpeg",
    },
    saving: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["save"]);

const canPost = ref(false);
const canvas = ref();
const signaturePad = ref();
const { metaSymbol } = useShortcuts();
const lastPosition = ref<{ x: number, y: number } | null>(null);
defineShortcuts({
    meta_z: undo,
    meta_k: clear,
});

onMounted(() => {
    signaturePad.value = new SignaturePad(canvas.value, {
        penColor: "#030712",
        backgroundColor: "#fff",
        minWidth: 5,
        maxWidth: 5,
    });
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    signaturePad.value.addEventListener("afterUpdateStroke", () => {
        canPost.value = !signaturePad.value.isEmpty();
    });
    signaturePad.value.addEventListener('endStroke', () => {
        const data = signaturePad.value.toData();
        if (data.length > 0) {
            const lastStroke = data[data.length - 1];
            if (lastStroke.points.length > 0) {
                const lastPoint = lastStroke.points[lastStroke.points.length - 1];
                lastPosition.value = { x: lastPoint.x, y: lastPoint.y };
            }
        }
    });
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeCanvas);
    signaturePad.value?.off();
});
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let testWidth;

    for (let n = 0; n < words.length; n++) {
        testLine += words[n] + ' ';
        testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            testLine = line;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
};

function resizeCanvas () {
    if (canvas.value) {
        // Get the pixel ratio
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        // Set the canvas width and height to match the parent element
        const parentWidth = canvas.value.parentElement?.offsetWidth || 500;
        const parentHeight = canvas.value.parentElement?.offsetHeight || 500;
        canvas.value.width = parentWidth * ratio;
        canvas.value.height = parentHeight * ratio;
        canvas.value.style.width = `${parentWidth}px`;
        canvas.value.style.height = `${parentHeight}px`;
        // Scale the context to match the pixel ratio
        const context = canvas.value.getContext('2d');
        if (context) {
            context.scale(ratio, ratio);
        }
        drawText("hello");
    }
}

function clear () {
    if (!signaturePad.value) return;
    signaturePad.value.clear();
    canPost.value = false;
}

function undo () {
    if (!signaturePad.value) return;
    const data = signaturePad.value.toData();
    if (data) {
        data.pop(); // remove the last dot or line
        signaturePad.value.fromData(data);
        canPost.value = !signaturePad.value.isEmpty();
    }
}

async function save () {
    if (!signaturePad.value || signaturePad.value.isEmpty() || props.saving) return;
    const dataURL = signaturePad.value.toDataURL(props.saveType);
    const datares = await $fetch("/api/ai", {
        method: "POST",
        body: {
            img: dataURL
        }
    });
    if (datares !== null) {
        drawText(datares.toString());
    }
    console.log(datares)

    emit("save", dataURL);
}


const drawText = (text: string) => {
    if (signaturePad && canvas.value) {
        const context = canvas.value.getContext('2d');
        if (context) {
            signaturePad.value.clear();
            // Set text styles
            context.font = '25px Caveat';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Calculate the maximum width and line height
            const maxWidth = canvas.value.width / (window.devicePixelRatio || 1) - 40;
            const lineHeight = 40; // Adjust as needed

            // Calculate initial y position
            const x = (canvas.value.width / (window.devicePixelRatio || 1)) / 2;
            const y = (canvas.value.height / (window.devicePixelRatio || 1)) / 2;
            // Split text into lines and draw each line
            wrapText(context, text, x, y, maxWidth, lineHeight);
        }
    }
};
watch(text, drawText);
</script>
<style scoped>
canvas {
    min-width: 400px;
    min-height: 300px;
    width: 100%;
    height: auto;
    cursor: crosshair;
}

a,
button,
canvas {
    user-select: none;
}
</style>
