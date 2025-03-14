"use client"

// Simple toast implementation for demo purposes
export function toast(options: {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}) {
  console.log(`Toast: ${options.variant || "default"} - ${options.title} - ${options.description || ""}`)

  // In a real app, this would add the toast to a global store
  // For now, we just log to console
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...options,
  }
}

