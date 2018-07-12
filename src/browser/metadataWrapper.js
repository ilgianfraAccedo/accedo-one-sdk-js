const EXPIRATION = 60 * 1000;
let haSsessionStorage = false;
try {
  haSsessionStorage = typeof sessionStorage !== 'undefined';
} catch (err) {
  // Probably Safari 11 with 'website data' set to 'always blocked'
}

module.exports.saveMetadata = ({ key, value }) => {
  if (!haSsessionStorage) {
    return;
  }

  try {
    const expirationMS = EXPIRATION;
    const data = JSON.stringify(value);
    const now = new Date().getTime();
    sessionStorage[key] = data;
    sessionStorage[`${key}_timestamp`] = now + expirationMS;
  } catch (error) {
    return undefined;
  }
};

module.exports.loadMetadata = ({ key }) => {
  if (!haSsessionStorage) {
    return;
  }

  try {
    if (!sessionStorage[key]) {
      return undefined;
    }

    const timestamp = sessionStorage[`${key}_timestamp`];
    const now = new Date().getTime();
    const data = JSON.parse(sessionStorage[key]);
    return now < timestamp && data;
  } catch (error) {
    return undefined;
  }
};
