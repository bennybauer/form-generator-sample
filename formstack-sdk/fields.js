class BaseField {
  constructor(type, label, attributes = {}, options = {}) {
    this.field_type = type;
    this.label = label;
    this.attributes = attributes;
    this.options = options.labels;
    this.options_values = options.values;

    // default values
    this.hide_label = 0;
    this.description = '';
    this.description_callout = 0;
    this.default_value = '';
    this.required = 0;
    this.readonly = 0;
    this.hidden = 0;
    this.uniq = 0;
    this.colspan = 1;
    this.sort = 0;
    this.logic = null;
    this.calculation = '';
  }
}

class Section extends BaseField {
  constructor(heading, text = '', label_position = 'top') {
    const attributes = {
      heading,
      text,
      label_position,

      // default values
      break: 0,
      num_columns: 1
    };

    super('section', '', attributes);
  }
}

class Text extends BaseField {
  constructor(label, size = 50, placeholder = '') {
    const attributes = {
      placeholder,
      size,

      // default values
      maxlength: 0
    };

    super('text', label, attributes);
  }
}

class TextArea extends BaseField {
  constructor(label, rows = 10, placeholder = '') {
    const attributes = {
      placeholder,
      rows,

      // default values
      cols: 50,
      maxlength: 0
    };

    super('textarea', label, attributes);
  }
}

class RichText extends BaseField {
  constructor(label, text, text_editor = 'wysiwyg') {
    const attributes = {
      text,
      text_editor
    };

    super('richtext', label, attributes);
  }
}

class Checkbox extends BaseField {
  constructor(label, options, option_checkall = 0) {
    const attributes = {
      option_checkall,

      // default values
      option_rand: 0,
      option_store: 'value',
      option_show_values: 0,
      option_other: 0,
      option_layout: 'vertical'
    };

    super('checkbox', label, attributes, options);
  }
}

class FileUpload extends BaseField {
  constructor(label, types = undefined, size = 30) {
    const attributes = {
      // default values
      size
    };

    // don't overwrite types default unless provided
    if (types)
      attributes.types = types;

    super('file', label, attributes);
  }
}

class Select extends BaseField {
  constructor(label, options, option_size = 1) {
    const attributes = {
      option_size
    };

    super('select', label, attributes, options);
  }
}

module.exports = {
  Checkbox,
  FileUpload,
  RichText,
  Section,
  Select,
  Text,
  TextArea,
}

