app.factory("$decrypt", function ($http) {
  var obj = {};
  obj.decrypted = function (obj_line) {
    let decryptedObj = CryptoJS.AES.decrypt(obj_line, "Passphrase").toString(
      CryptoJS.enc.Utf8
    );
    return decryptedObj;
  };

  return obj;
});
