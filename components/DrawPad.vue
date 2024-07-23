<template>
    <div class="shadow-md rounded-md border border-gray-50 bg-white/80 backdrop-blur-lg">
        <canvas ref="canvas" />
        <div class="flex justify-between">

            <div class="flex items-center">
                <UTooltip text="Undo" :shortcuts="[metaSymbol, 'z']">
                    <UButton variant="ghost" color="gray" label="Undo" icon="i-ph-arrow-arc-left-duotone"
                        @click="undo" />
                </UTooltip>
                <UTooltip text="Clear" :shortcuts="[metaSymbol, 'k']">
                    <UButton variant="ghost" color="red" icon="i-ph-x-circle-duotone" label="Clear" @click="clear" />
                </UTooltip>
                <UTooltip text="Solve" :shortcuts="[metaSymbol, 's']">
                    <UButton variant="ghost" color="blue" icon="i-ph-check-circle-duotone" :disabled="!canPost"
                        :loading="saving" @click="save" label="Solve" />
                </UTooltip>
                <UButton @click="drawText" label="Text" />
                <p>Last Draw Position: {{ lastPosition }}</p>
            </div>
        </div>

    </div>
</template>
<!-- eslint-disable @stylistic/indent -->
<script setup lang="ts">
import SignaturePad from "signature_pad";

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
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeCanvas);
    signaturePad.value?.off();
});

function resizeCanvas () {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.value.width = canvas.value.offsetWidth * ratio;
    canvas.value.height = canvas.value.offsetHeight * ratio;
    canvas.value.getContext("2d").scale(ratio, ratio);
    signaturePad.value.fromData(signaturePad.value.toData());
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
    console.log(dataURL);
    const datares = await $fetch("/api/ai", {
        method: "POST",
        body: {
            img: dataURL
        }
    });
    console.log(datares)
    emit("save", dataURL);
}
const drawText = () => {
    if (signaturePad && canvas.value) {
        const context = canvas.value.getContext('2d');
        if (context) {



            // Set text styles
            context.font = '30px Caveat';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Draw the text
            context.fillText("Hello", lastPosition.value?.x + 50, lastPosition.value?.y);
        }
    }
};
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
