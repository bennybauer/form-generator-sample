require('dotenv').config();
const open = require('open');
const FsAPI = require('./formstack-sdk/formStack');
const Fields = require('./formstack-sdk/fields');
const CustomFields = require('./CustomFields');

const fsa = new FsAPI(process.env.FS_ACCESS_TOKEN);

function getAllForms() {
  return fsa.getForms()
    .then(data => {
      return data;
    })
    .catch(err => console.error(err));
}

function getFieldsByFormName(name) {
  return getAllForms()
    .then(data => {
      const result = data.forms.find(form => {
        return form.name === name;
      });

      return fsa.getFormFields(result.id);
    })
    .catch(err => console.error(err));
}

//////////////////// Wescover Form ////////////////////
function createForm() {
  return createInitialForm()
    .then(form => {
      this.form = form;
      applySectionDependencies(form)
    })
    .then(() => {
      return this.form;
    })
    .catch(err => console.error(err));
}

function createInitialForm() {
  // static data
  const menuOptionLabels = ['Details'];
  const detailsSection = new Fields.Section('My details');
  const fileUpload = new Fields.FileUpload('Upload a new logo image', 'jpg,jpeg,gif,png,bmp,tif');
  fileUpload.description = 'Please use high quality images';

  // dynamic data
  const name = 'John'
  const logoUrl = 'https://s3.amazonaws.com/files.formstack.com/public/721318/image_ipojtrpfwid6hfhladrj.jpg';

  let fields = [
    // menu section
    new Fields.Section('Review'),
    new Fields.RichText('', `<h2>Hi ${name}!</h2><p><br></p><p style="text-align: center;"><img src=${logoUrl}></p><p><br></p><p>Use this form to update your details and/or items.</p><p><br></p>`),
    new Fields.Checkbox(`I'd like to update my`, {
        labels: menuOptionLabels,
        values: menuOptionLabels
      },
      true),

    // details section
    detailsSection
  ];

  return fsa.createForm(name, fields)
    .then(form => {
      console.log(`Created form ${form.id} named ${form.name} at ${form.url}`);
      return form;
    })
    .catch(err => console.error(`Error: ${err}`))
}

function applySectionDependencies(form) {
  return setLogicOnField(form.id, form.fields, 'My details', `I\'d like to update my`,'Details');
}

function setLogicOnField(formId, fields, targetFieldName, dependencyName, checkValue, isSection = true) {
  // find section's fieldId
  targetField = fields.find(field => {
    if (isSection)
      return field.section_heading === targetFieldName;
    else
      return field.label === targetFieldName;
  });

  // find dependency fieldId
  dependencyFieldId = fields.find(field => {
    return field.label === dependencyName
  }).id;

  // update field with logic
  const logic = {
    conditional: 'all',
    checks: [{
      field: dependencyFieldId,
      condition: 'equals',
      option: checkValue,
    }]
  }

  console.log(`setting login on field ${targetField.id} to be dependent on ${dependencyFieldId}`)

  // need to pass type on update
  return fsa.updateField(targetField.id, { type: targetField.type, logic: logic })
    .then(response => console.log(response));
}

createForm()
  .then(form => open(form.url));
