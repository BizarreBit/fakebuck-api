const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// module.exports = multer({ dest: "public/images" });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file);
    // cb("Error", "destination");  //node pattern "error-first callback style"
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

module.exports = multer({ storage });
