<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const router = useRouter()
const company = ref<string>('')
const vacancyLink = ref('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactLinkedin = ref<string>('')
const contactPhone = ref<string>('')

const loading = ref<boolean>(false)

const addNewInterview = async (): Promise<void> => {
  loading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactLinkedin: contactLinkedin.value,
    contactPhone: contactPhone.value,
    createdAt: new Date()
  }

  if (userStore.userId) {
    await setDoc(doc(getFirestore(), `users/${userStore.userId}/interviews`, payload.id), payload)
      .then(() => {
        router.push('/list')
      })
  }
}

const disabledSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})

const disabledClearButton = computed<boolean>(() => {
  return (
    company.value ||
    vacancyLink.value ||
    hrName.value ||
    contactTelegram.value ||
    contactLinkedin.value ||
    contactPhone.value
  ) === ''
})

const clearInterviewForm = () => {
  company.value = ''
  vacancyLink.value = ''
  hrName.value = ''
  contactTelegram.value = ''
  contactLinkedin.value = ''
  contactPhone.value = ''
}
</script>

<template>
  <div class="interview-form">
    <interview-card>
      <template #title>
        <h3>Create new interview session</h3>
      </template>
      <template #content>
        <interview-input-text class="input mb-3" placeholder="Company" v-model="company" />
        <interview-input-text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Link to vacancy"
        />
        <interview-input-text v-model="hrName" class="input mb-3" placeholder="Contact (name)" />
        <interview-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <interview-input-text
          v-model="contactLinkedin"
          class="input mb-3"
          placeholder="LinkedIn account HR"
        />
        <interview-input-text v-model="contactPhone" class="input mb-3" placeholder="Phone HR" />
        <interview-button
          @click="addNewInterview"
          severity="secondary"
          label="Create"
          :disabled="disabledSaveButton"
          :loading="loading"
          class="form-btn"
        />
        <interview-button
          @click="clearInterviewForm"
          severity="danger"
          label="Clear*"
          :disabled="disabledClearButton"
          :loading="loading"
          class="form-btn ml-2"
        />
      </template>
    </interview-card>
  </div>
</template>
