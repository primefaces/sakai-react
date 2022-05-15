export default function formValidation(object, type, value) {

  let errors
  switch (type) {
    case 'alphanumeric':
      let alphanumeric = /^[a-z\d\-_\s]+$/i
      if (!alphanumeric.test(value)) {
        errors = `${object} fields must alphanumeric`;
      }
      break;
    case 'nowhitespace':
      let noWhiteSpace = /^\S+$/
      if (!noWhiteSpace.test(value)) {
        errors = `${object} fields must not have whitespace`;
      }
      break;
    case 'characters':
      let characters = /^[a-zA-Z\s]*$/
      if (!characters.test(value)) {
        errors = `${object} fields must characters only`;
      }
      break;
    case 'companycode':
      if (value.length < 4 || value.length > 5) {
        errors = `${object} fields must have 4 or 5 characters`;
      }
      break;
    case 'percentage':
      let char = /^\d+(\.\d+)*$/
      if (!char.test(value)) {
        errors = `${object} fields must percentage only`;
      }
      break;
    case 'numeric':
      let numeric = /^\d+$/
      if (!numeric.test(value)) {
        errors = `${object} fields must numeric only`;
      }
      break;
    case 'email':
      let email = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      if (!email.test(value)) {
        errors = `${object} fields must contain email format`;
      }
      break;
    case 'mandatory':
      if (value.length < 1) {
        errors = `${object} fields is required`;
      }
      break;
    default:
      break;
  }
  return errors

}