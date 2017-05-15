const Fields = require('./formstack-sdk/fields');

class ImageField extends Fields.RichText {
  constructor(label, url) {
    super('', `<h3>${label}</h3><p><br></p><p><img src=${url}></p>`);
  }
}

class DescriptionField extends Fields.RichText {
  constructor(description) {
    super('', `<h3>Description:</h3>${description}`);
  }
}

module.exports = {
  DescriptionField,
  ImageField
}
