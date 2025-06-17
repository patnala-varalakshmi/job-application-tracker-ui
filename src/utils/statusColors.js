
export const getStatusClass = (status) => {
  switch (status) {
    case 'Applied':
      return 'bg-primary';
    case 'Interview':
      return 'bg-warning text-dark';
    case 'Offered':
      return 'bg-success';
    case 'Rejected':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};
