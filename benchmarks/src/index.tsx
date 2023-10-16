// import { css } from 'itches'
import { css } from '../../macro'


const withGenerics = css<{disabled: boolean}>({
  background: 'dodgerblue',
  width: 330,
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

console.log(withGenerics)