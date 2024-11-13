export const formatDate = (date: Date): string => {
  return date.toISOString()
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const createEndDate = (planType: string): string | undefined => {
  return planType !== 'unlimited' 
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : undefined
} 