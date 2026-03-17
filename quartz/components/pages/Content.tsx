import { ComponentChildren } from "preact"
import { useEffect } from "preact/hooks"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

// Type declarations for Screen Wake Lock API
declare global {
  interface Navigator {
    wakeLock?: {
      request(type: 'screen'): Promise<WakeLockSentinel>
    }
  }
}

interface WakeLockSentinel {
  release(): Promise<void>
}

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null

    // Check if this is a recipe page or recipe book page
    const isRecipePage = fileData.slug?.startsWith("Recepten/")
    const isRecipeBookPage = fileData.slug?.startsWith("Receptenboeken/")

    const requestWakeLock = async () => {
      if ((isRecipePage || isRecipeBookPage) && 'wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen')
          console.log('Screen wake lock activated for recipe/recipe book page')
        } catch (err) {
          console.log('Failed to activate screen wake lock:', err)
        }
      }
    }

    requestWakeLock()

    // Re-request wake lock when visibility changes (e.g., tab becomes active again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (wakeLock) {
        wakeLock.release()
        console.log('Screen wake lock released')
      }
    }
  }, [fileData.slug])

  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
