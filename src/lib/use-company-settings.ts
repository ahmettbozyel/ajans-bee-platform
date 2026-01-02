'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface WorkHours {
  start: string
  end: string
  lunch_start: string
  lunch_end: string
}

export interface Tolerances {
  late_minutes: number
  early_leave_minutes: number
  grace_period_minutes: number
}

export interface Holiday {
  id: string
  name: string
  date: string
  is_recurring: boolean
  description: string | null
}

export interface HybridOverride {
  id: string
  date: string
  is_hybrid: boolean
  note: string | null
}

export interface CompanySettings {
  workDays: string[]
  workHours: WorkHours
  tolerances: Tolerances
  holidays: Holiday[]
  hybridDays: string[]
  hybridOverrides: HybridOverride[]
  loading: boolean
  refetch: () => Promise<void>
}

// Default values
const DEFAULT_WORK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const DEFAULT_WORK_HOURS: WorkHours = {
  start: '09:00',
  end: '18:00',
  lunch_start: '12:00',
  lunch_end: '13:00'
}
const DEFAULT_TOLERANCES: Tolerances = {
  late_minutes: 15,
  early_leave_minutes: 15,
  grace_period_minutes: 5
}

export function useCompanySettings(): CompanySettings {
  const [workDays, setWorkDays] = useState<string[]>(DEFAULT_WORK_DAYS)
  const [workHours, setWorkHours] = useState<WorkHours>(DEFAULT_WORK_HOURS)
  const [tolerances, setTolerances] = useState<Tolerances>(DEFAULT_TOLERANCES)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [hybridDays, setHybridDays] = useState<string[]>(['wednesday'])
  const [hybridOverrides, setHybridOverrides] = useState<HybridOverride[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all settings in parallel
      const [daysRes, hoursRes, tolerancesRes, holidaysRes, hybridDaysRes, hybridOverridesRes] = await Promise.all([
        (supabase as any).from('company_settings').select('value').eq('key', 'work_days').single(),
        (supabase as any).from('company_settings').select('value').eq('key', 'work_hours').single(),
        (supabase as any).from('company_settings').select('value').eq('key', 'tolerances').single(),
        (supabase as any).from('holidays').select('*').order('date', { ascending: true }),
        (supabase as any).from('company_settings').select('value').eq('key', 'hybrid_days').single(),
        (supabase as any).from('hybrid_overrides').select('*').order('date', { ascending: false })
      ])

      if (daysRes.data?.value) {
        setWorkDays(daysRes.data.value)
      }
      if (hoursRes.data?.value) {
        setWorkHours(hoursRes.data.value)
      }
      if (tolerancesRes.data?.value) {
        setTolerances(tolerancesRes.data.value)
      }
      if (holidaysRes.data) {
        setHolidays(holidaysRes.data)
      }
      if (hybridDaysRes.data?.value) {
        setHybridDays(hybridDaysRes.data.value)
      }
      if (hybridOverridesRes.data) {
        setHybridOverrides(hybridOverridesRes.data)
      }
    } catch (error) {
      console.error('Error fetching company settings:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    workDays,
    workHours,
    tolerances,
    holidays,
    hybridDays,
    hybridOverrides,
    loading,
    refetch: fetchSettings
  }
}

// Helper functions that use dynamic settings
export function isWorkDay(date: Date, workDays: string[]): boolean {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return workDays.includes(dayNames[date.getDay()])
}

export function isHoliday(date: Date, holidays: Holiday[]): Holiday | null {
  // Local date string (not UTC) to handle timezone correctly
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  for (const holiday of holidays) {
    // Exact date match
    if (holiday.date === dateStr) {
      return holiday
    }

    // Recurring holiday (same month and day, any year)
    if (holiday.is_recurring) {
      const [, holidayMonth, holidayDay] = holiday.date.split('-')
      const recurringDateStr = `${year}-${holidayMonth}-${holidayDay}`
      if (recurringDateStr === dateStr) {
        return holiday
      }
    }
  }

  return null
}

// Check if a date is a hybrid day (with override support)
export function isHybridDayWithSettings(
  date: Date,
  hybridDays: string[],
  hybridOverrides: HybridOverride[]
): boolean {
  // Local date string
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  // First check if there's an override for this date
  const override = hybridOverrides.find(o => o.date === dateStr)
  if (override) {
    return override.is_hybrid
  }

  // Otherwise, check if it's one of the default hybrid days
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return hybridDays.includes(dayNames[date.getDay()])
}

export function calculateLateMinutesWithSettings(
  checkInTime: Date,
  workHours: WorkHours,
  tolerances: Tolerances
): number {
  const [startHour, startMinute] = workHours.start.split(':').map(Number)
  const workStart = new Date(checkInTime)
  workStart.setHours(startHour, startMinute, 0, 0)

  const diffMinutes = Math.floor((checkInTime.getTime() - workStart.getTime()) / 60000)
  const totalTolerance = tolerances.late_minutes + tolerances.grace_period_minutes

  return diffMinutes <= totalTolerance ? 0 : Math.max(0, diffMinutes)
}

export function calculateOvertimeMinutesWithSettings(
  checkOutTime: Date,
  workHours: WorkHours
): number {
  const [endHour, endMinute] = workHours.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)

  return Math.max(0, Math.floor((checkOutTime.getTime() - workEnd.getTime()) / 60000))
}

export function calculateEarlyLeaveMinutesWithSettings(
  checkOutTime: Date,
  workHours: WorkHours,
  tolerances: Tolerances
): number {
  const [endHour, endMinute] = workHours.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)

  const diffMinutes = Math.floor((workEnd.getTime() - checkOutTime.getTime()) / 60000)
  const totalTolerance = tolerances.early_leave_minutes + tolerances.grace_period_minutes

  return diffMinutes <= totalTolerance ? 0 : Math.max(0, diffMinutes)
}
