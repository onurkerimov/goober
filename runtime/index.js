import { getSheet } from "../src/core/get-sheet"

const sheet = getSheet()

export const css = (c, obj) => {
  // If the user tries to execute `css` with the same className, it's likely that it's being used
  // inside a component's render cycle, and `obj` is received with new values each time. 
  // This is kinda an anomaly, but supported anyways. In this scenario, at the first run, we return
  // the base class only, and add the base variables to the styleset, however in the consecutive runs,
  // we return a new class next to it.
  if(map[c]) {
    console.warn('Dynamic css inside the render cycle without the `dynamic` helper detected.')
    return c
  } 
  map[c] = obj
  // running `dynamic` here without the second argument here, will set only the non-function variables.
  const inside = Object.keys(dynamicInner(obj)).map((key) => `${key}: ${obj[key]}`).join(';')
  sheet.data = sheet.data + `.${c} {${inside}}`
  return c
}

const map = {}

export function dynamic(c, props) {
  const obj = map[c]
  return dynamicInner(obj, props)
}

function dynamicInner(obj, props) {
  const v = {}
  Object.keys(obj).forEach((key) => {
    const item = obj[key]
    if (typeof item === 'function') {
      if (props) v[key] = item(props)
    } else {
      v[key] = item
    }
  })
  return v
}
