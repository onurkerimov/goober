import { hash } from './core/hash';
import { compile } from './core/compile';
import { getSheet } from './core/get-sheet';

const map = {}

/**
 * css entry
 * @param {String|Object|Function} val
 */
function css(val) {
    let ctx = this || {};
    let _val = val.call ? val(ctx.p) : val;
    return hash(
        _val.unshift
            ? _val.raw
                ? // Tagged templates
                  compile(_val, [].slice.call(arguments, 1), ctx.p)
                : // Regular arrays
                  _val.reduce((o, i) => Object.assign(o, i && i.call ? i(ctx.p) : i), {})
            : _val,
        getSheet(ctx.target),
        ctx.g,
        ctx.o,
        ctx.k
    );
}

/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
let injectGlobal = css.bind({ g: 1 });

/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
let keyframes = css.bind({ k: 1 });

/**
 * `dynamic` function for getting CSSProperties for dynamic clases
 * @type {Function}
 */
let dynamic = (c, props) => {
    const v = {}
    Object.keys(map[c]).forEach((key) => {
      const item = map[c][key]
      v[key] = typeof item === 'function' ? item(props) : item
    })
    return v
}

export { css, injectGlobal, keyframes, dynamic };
