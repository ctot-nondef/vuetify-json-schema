<template>
  <div id="app">
    <formschema :schema="schema"/>
  </div>
</template>

<script>
import formschema from './components/FormSchema';
import actor from './actor.json';

export default {
  name: 'App',
  data() {
    return {
      schema: actor,
    };
  },
  components: {
    formschema,
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
