<template>
  <div id="app">
    <formschema />
  </div>
</template>

<script>
import FormSchema from './components/FormSchema';

export default {
  name: 'App',
  components: {
    FormSchema,
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
