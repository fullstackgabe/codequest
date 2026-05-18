import type { Module } from './module'

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  docUrl?: string
  modules: Module[]
}
