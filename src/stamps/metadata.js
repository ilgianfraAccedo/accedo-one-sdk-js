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
      const load = loadMetadata({ key: 'metadata' });
      if (!load) {
        return request.call(this, '/metadata').then(metadata => {
          console.log('metadata in getall', metadata);
          saveMetadata({ key: 'metadata', value: metadata });
          return metadata;
        });
      }
      return load;
    },

    /**
     * Get the metadata by a specific key
     * @param {string} key a key to get specific metadata
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKey(key) {
      return request.call(this, `/metadata/${key}`);
    },

    /**
     * Get the metadata by specific keys
     * @param {array} keys an array of keys (strings)
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKeys(keys) {
      return request.call(this, `/metadata/${keys.join(',')}`);
    },
  },
});

module.exports = stamp;
