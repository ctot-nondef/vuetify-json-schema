<template>
  <div id="app">
    <formschema :schema="schema"/>
  </div>
</template>

<script>
import formschema from './components/FormSchema';
import actor from './actor.json';


formschema.setComponent('form', 'v-form', ({ vm }) => {
  const model = vm.data;
  const rules = {};

  // vm is the FormSchema VM
  console.log('vm', vm);
  vm.fields.forEach((field) => {
    console.log(field);
    const type = field.schemaType === 'array' && field.type === 'radio'
      ? 'string'
      : field.schemaType;
    const { required } = field;
    const message = field.title;
    const trigger = ['radio', 'checkbox', 'select'].includes(field.type)
      ? 'change' : 'blur';

    // http://element.eleme.io/#/en-US/component/form#validation
    rules[field.name] = { type, required, message, trigger };
  });
  console.log(rules, model);
});


formschema.setComponent('text', 'v-text-field', ({ field }) => ({
  label: field.name,
}));

export default {
  name: 'App',
  data() {
    return {
      schema: actor,
      model: {},
    };
  },
  components: {
    formschema,
  },
  created() {

  },
};
</script>

<style lang="scss">
  #app {
    padding: 16px;
    max-width: 1400px;
    margin: auto;
  }

  .flex {
    display: flex;
  }

  .row {
    max-height: 300px;
  }

  div > .base-box-button {
    margin: 8px;
  }

  button {
    display:block;
  }

  .popup-text {
    display: flex;
    align-items: flex-end;
  }

  .form-field {
    background-color: white;
    padding: 16px;
    margin-bottom: 32px;
  }
</style>
