<template>
    <div class="grid grid-cols-12 gap-4 ">
        <div class="col-span-12  p-8 shadow-md rounded-md border border-gray-50 bg-white/80 backdrop-blur-lg">Column
        </div>

        <div class="lg:col-span-8 col-span-12">

            <DrawPad @save="save" :saving="saving" save-label="Solve" />
        </div>
        <div
            class="col-span-12 lg:col-span-4 p-8 shadow-md rounded-md border border-gray-50 bg-white/80 backdrop-blur-lg">
            <img :src="imgData" alt="">
        </div>
    </div>
</template>
<script lang="ts" setup>
const saving = ref(false)
const imgData = ref("")
async function save (dataURL: string) {
    saving.value = true
    console.log(dataURL)
    imgData.value = dataURL
    saving.value = false
}
</script>