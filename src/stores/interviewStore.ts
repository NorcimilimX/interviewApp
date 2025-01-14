import { defineStore } from 'pinia'

interface Interview {
  date: Date,
  hr: string,
  comments: string,
  position: string,
  salary: number,
  benefits: string,
  isThereInsurance: boolean,
  isFlexible: boolean,
  testExercisesRequired: boolean,
  interviewStages: number
}

interface InterviewState {
  interviews: Interview[]
}

export const useInterviewStore = defineStore('interviewStore', {
  state: (): InterviewState => ({
    interviews: []
  }),
  actions: {
    addInterview(),
    updateInterview(updatedInterview: Interview) {
      const index = this.interviews.findIndex(interview => interview.id === updatedInterview.id)
      if (index !== -1)  this.interviews[index] = updatedInterview
    },
    deleteInterview(interviewId: number) {

    }
  }
})
