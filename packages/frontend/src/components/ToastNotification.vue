<template>
  <div class="fixed bottom-0 left-0 w-full h-0 flex items-end justify-center z-50">
    <div
      class="w-full p-4 bg-gray-800 shadow-2xl flex flex-col items-center border-t border-gray-900
        sm:w-auto sm:m-4 sm:rounded sm:flex-row sm:border"
    >
      <div>
        <slot />
      </div>

      <div
        v-if="$slots.actions"
        class="flex mt-2 sm:mt-0 sm:ml-4"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
