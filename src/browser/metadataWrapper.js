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
    const expirationMS = 60 * 1000;
    const data = JSON.stringify(value);
    const now = new Date().getTime();
    console.log('Save data', value);
    localStorage[key] = data;
    localStorage[`${key}Timestamp`] = now + expirationMS;
  } catch (error) {
    console.log(error, 'save meta');
    // nothing we can do on private mode or lack of storage space
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
    const timestamp = localStorage[`${key}Timestamp`];
    const now = new Date().getTime();
    const data = JSON.parse(localStorage[key]);
    console.log('LOAD DATA:', data);
    return now < timestamp && data;
  } catch (error) {
    console.log(error, 'load meta');
    return undefined;
  }
};
