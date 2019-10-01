<template>
  <div class="flex items-center justify-center">
    <div class="animation">
      <i class="material-icons">cloud</i>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.animation {
  animation: loading 2s infinite ease-in-out;
}

@keyframes loading {
  0%, 100% {
    transform: scale(.8);
    opacity: .7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
