/* eslint-disable no-labels */

const ARRAY_KEYWORDS = ['anyOf', 'oneOf', 'enum'];

export function setCommonFields (schema, field) {
  field.attrs.value = field.attrs.hasOwnProperty('value')
    ? field.attrs.value
    : schema.default || '';

  field.schemaType = schema.type;
  field.label = schema.title || '';
  field.description = schema.description || '';
  field.attrs.required = schema.required || false;
  field.attrs.disabled = schema.disabled || false;
}

export function parseString(schema, name = null) {
  const field = {
    attrs: schema.attrs || {},
  };

  if (schema.pattern) {
    field.attrs.pattern = schema.pattern;
  }

  if (schema.format) {
    switch (schema.format) {
      case 'email':
        if (!field.attrs.type) {
          field.attrs.type = 'email';
        }
        break;

      case 'uri':
        if (!field.attrs.type) {
          field.attrs.type = 'url';
        }
        break;
    }
  }

  if (!field.attrs.type) {
    switch (schema.type) {
      case 'number':
      case 'integer':
        field.attrs.type = 'number';
        break;
      default:
        field.attrs.type = 'text';
    }
  }

  setCommonFields(schema, field);

  if (name) {
    field.attrs.name = name;
  }

  if (schema.minLength) {
    field.attrs.minlength = schema.minLength;
  }

  if (schema.maxLength) {
    field.attrs.maxlength = schema.maxLength;
  }

  return field;
}

export function parseBoolean(schema, name = null) {
  const field = {
    attrs: schema.attrs || {},
  };

  setCommonFields(schema, field);

  if (!field.attrs.type) {
    field.attrs.type = 'checkbox';
  }

  field.attrs.checked = schema.checked || false;

  if (name) {
    field.attrs.name = name;
  }

  return field;
}

export function parseItems(items) {
  return items.map((item) => {
    if (typeof item !== 'object') {
      return { value: item, label: item };
    }

    return item;
  });
}

export const setItemName = (name) => (item) => {
  const nitem = item;
  if (!nitem.name) {
    nitem.name = name ? `${name}-` : '';
    nitem.name += item.label.replace(/\s+/g, '-');
  }

  return nitem;
};

export function arrayValues(field) {
  return field.items.map((item) => item.checked ? item.value : undefined);
}

export function singleValue(field) {
  const item = field.items.reverse().find((nitem) => nitem.checked || nitem.selected);

  return item ? item.value : '';
}

export function parseArray(schema, name = null) {
  const field = {
    attrs: schema.attrs || {},
  };

  setCommonFields(schema, field);

  if (name) {
    field.attrs.name = name;
  }

  field.items = [];
  field.minItems = parseInt(schema.minItems, 10) || 1;
  field.maxItems = parseInt(schema.maxItems, 10) || 1000;

  loop:
  for (const keyword of ARRAY_KEYWORDS) {
    if (schema.hasOwnProperty(keyword)) {
      switch (keyword) {
        case 'enum':
          if (!field.attrs.type) {
            field.attrs.type = 'select';
          }

          field.items = parseItems(schema[keyword]);
          break loop;

        case 'oneOf':
          field.attrs.type = 'radio';
          field.attrs.value = field.attrs.value || '';
          field.items = parseItems(schema[keyword]).map(setItemName(name));

          if (field.attrs.value.length === 0) {
            field.attrs.value = singleValue(field);
          }
          break loop;

        case 'anyOf':
          field.attrs.type = 'checkbox';
          field.attrs.value = field.attrs.value || [];
          field.items = parseItems(schema[keyword]).map(setItemName(name));

          if (field.attrs.value.length === 0) {
            field.attrs.value = arrayValues(field);
          }
          break loop;
      }
    }
  }

  if (!field.attrs.type) {
    field.attrs.type = 'text';
  } else if (field.attrs.type === 'select') {
    field.attrs.multiple = field.minItems > 1;
    field.attrs.value = field.attrs.value || field.attrs.multiple ? [] : '';

    if (field.attrs.value.length === 0) {
      field.attrs.value = field.attrs.multiple
        ? arrayValues(field)
        : singleValue(field);
    }
  }

  return field;
}

export function loadFields(pschema, fields, name = null) {
  let schema = {};
  if (!pschema || schema.visible === false) {
    return;
  }
  schema = pschema;
  switch (schema.type) {
    case 'object':
      for (const key in schema.properties) {
        if (schema.required) {
          for (const field of schema.required) {
            schema.properties[field].required = true;
          }
        }

        loadFields(schema.properties[key], fields, key);
      }
      break;

    case 'boolean':
      fields.push(parseBoolean(schema, name));
      break;

    case 'array':
      fields.push(parseArray(schema, name));
      break;

    case 'integer':
    case 'number':
    case 'string':
      for (const keyword of ARRAY_KEYWORDS) {
        if (schema.hasOwnProperty(keyword)) {
          schema.items = {
            type: schema.type,
            enum: schema[keyword],
          };
          fields.push(parseArray(schema, name));

          return;
        }
      }
      fields.push(parseString(schema, name));
      break;
  }
}
