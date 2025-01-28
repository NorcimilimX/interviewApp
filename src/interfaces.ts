export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactLinkedin?: string
  contactPhone?: string
  createdAt: Date
  stages?: IStage
  result: 'Refuse' | 'Offer'
}

export interface IStage {
  name: string
  date: string
  description: string
}
