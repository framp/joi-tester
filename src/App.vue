<template>
  <div id="editor">
    <codemirror :code="schema" :options="editorOptions" @changed="schemaUpdate"></codemirror>
    <codemirror :code="source" :options="editorOptions" @changed="sourceUpdate"></codemirror>
    <pre v-bind:class="{ hasError: output }" v-html="output"></pre>
  </div>
</template>

<script>
const debounce = require('lodash.debounce')
const Joi = require('joi')
const localStorage = window.localStorage || null

export default {
  name: 'editor',
  data: function() {
    return {
      schema: localStorage && localStorage.getItem('schema') || 
        '//Joi Tester\n' + 
        '\n' + 
        '//https://github.com/hapijs/joi\n' + 
        '//Insert here your Joi schema\n' +
        'Joi.object().keys({\n' +
        '  username: Joi.string().alphanum().min(3).max(30).required(),\n' +
        '  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),\n' +
        '  access_token: [Joi.string(), Joi.number()],\n' +
        '  birthyear: Joi.number().integer().min(1900).max(2013),\n' +
        '  email: Joi.string().email()\n' +
        '}).with(\'username\', \'birthyear\').without(\'password\', \'access_token\')',
      source: localStorage && localStorage.getItem('source') || 
        '//Insert here the object to validate\n' + 
        '{ username: \'abc\', birthyear: 1991 }',
      editorOptions: { 
        lineNumbers: true,
        theme: 'mbo',
        tabSize: 2, 
        mode: 'text/javascript'
      },
      output: ''
    }
  },
  computed: {
    output: function () {
      try {
        const result = eval(this.schema).validate(eval('(' + this.source + ')'))
        if (result.error) {
          return result.error.toString()
        }
        return ''
      } catch (error) {
        return error.stack
      }
    },
  },
  methods: {
    schemaUpdate: debounce(function (value) {
      this.schema = value
      localStorage && localStorage.setItem('schema', this.schema);
    }, 300),
    sourceUpdate: debounce(function (value) {
      this.source = value
      localStorage && localStorage.setItem('source', this.source);
    }, 300)
  }
}
</script>

<style>
html, body, #editor {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

#editor > div {
  width: 50%;
  height: 60%;
  float: left;
}

#editor > pre::before {
  content: '✓ The object is valid';
}
#editor > pre.hasError::before {
  content: '✕ ';
}
#editor > pre {
  height: 40%;
  padding: 20px;
  box-sizing: border-box;
  clear:both;
  background: #333;
  color: #7df481;
  font-size: 125%;
}
#editor > pre.hasError {
  color: #fe5c5c;
}
</style>
