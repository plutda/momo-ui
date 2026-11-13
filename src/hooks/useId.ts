let seed = 0

export function useId(prefix = 'momo'): string {
  seed += 1
  return `${prefix}-${seed}`
}
