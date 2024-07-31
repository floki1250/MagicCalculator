<template>
  <div
    class=" blur-blob absolute top-52 left-1/3 md:top-20 md:left-50 lg:top-20 lg:left-1/3 bg-gradient-to-r from-[#FF0F7B]  to-[#F89B29]   w-60 h-60 md:w-80 md:h-80 sm:w-60 sm:h-60 lg:w-[30rem] lg:h-[30rem]">
  </div>
  <div>
    <NuxtLoadingIndicator />


    <NuxtLayout>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<style scoped>
.blur-blob {
  filter: blur(40px);
  transition-duration: 2s;
  transition-timing-function: cubic-bezier(.075, .82, .165, 1);
  border-radius: 9999px;
  z-index: -10;

}
</style>
