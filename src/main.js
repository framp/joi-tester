const Vue = require('vue') 
const CodeMirror = require('vue-codemirror')
const App = require('./App.vue')

Vue.use(CodeMirror)

new Vue({
  el: '#app',
  render: h => h(App)
})
