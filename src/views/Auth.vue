<template>
  <app-toast position="bottom-right"/>
  <div class="flex justify-content-center p-2">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Hello there</div>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="text-600 font-medium ml-2 text-blue-500 cursor-pointer" @click="toggleAuth">
          {{linkAccountText}}
        </a>
      </div>

      <form @subm.prevent="submitForm">
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <app-inputext v-model="email" id="email" type="email" class="w-full mb-3"/>

        <app-button
        :label="submitButtonText"
        type="submit"
        icon="pi pi-user"
        :loading="isLoading"
        class="w-full"
        ></app-button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue'

const isLogin = ref<boolean>(true)

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Still don`t have an account?' : 'Already have an account'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Create an account then' : 'Login'
})
</script>
