<template>
    <div class="grid grid-cols-12 gap-4 ">
        <div class="col-span-12 shadow-md rounded-md border border-gray-50 bg-white/80 backdrop-blur-lg">
            <div class="flex justify-between p-2 ">
                <UButton variant="ghost" color="blue" :label="mode === 'calculator' ? 'Calculator' : 'DrawPad'"
                    @click="switchMode"
                    :icon="mode === 'calculator' ? 'i-ph-calculator-duotone' : 'i-ph-pencil-line-duotone'" />
                <UButton variant="ghost" color="orange" label="Graph" icon="i-ph-chart-scatter-duotone"
                    :disabled="mode !== 'drawpad'" />
            </div>
            <Calculator v-if="mode === 'calculator'" />
            <DrawPad @save="save" :saving="saving" save-label="Solve" v-else />
        </div>
    </div>
</template>
<script lang="ts" setup>
const saving = ref(false)
const mode = ref("calculator")
const graph = ref(false)
const imgData = ref("")
async function save (dataURL: string) {
    saving.value = true
    imgData.value = dataURL
    saving.value = false
}

function switchMode () {
    mode.value = mode.value === "calculator" ? "drawpad" : "calculator"
}
</script>