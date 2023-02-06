var express = require('express');
var router = express.Router();
const path = require('path');

//const adminController = require('../controllers/admin.controller');
const productcontroller = require('../controllers/product.controller');

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

router.get('/productdetails', productcontroller.productdetails); 
router.post('/addproduct',upload.fields([{name:'image',maxCount: 1}]),productcontroller.addproduct); 
router.get('/listproduct/:id',productcontroller.listproduct); 


/** Node backend page section **/
router.post('/addproductdetail',upload.single('image'),productcontroller.addproductdetail);
router.post('/updateproductdetail/:id',upload.single('image'),productcontroller.updateproductdetailpost);
router.get('/admin/products-add',productcontroller.productsadd);
router.get('/admin/update-product/:id',productcontroller.updateproductdetails);
router.get('/admin/delete-product/:id',productcontroller.deleteproductdetails);
router.get('/admin/products-lists',productcontroller.productslist);



module.exports = router;