let lockCount = 0

export function lockScroll() {
  if (typeof document === 'undefined') return
  if (lockCount === 0) {
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

export function unlockScroll() {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = ''
  }
}
