import Hello from './Hello.vue'
const hello = {
  install: (Vue) => {
    return Vue.component('hello', Hello)
  }
}
export default hello
