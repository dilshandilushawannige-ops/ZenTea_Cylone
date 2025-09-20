export const roleHome = (role) => {
  switch (role) {
    case 'Admin': return '/admin';
    case 'Collector': return '/collector';
    case 'Supplier': return '/supplier';
    case 'Employee': return '/employee';
    case 'Customer': return '/customer';
    default: return '/';
  }
};
