var express = require('express');
var router = express.Router();
const path = require('path');

//const adminController = require('../controllers/admin.controller');
const categorycontroller = require('../controllers/category.controller');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
 
var upload = multer({ storage: storage });

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'uploads', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|doc)$/)) { 
       // upload only png and jpg format
       return cb(new Error('Please upload a Image'))
     }
   cb(undefined, true)
}
}) 
/** API Section **/
router.get('/categorydetails', categorycontroller.categorydetails); 
router.post('/addcategory',upload.single('image'),categorycontroller.addcategory); 
router.post('/updatecategory/:id',upload.single('image'),categorycontroller.updatecategory); 


/** Node backend page section **/
router.get('/admin/category',categorycontroller.categorypage);
router.get('/admin/delete-category/:id',categorycontroller.deletecategory);
router.get('/admin/update-category/:id',categorycontroller.updatecategorydetails);
router.get('/admin/categorylist',categorycontroller.categorylist);
module.exports = router;