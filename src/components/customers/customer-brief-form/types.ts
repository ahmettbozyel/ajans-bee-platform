// Brief form types - extracted from customer-brief-form.tsx

export interface AIResearchState {
  isLoading: boolean
  progress: number
  status: 'idle' | 'researching' | 'analyzing' | 'completing' | 'done' | 'error'
  error: string | null
  filledFields: string[]
}
