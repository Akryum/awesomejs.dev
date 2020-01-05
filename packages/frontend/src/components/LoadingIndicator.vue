<template>
  <div class="flex items-center justify-center">
    <div class="animation">
      <i class="material-icons">cloud</i>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.animation {
  animation: fade-in .5s .3s backwards, loading 2s infinite ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes loading {
  0%, 100% {
    transform: scale(.7);
  }
  50% {
    transform: scale(1);
  }
}
</style>
