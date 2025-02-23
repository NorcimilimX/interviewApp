<template>
  <interview-dialog />
  <interview-progress v-if="isLoading"/>
  <interview-message v-else-if="!isLoading && !interviews.length" severity="info" class="w-full">
    <h3>There is no created interviews YET! Hurry up take your chance</h3>
  </interview-message>
  <div v-else>
    <h1>List of interviews</h1>

    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <interview-radio
          inputId="interviewResult1"
          name="result"
          value="Refusal"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="ml-2">Refuse</label>
      </div>
      <div class="flex align-items-center mr-2">
        <interview-radio
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="ml-2">Offer</label>
      </div>
      <interview-button class="form-btn mr-2" @click="submitFilter()" :disabled="!selectedFilterResult">Apply</interview-button>
      <interview-button class="form-btn" severity="danger" :disabled="!selectedFilterResult" @click="clearFilter()">Clear*</interview-button>
    </div>

    <interview-data-table :value="interviews" stripedRows showGridlines tableStyle="min-width: 50rem">
      <interview-columm field="company" header="Company"></interview-columm>
      <interview-columm field="hrName" header="Hr Name"></interview-columm>
      <interview-columm field="vacancyLink" header="Vacancy">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Vacancy link</a>
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
      <interview-columm header="Interview stages">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">
            <interview-badge
              severity="info"
              class="flex justify-content-center"
              value="Not defined"
              v-interview-tooltip="`There is any finished stage for now`"
            />
          </span>
          <div v-else class="interview-stages">
            <interview-badge
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              severity="info"
              class="flex gap-1"
              rounded
              v-interview-tooltip="stage.description"
            >
              <span>{{i+1}}</span>
              <span>{{stage.name}}</span>
            </interview-badge>
          </div>
        </template>
      </interview-columm>
      <interview-columm header="Salary range">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryTo">Not defined</span>
          <span v-else>{{ slotProps.data.salaryFrom + ' -- ' + slotProps.data.salaryTo + '$' }}</span>
        </template>
      </interview-columm>
      <interview-columm header="Interview Result">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result" class="flex justify-content-center">
            <interview-badge severity="warning" value="Pending"/>
          </span>
          <template v-else>
            <span class="flex justify-content-center">
              <interview-badge
                :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
                :value="slotProps.data.result === 'Offer' ? 'Offer' : 'Refuse'"
              />
            </span>
          </template>
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
  doc,
  where
} from 'firebase/firestore'

const db = getFirestore()
const userStore = useUserStore()
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const confirm = useConfirm()
const selectedFilterResult = ref<string>('')

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

      const listIntervies: Array<IInterview> = await getInterviews()
      interviews.value = [...listIntervies]

      isLoading.value = false
    },
  })
}

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getInterviews(true)
  interviews.value = listInterviews
  isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getInterviews()
  interviews.value = listInterviews
  selectedFilterResult.value = ''
  isLoading.value = false
}

const getInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )
  }

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getInterviews()

  interviews.value = listInterviews

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
  display: grid;
  gap: 5px;
  justify-content: center;
  justify-items: center;
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
