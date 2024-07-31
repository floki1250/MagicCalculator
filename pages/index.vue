<template>
    <div class="flex justify-center items-center h-screen">
        <div class="bg-white/50 shadow-lg rounded-lg p-4 ">
            <section class="flex items-center mb-2">
                <button class="px-4 py-2 mr-4 hover:bg-white rounded" @click="switchMode()">
                    <UIcon name="i-ph-list" />
                </button>
                <span class="text-xl font-light">{{ mode }}</span>
                <button class="px-4 py-3 ml-auto hover:bg-white rounded">
                    <img class="w-5"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHISURBVFhH7ZY5TsQwFIanREL0rGIVcBeWjoLtAKwFi+AmCKiR2GmAgoOwXIAaEBJi5//CPMmKsjiJy3zSpxm/PL94Mo7tRk1NQfrllryRj/JNvso7eS0XZbcMTp88lN/yN8dPuS87ZCmskDEn+ZXE3uWBnJK9skW2yhE5LY8kOeQ+y3FZGHcAPG5rn0lumsegPJH04YmtyELYDeebnz9yTSZhuUmsy6+mEwR8saL22LdlGlkDAAbB9SfpPSesKDKzs7C8LE4lOXtRywMrmmSctLgLc4KJydvRRSAP94Zx46TF4xxL8lgnguI7gBlJ3mXUCojvAIYlefdRKyA2gCRd2iSxl6iVA0kk0ykP94ZxXQoN4EGSzGMLBUs1Nb3+gitJMmt7KGYlNb0m4ZIkmY0lFPYaLkStHHokiwaLxwCBirAQfUhqdhLwgf2cETPyqlxIau1ELU8YKRsIHdN2Qh82JDWo1U6gCJPStlN2taJsSus/RqAMq9KOYRwyhmQe5JxL+nDzZVkJjlUcryjIxGResLaPSo5jyHdeNa65R7LSvzwOh4ldyUymeJbkMOFKH0qzYD/nXWZBuZUsrch3Ylzz2vNrav5pNP4ArhaxkX71zlYAAAAASUVORK5CYII="
                        alt="History Icon" />
                </button>
            </section>

            <Transition name="slide-up">
                <Calc v-if="mode === 'calculator'" />
            </Transition>
            <Transition name="slide-up">
                <DrawPad v-if="mode === 'drawpad'" :saving="saving" @save="save" />
            </Transition>

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
    if (mode.value === "drawpad") {
        mode.value = "calculator"
    } else {
        mode.value = "drawpad"
    }
    console.log(mode.value)
}
</script>
<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
}

.slide-up-enter-from {
    transform: translateY(30px);
}

.slide-up-leave-to {
    transform: translateY(30px);
}
</style>