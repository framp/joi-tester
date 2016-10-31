<template>
  <div id="editor">
    <textarea :value="schema" @input="schemaUpdate"></textarea>
    <textarea :value="source" @input="sourceUpdate"></textarea>
    <pre v-html="output"></pre>
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
        'Joi.object().keys({\n' +
        '  username: Joi.string().alphanum().min(3).max(30).required(),\n' +
        '  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),\n' +
        '  access_token: [Joi.string(), Joi.number()],\n' +
        '  birthyear: Joi.number().integer().min(1900).max(2013),\n' +
        '  email: Joi.string().email()\n' +
        '}).with(\'username\', \'birthyear\').without(\'password\', \'access_token\')',
      source: localStorage && localStorage.getItem('source') || 
        '{ username: \'abc\', birthyear: 1991 }'
    }
  },
  computed: {
    output: function () {
      try {
        const result = eval(this.schema).validate(eval('(' + this.source + ')'))
        if (result.error) {
          return result.error.toString()
        }
        return 'VALID'
      } catch (error) {
        return error.message + '\n' + error.stack
      }
    }
  },
  methods: {
    schemaUpdate: debounce(function (e) {
      this.schema = e.target.value
      localStorage && localStorage.setItem('schema', this.schema);
    }, 300),
    sourceUpdate: debounce(function (e) {
      this.source = e.target.value
      localStorage && localStorage.setItem('source', this.source);
    }, 300)
  }
}
</script>

<style>
html, body, #editor {
  margin: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

textarea, #editor pre {
  display: inline-block;
  width: 49%;
  height: 70%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

#editor pre {
  width: 100%;
  height: 30%;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>
