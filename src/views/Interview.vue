<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore'
import type { IInterview, IStage } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(true)
const interview = ref<IInterview>()

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }

  isLoading.value = false
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
    .then(() => {
      router.push('/list')
    })
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

onMounted(async () => await getData())
</script>

<template>
  <interview-progress v-if="isLoading" />
  <div class="content-interview" v-else-if="interview?.id && !isLoading">
    <interview-card>
      <template #title>Interview with company {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Company</label>
          <interview-input-text class="input mb-3" id="company" v-model="interview.company" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Vacancy description (link)</label>
          <interview-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Name</label>
          <interview-input-text class="input mb-3" id="hrName" v-model="interview.hrName" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram username HR</label>
          <interview-input-text
            class="input mb-3"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactLinkedin">Linkedin HR</label>
          <interview-input-text
            class="input mb-3"
            id="contactLinkedin"
            v-model="interview.contactLinkedin"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Mobile HR</label>
          <interview-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone" />
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <interview-input-number
              inputId="salaryFrom"
              placeholder="Salary from ($usd)"
              v-model="interview.salaryFrom"
            />
          </div>
          <div class="flex-auto">
            <interview-input-number
              inputId="salaryTo"
              placeholder="Salary to ($usd)"
              v-model="interview.salaryTo"
            />
          </div>
        </div>

        <interview-button
          label="Add stage"
          severity="info"
          icon="pi pi-plus"
          class="form-btn mb-3"
          @click="addStage"
        />
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Interview stage</label>
              <interview-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Date interview of stage</label>
              <interview-calendar
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Comments</label>
              <interview-textarea
                :id="`stage-description-${index}`"
                class="input mb-3"
                rows="5"
                v-model="stage.description"
              />
            </div>
            <interview-button severity="danger" class="form-btn" label="Remove stage" @click="removeStage(index)" />
          </div>
        </template>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <interview-radio
              inputId="interviewResult1"
              name="result"
              value="Refuse"
              v-model="interview.result"
            />
            <label for="interviewResult1" class="ml-2">Refuse</label>
          </div>
          <div class="flex align-items-center">
            <interview-radio
              inputId="interviewResult2"
              name="result"
              value="Offer"
              v-model="interview.result"
            />
            <label for="interviewResult2" class="ml-2">Offer</label>
          </div>
        </div>
        <interview-button label="Save" class="form-btn" icon="pi pi-save" severity="primary" @click="saveInterview" />
      </template>
    </interview-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
