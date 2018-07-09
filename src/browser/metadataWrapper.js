const EXPIRATION = 60 * 1000;
let hasLocalStorage = false;
try {
  hasLocalStorage = typeof localStorage !== 'undefined';
} catch (err) {
  // Probably Safari 11 with 'website data' set to 'always blocked'
}

module.exports.saveMetadata = ({ key, value }) => {
  if (!hasLocalStorage) {
    return;
  }

  try {
    const expirationMS = EXPIRATION;
    const data = JSON.stringify(value);
    const now = new Date().getTime();
    localStorage[key] = data;
    localStorage[`${key}_timestamp`] = now + expirationMS;
  } catch (error) {
    return undefined;
  }
};

module.exports.loadMetadata = ({ key }) => {
  if (!hasLocalStorage) {
    return;
  }

  try {
    if (!localStorage[key]) {
      return undefined;
    }

    const timestamp = localStorage[`${key}_timestamp`];
    const now = new Date().getTime();
    const data = JSON.parse(localStorage[key]);
    return now < timestamp && data;
  } catch (error) {
    return undefined;
  }
};
