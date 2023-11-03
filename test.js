var ImageParser = require("image-parser");

var axios = require("axios");
var qrCode = require("qrcode-reader");
var Jimp = require("jimp");
var fs = require("fs");
var path = require("path");

const readQrCodeUrl = async (photoDownloadUrl) => {
  try {
    const downloadRes = await axios.get(photoDownloadUrl, {
      responseType: "arraybuffer",
    });

    const imgBuffer = new Uint8Array(downloadRes.data);
    // console.log(photoData);
    var img = new ImageParser(imgBuffer);
    img.parse(function (err) {
      if (err) {
        console.error(err);
        // TODO handle error
      }
      var qr = new qrCode();
      qr.callback = function (err, value) {
        if (err) {
          console.error(err);
          // TODO handle error
          return done(err);
        }
        console.log(value.result);
        console.log(value);
      };
      qr.decode({ width: img.width(), height: img.height() }, img._imgBuffer);
    });

    // const qr = new qrCode();
    // const value = await new Promise((resolve, reject) => {
    //   qr.callback = (err, val) => (err != null ? reject(err) : resolve(val));
    //   qr.decode(img.bitmap);
    // });
    // return value.result;
    return "ok";
  } catch (error) {
    console.log(error.message);
  }
};

const readQrCodeFromUrl = async (url) => {
  try {
    const img = await Jimp.read(url);
    const qr = new qrCode();
    const value = await new Promise((resolve, reject) => {
      qr.callback = (err, val) => (err != null ? reject(err) : resolve(val));
      qr.decode(img.bitmap);
    });
    return value.result;
  } catch (error) {
    console.log(error.message);
  }
};

const readQrCode = async (fileName) => {
  console.log(fileName);
  //   const filePath = path.join(__dirname, fileName);
  //   try {
  //     if (fs.existsSync(filePath)) {
  //       const img = await Jimp.read(fs.readFileSync(filePath));
  //       const qr = new qrCode();
  //       const value = await new Promise((resolve, reject) => {
  //         qr.callback = (err, val) => (err != null ? reject(err) : resolve(val));
  //         qr.decode(img.bitmap);
  //       });
  //       return value.result;
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  var buffer = fs.readFileSync(__dirname + "/" + fileName);
  Jimp.read(buffer, function (err, image) {
    if (err) {
      console.error(err);
      // TODO handle error
    }
    var qr = new qrCode();
    qr.callback = function (err, value) {
      if (err) {
        console.error(err);
        // TODO handle error
      }
      console.log(value.result);
      console.log(value);
    };
    qr.decode(image.bitmap);
  });
};

readQrCode("1.jpeg").then(console.log).catch(console.log);
// readQrCodeFromUrl(
//   "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/maids%2F33LEAu1dmdAa6HEPdZ5h%2FAgACAgUAAxkBAAICBWQpAQiLfVvjB2k3lbpijQb3wlWxAAIrszEbE-pJVeqPMMK9OrgRAQADAgADeQADLwQ.jpg?alt=media&token=267e7150-c330-4d29-8a00-23619dbcb5f2"
// )
//   .then(console.log)
//   .catch(console.log);
