const fetch = require('node-fetch');

class FormStack {
  constructor(token) {
    this.token = token
    this.BASE_URL = 'https://www.formstack.com/api/v2/';
  }

  call(endpoint, method = 'GET', payload = '') {
    return new Promise((resolve, reject) => {

      const options = {
        method: method,
        timeout: process.env.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      }

      if ((method === 'POST') || (method === 'PUT'))
        options.body = JSON.stringify(payload)

      fetch(this.BASE_URL + endpoint, options)
        .then((res) => res = res.json())
        .then((json) => {
          if (json.status === 'error')
            reject(json.error)
          else
            resolve(json);
        })
        .catch((err) => reject(err));
    })
  }

  /**
  * Creates a copy of a Form in your account.
  *
  * @link		https://www.formstack.com/developers/api/resources/form#form/:id/copy_POST
  *
  * @param	{number}	formId				Required. The ID of the Form to copy
  *
  * @param	{function}  callback(err, data)	Callback function for async requests.
  * 				{object}	data			An object representing all of the copy's data
  * 				{object}	err				Error information, if any. If an error occurs, data is null
  */
  copyForm(formId) {
    return this.call(`form/${formId}/copy`, 'POST', null);
  }

  createForm(name, fields) {
    const body = {
      name,
      fields,
      use_ssl: true,
      active: true
    }

    return this.call(`form`, 'POST', body);
  }

  getForms() {
    return this.call(`form`)
  }

  getForm(formId) {
    return this.call(`form/${formId}`);
  }

  getFormFields(formId) {
    return this.call(`form/${formId}/field`);
  }

  updateField(fieldId, data) {
    return this.call(`field/${fieldId}`, 'PUT', data);
  }
}

module.exports = FormStack;
