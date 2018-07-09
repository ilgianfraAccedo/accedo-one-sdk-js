const sessionStamp = require('./session');
const { grab } = require('../apiHelper');
const { saveMetadata, loadMetadata } = require('../browser/metadataWrapper');

function request(path) {
  return this.withSessionHandling(() => grab(path, this.config));
}

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get all the metadata
     * @return {promise}  a promise of the requested data
     */
    getAllMetadata() {
      const metadataKey = 'metadata_all';
      const load = loadMetadata({ key: metadataKey });
      if (!load) {
        return request.call(this, '/metadata').then(metadata => {
          saveMetadata({ key: metadataKey, value: metadata });
          return metadata;
        });
      }
      return Promise.resolve(load);
    },

    /**
     * Get the metadata by a specific key
     * @param {string} key a key to get specific metadata
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKey(key) {
      const metadataKey = `${key}_metadata`;
      const load = loadMetadata({ key: metadataKey });
      if (!load) {
        return request.call(this, `/metadata/${key}`).then(metadata => {
          saveMetadata({ key: metadataKey, value: metadata });
          return metadata;
        });
      }
      return Promise.resolve(load);
    },

    /**
     * Get the metadata by specific keys
     * @param {array} keys an array of keys (strings)
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKeys(keys) {
      const metadataKey = `${keys.join(',')}_metadata`;
      const load = loadMetadata({ key: metadataKey });
      if (!load) {
        return request
          .call(this, `/metadata/${keys.join(',')}`)
          .then(metadata => {
            saveMetadata({ key: metadataKey, value: metadata });
            return metadata;
          });
      }
      return Promise.resolve(load);
    },
  },
});

module.exports = stamp;
