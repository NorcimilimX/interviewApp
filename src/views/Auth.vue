<template>
  <interview-toast position="bottom-right"/>
  <div class="flex justify-content-center p-2">
    <div class="p-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-3">
        <h1 class="font-bold mb-3">Hello there</h1>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="text-600 font-medium ml-2 text-blue-500 cursor-pointer" @click="toggleAuth">
          {{linkAccountText}}
        </a>
      </div>

      <form @submit.prevent="submitForm" class="interview-form">
        <label for="email" class="block text-900 font-medium mb-2 text-left">Email</label>
        <interview-input-text v-model="email" id="email1" type="email" class="input w-full mb-3" placeholder="Type your email"/>

        <label for="password" class="block text-900 font-medium mb-2 text-left">Password</label>
        <interview-input-text v-model="password" id="password1" type="password" class="input w-full mb-3" placeholder="Type your password"/>

        <interview-button
          :label="submitButtonText"
          severity="secondary"
          type="submit"
          icon="pi pi-user"
          :loading="isLoading"
          class="form-btn"
        ></interview-button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()

const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const router = useRouter()

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Still don`t have an account?' : 'Already have an account'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Create an account then' : 'Login'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Enter' : 'Registration'
})

const signUp = async (): Promise<void> => {
  isLoading.value = true
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 10000 })
    }
  } finally {
    isLoading.value = false
  }
}

const signIn = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 10000 })
    }
  } finally {
    isLoading.value = false
  }
}

const submitForm = (): void => {
  if (isLogin.value) {
    signIn()
  } else {
    signUp()
  }
}
</script>

<style scoped>
.surface-card {
  background-color: var(--app-main-color);
  border-radius: 10px;
  text-align: center;
}
</style>
