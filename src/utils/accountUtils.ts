export const getAccountKey = (): string | null => {
    const userMetadata = document.querySelector('meta[name="og-profile-acct"]');
    return userMetadata?.getAttribute('content') || null;
};