export const checkPermissionMismatch = (permissions: string[], category: string) => {
  const normCategory = category.toLowerCase();
  const perms = permissions.map(p => p.toLowerCase());
  
  const hasContacts = perms.includes('contacts');
  const hasSms = perms.includes('sms');
  const hasLocation = perms.includes('location');
  const hasMic = perms.includes('microphone');

  let isMismatch = false;
  let severity = 'low';
  let message = 'Standard permissions detected.';

  if (hasContacts && normCategory.includes('calculator')) {
    return { isMismatch: true, severity: 'dangerous', message: 'Contacts + calculator = DANGEROUS MISMATCH' };
  }
  if (hasSms && normCategory.includes('flashlight')) {
    return { isMismatch: true, severity: 'dangerous', message: 'SMS + flashlight/torch = DANGEROUS MISMATCH' };
  }
  if (hasLocation && normCategory.includes('wallpaper')) {
    return { isMismatch: true, severity: 'suspicious', message: 'Location + wallpaper app = SUSPICIOUS' };
  }
  if (hasMic && normCategory.includes('utility')) {
    return { isMismatch: true, severity: 'suspicious', message: 'Microphone + utility app = SUSPICIOUS' };
  }
  if (hasContacts && normCategory.includes('game')) {
    return { isMismatch: true, severity: 'suspicious', message: 'Contacts + game = SUSPICIOUS' };
  }

  return { isMismatch: false, severity: 'none', message: 'Valid combination.' };
};
