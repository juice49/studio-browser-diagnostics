import { GlobalStyleRule, globalStyle } from '@vanilla-extract/css'

export default function recipeGlobalStyle(
  recipeSelector: string,
  selector: string,
  rule: GlobalStyleRule,
): void {
  globalStyle(`${recipeSelector.split(' ')[1]} ${selector}`, rule)
}
