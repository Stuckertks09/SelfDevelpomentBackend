export const isGuest = (userId) => typeof userId === 'string' && userId.startsWith('guest_');
