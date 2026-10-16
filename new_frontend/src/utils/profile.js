// Absolute URLs and local previews can be rendered directly. Relative backend
// storage paths are loaded through the authenticated profile-image service.
export const profileImageUrl = (path) => /^(https?:\/\/|blob:)/i.test(String(path || '')) ? path : '';

export const initialsFor = (name, email) => {
  const source = String(name || email || '?').trim();
  const parts = source.includes('@') ? source.split('@')[0].split(/[._\s-]+/) : source.split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || '?';
};
