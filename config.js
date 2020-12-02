module.exports = {
    secretKey: "ABCDEFGHIJKLDMM-78945-20204-14256-20589",
    mongoUrl: "mongodb://localhost:27017/case",
    facebook: {
      clientId: "685489308752287",
      clientSecret: "470af16999243fbe7646ac2a3ba5e5ba",
    },
  };
  exports.validateEmail = function(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
    } else {
        return false;
    }

}


exports.randomString = function(length)
{
    finalString = "";
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    size = strlen(chars);
    for (i = 0; i < length; i++) {
        str = chars[rand(0, size - 1)];
        finalString += str;
    }
    return finalString;
}