import { Attendance, AppUser } from '@/lib/auth-types'

// Extended attendance with user info
export type AttendanceWithUser = Attendance & { user?: AppUser }

// Monthly stats per user
export interface MonthlyStats {
  [userId: string]: {
    overtime: number
    late: number
    lateDays: number
  }
}

// Weekly trend data
export interface WeeklyTrendItem {
  day: string
  hours: number
}

// Pending check-in state
export interface PendingCheckIn {
  now: Date
  location: { lat: number; lng: number } | null
  lateMinutes: number
}

// Pending check-out state
export interface PendingCheckOut {
  now: Date
  location: { lat: number; lng: number } | null
  overtimeMinutes: number
  earlyLeaveMinutes: number
}

// User with stats for leaderboard
export interface UserWithStats extends AppUser {
  overtime: number
  lateDays: number
}
