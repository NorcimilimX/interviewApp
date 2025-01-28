<template>
  <interview-dialog />
  <interview-progress v-if="isLoading"/>
  <interview-message v-else-if="!isLoading && !interviews.length" severity="info" class="w-full">
    <h3>There is no created interviews YET! Hurry up take your chance</h3>
  </interview-message>
  <div v-else>
    <h1>List of interviews</h1>
    <interview-data-table :value="interviews" stripedRows showGridlines tableStyle="min-width: 50rem">
      <interview-columm field="company" header="Company"></interview-columm>
      <interview-columm field="hrName" header="Hr Name"></interview-columm>
      <interview-columm field="vacancyLink" header="Vacancy">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
      </interview-columm>
      <interview-columm header="Contacts">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>

            <a
              v-if="slotProps.data.contactLinkedin"
              :href="slotProps.data.contactLinkedin"
              target="_blank"
              class="contacts__linkedin"
            >
              <span class="contacts__icon pi pi-linkedin"></span>
            </a>

            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </interview-columm>
      <interview-columm header="Actions">
        <template #body="slotProps">
          <div class="flex justify-content-center gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <interview-button class="actions-btn flex justify-content-center" severity="warning">
                <div class="pi pi-pencil"></div>
                <p>Edit</p>
              </interview-button>
            </router-link>
            <interview-button class="actions-btn flex justify-content-center" severity="danger" @click="deleteInterviewRecord(slotProps.data.id)">
              <div class="pi pi-trash"></div>
              <p>Delete</p>
            </interview-button>
          </div>
        </template>
      </interview-columm>
    </interview-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { IInterview} from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'

const db = getFirestore()
const userStore = useUserStore()
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const confirm = useConfirm()

const deleteInterviewRecord = async (id: string): Promise<void> => {
  confirm.require({
    message: `Are you sure you want to delete this ${id} interview record?`,
    header: 'Interview record deletion',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))

      await loadInterviews()
      isLoading.value = false
    },
  })
}

const getInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(collection(db, `users/${userStore.userId}/interviews`), orderBy('createdAt', 'desc'))

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const loadInterviews = async () => {
  const listInterviews: Array<IInterview> = await getInterviews()
  interviews.value = [...listInterviews]
}

onMounted( () => {
  loadInterviews()
  isLoading.value = false
})
</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__linkedin {
  color: #3f71da;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 25px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
.actions-btn {
  border-radius: 10px;
  gap: 5px;
  min-width: 100px;
  height: 40px;
}

a {
  text-decoration: none;
}
</style>
