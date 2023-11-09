// import { css } from 'itches'
import { css, dynamic } from '../../macro'
// import {css as _css} from '../../runtime'


const withGenerics = css<{disabled: boolean}>({
  background: 'dodgerblue',
  width: 330 + 110,
  color: (props) => props.disabled ? 'red' : 'bluse',
  '> div': {
    background: (props) => props.disabled ? 'red' : 'bluse',
  }
})

const plain = css({
  background: 'red',
  '> div': {
    background: 'red'
  }
})

const adana = dynamic(withGenerics, {disabled: true})
console.log(adana)