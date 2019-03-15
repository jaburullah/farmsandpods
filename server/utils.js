/**
 * Created by jaburur on 21-07-2017.
 */
var theApp = require('./app')
const crypto = require('crypto');
var utils = {

  jsonResponse: function (session, flag, data) {
    return {success: flag, data: data};
  },
  viewResponse: function (session, flag, view, data) {
    return {success: flag, data: {view: view, data: data}};
  },
  encrypt: function (data, callBack) {
    var cipher = crypto.createCipher('aes192', theApp.secretKey);

    var encrypted = '';
    cipher.on('readable', function (args) {
      const data = cipher.read();
      if (data)
        encrypted += data.toString('hex');
    });
    cipher.on('end', function (args) {
      callBack(encrypted);
    });

    cipher.write(data);
    cipher.end();
  },
  decrypt: function (data, callBack) {
    var decipher = crypto.createDecipher('aes192', theApp.secretKey);
    var decrypted = '';
    decipher.on('readable', function (args) {
      const data = decipher.read();
      if (data)
        decrypted += data.toString('utf8');
    });
    decipher.on('end', function (args) {
      callBack(decrypted);
    });
    decipher.write(data, 'hex');
    decipher.end();
  }
};


module.exports = utils;
