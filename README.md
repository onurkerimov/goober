# itches

**itches** is an **opt-in zero runtime** CSS-in-JS library. The name is an ode to [Stitches](https://github.com/stitchesjs/stitches/). 

<center>

✨ **AWESOME NEWS: this library figures out a neat API for dynamic variables!** ✨

</center>


- With no configuration, it ships a very **lightweight runtime** (2.2 kB)
- When the `itches/macro` is used, it's **zero runtime**. (Just a 0.2kB dynamic variable runtime)

> This library wouldn't be possible without [goober](https://github.com/cristianbote/goober) and [css-zero](https://github.com/CraigCav/css-zero). 
> It started off as [a slightly modified version of **goober**](https://github.com/onurkerimov/goober/pull/1), and the Babel macro implementation borrows a lot of code from **css-zero**.
> Thanks to CraigCav for **css-zero**, and thanks to cristianbote and other contributors for **goober**.

- Aims to provide a similar API to **@emotion/css** with `css`, `keyframes`, `injectGlobal`.
- It supports both template literals and CSS objects, and nested CSS.
- ✨✨ It has an export called `dynamic` and it's used to satisfy dynamic variables, and its the most unique thing about this library. ✨✨
- In summary, the API is basically the same as **goober**, but:
  - It doesn't have `styled` and `setup` exports
  - It does vendor prefixing by defult
  - It uses **@emotion/hash** to generate class names, prefixed with `i-`
  - To be more similar to Emotion, `glob` is renamed to `injectGlobal`
  - ✨✨✨ There's `dynamic`! ✨✨✨


## Usage

Plain behavior and zero-runtime behavior are identical. The only thing that changes is the performance, and you'll get more beautiful classnames.

> Hold on until you see ✨✨✨✨`dynamic`✨✨✨✨!

```js
import { css } from 'itches'

const foo = css({ width: 45 })

const bar = css<{ disabled: boolean }>({
  display: 'flex',
  flexDirection: 'column',
  color: (props) => props.disabled ? 'gray' : 'black',
})
```

## Usage (zero runtime)

With the macro, the above code transpiles to:
```js
import { __css } from 'itches/runtime'

const foo = `i0-foo`;
const bar = __css('i2-bar', {
  '--i3-color': (props) => props.disabled ? 'gray' : 'black'
})
```

It serializes to the following CSS:

```css
.i0-foo{
  width: 45px;
}
.i2-bar{
  display: flex;
  -webkit-flex-direction:column;
  color: var(--i3-color);
}
```

## ✨✨✨✨✨ `dynamic` ✨✨✨✨✨

Finally, it's time. From the previous example, `bar` is a static className string, but at the same time one of its style rules relies on the `--i3-color` variable. Remember, as the developer, we're not really aware that the variable's name is "--i3-color". It's just an internal detail, or at most, a browser CSS debugger detail. `dynamic` lets you seamlessly satisfy whatever variable **itches** automagically generates. 

```js
import { dynamic } from 'itches'

// inside a component
<div className={bar} style={dynamic(bar, props)} />
```
This doesn't need to transpile into anything, and it does not. The classname `bar` functions as a map key to a very small JavaScript runtime that's in charge of `dynamic`. The usage is equivalent to:

```js
<div className="i2-bar" style={{ '--i3-color': props.disabled ? 'gray' : 'black' }} />
```

Also, while the `bar` is just a string, it's TypeScript types show up as `string & Dynamic<Props>`, so we can have perfect type safety while using `dynamic`.

That's all!