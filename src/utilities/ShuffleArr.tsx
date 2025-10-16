import { ItemBubbleInfoType } from "../types/ShoppingCartContextTypes"

export function shuffleArray(array: ItemBubbleInfoType[]): ItemBubbleInfoType[] {
  const arr = [...array] // copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
