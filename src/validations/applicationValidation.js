export function validateApplication(formData) {
  const errors = {};

  if (!formData.companyName || formData.companyName.trim() === '') {
    errors.company = 'Company name is required';
  }

  if (!formData.position || formData.position.trim() === '') {
    errors.position = 'Position is required';
  }

  if (!formData.status || formData.status.trim() === '') {
    errors.status = 'Status is required';
  }

  return errors;
}
