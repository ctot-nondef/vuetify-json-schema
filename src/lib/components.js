import { equals } from './object';

const tags = {
  h1: ['title'],
  p: ['description'],
  div: ['error', 'textgroup', 'inputswrapper', 'defaultGroup'],
  legend: ['legend'],
  fieldset: ['radiogroup', 'checkboxgroup'],
  form: ['form'],
  input: {
    typed: [
      'checkbox', 'color', 'date', 'datetime', 'datetime-local',
      'email', 'file', 'hidden', 'image', 'month', 'number',
      'password', 'radio', 'range', 'search', 'tel', 'text',
      'time', 'url', 'week',
    ],
  },
  textarea: ['textarea'],
  select: ['select'],
  option: ['option'],
  label: ['label'],
  button: [
    { component: 'button', option: { type: 'submit', label: 'Submit' } },
    { component: 'arraybutton', option: { type: 'button', label: 'Add' } },
  ],
};

export const option = { native: true };
export const components = {};

export const defineComponent = (tag, item) => {
  if (typeof item === 'object') {
    components[item.component] = {
      component: tag,
      option: { ...option, ...item.option },
    };
  } else {
    components[item] = {
      component: tag,
      option,
    };
  }
};

export function elementOptions(vm, el, extendingOptions = {}, field = { attrs: {} }, item = {}) {
  const attrName = el.option.native ? 'attrs' : 'props';
  const elProps = typeof el.option === 'function'
    ? { ...extendingOptions, ...el.option({ vm, field, item }) }
    : { ...el.option, native: undefined, ...extendingOptions };

  return {
    [attrName]: {
      ...el.defaultOption,
      ...elProps,
    },
  };
}

export function renderFieldset(createElement, { props, slots }) {
  const { inputswrapper } = components;
  const vm = {};

  const inputswrapperOptions = elementOptions(vm, inputswrapper);
  const children = [
    createElement(
      inputswrapper.component,
      inputswrapperOptions,
      slots().default,
    ),
  ];

  if (props.field.description) {
    const { legend } = components;
    const legendOptions = elementOptions(vm, legend);

    children.unshift(
      createElement(
        legend.component,
        legendOptions,
        props.field.description,
      ),
    );
  }

  return createElement('fieldset', {
    attrs: {
      name: props.field.attrs.name,
    },
  }, children);
}

export function init() {
  for (const tag in tags) {
    if (tags[tag] instanceof Array) {
      tags[tag].forEach((item) => defineComponent(tag, item));
    } else {
      tags[tag].typed.forEach((type) => {
        defineComponent(tag, { component: type, option: { type } });
      });
    }
  }

  components.radiogroup.render = renderFieldset;
  components.checkboxgroup.render = renderFieldset;
}

export function set(type, component, option = {}) {
  const defaultOption = components[type]
    ? { ...components[type].option }
    : {};

  delete defaultOption.native;

  components[type] = {
    type,
    component,
    option,
    defaultOption,
  };
}

export const groupedArrayTypes = [
  'radio', 'checkbox', 'input', 'textarea',
];

export function input({ vm, field, ref }) {
  const { attrs } = field;

  if (!attrs.hasOwnProperty('value')) {
    attrs.value = vm.data[attrs.name];
  }

  const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(attrs.type)
    ? components[`${attrs.type}group`] || components.defaultGroup
    : components[attrs.type] || components.text;

  const fieldOptions = elementOptions(vm, element, attrs, field);

  return {
    ref: ref || attrs.name,
    element,
    domProps: {},
    on: {
      input: (event) => {
        vm.data[attrs.name] = event && event.target
          ? event.target.value
          : event;

        /**
         * Fired synchronously when the value of an element is changed.
         */
        vm.$emit('input', vm.data);
      },
      change: vm.changed,
    },
    ...fieldOptions,
  };
}

export const fieldTypesAsNotArray = [
  'radio', 'textarea', 'select',
];

export const inputName = (field, index) => `${field.attrs.name}-${index}`;

export function initFields(vm) {
  vm.fields.forEach((field) => {
    const { attrs } = field;

    vm.data[attrs.name] = vm.value[attrs.name] || attrs.value;

    if (!fieldTypesAsNotArray.includes(attrs.type) && field.schemaType === 'array') {
      field.isArrayField = true;

      if (!Array.isArray(vm.data[attrs.name])) {
        vm.data[attrs.name] = [];
      }

      vm.data[attrs.name] = vm.data[attrs.name].filter((value, i) => {
        vm.inputValues[inputName(field, i)] = value;
        return value !== undefined;
      });

      field.itemsNum = attrs.type === 'checkbox'
        ? field.items.length
        : field.minItems;
    }
  });

  // vm.data = Object.seal(vm.data)

  if (!equals(vm.data, vm.value)) {
    /**
     * @private
     */
    vm.$emit('input', vm.data);
  }

  Object.keys(vm.data).forEach((key) => {
    vm.default[key] = typeof vm.data[key] === 'object' && vm.data[key] !== null
      ? Object.freeze(vm.data[key])
      : vm.data[key];
  });
}
