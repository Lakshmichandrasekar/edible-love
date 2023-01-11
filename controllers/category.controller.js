const catchAsync = require('../utils/catchAsync'); 

var category = require('../models/category'); 
const multer = require('multer');


const categorypage = catchAsync(async(req, res) => {
    var action = 'category';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('addcategory',{page_title:"Admin - Category",data:data,LoginUser:LoginUser,action:action});  
});

const updatecategorydetails = catchAsync(async(req, res) => {
    var action = 'category';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; 
    LoginUser = {};
    errorData = {};
    const allRecord = await category.findOne({id:req.params.id}).lean().exec(); 
    res.render('updatecategory',{page_title:"Admin - Category",data:allRecord,LoginUser:LoginUser,action:action});  
});

const categorylist = catchAsync(async(req, res) => {
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    //const allRecord = await Users.findAll();   
    const allRecord = await category.find({"status":0}).lean().exec(); 
    res.render('category',{
        page_title:" List",
        data:allRecord, 
        action:action,
    });  
});


const categorydetails = catchAsync(async (req, res) => {
 
    category.find({"status":0}).lean().exec().then((Result) => {
        if (Result && Result.length > 0) {
            res.send({
                code: 200,
                success: true,
                message: "Data Retrieved Success.",
                data: Result,
                timestamp: new Date()
            })
        } else {
            res.send({
                code: 404,
                success: false,
                message: "No Records Found.",
                timestamp: new Date()
            });
        }
    }).catch((err) => {
        res.send({
            code: 502,
            success: false,
            message: "DATABASE_ERROR.",
            timestamp: new Date()
        });
    })
});

const addcategory = catchAsync(async (req, res) => {
    let values = req.body;
    var url  = 'https://edible-love-production.up.railway.app/'; 
    if (values.name != '' && values.name != null && values.name != undefined) 
    {
        var Previouscategory = await category.findOne().sort('-id').lean().exec(); 
        if(Previouscategory != null && Previouscategory != '' && Previouscategory != undefined)
        {
            if(Previouscategory.hasOwnProperty('id') != null){
                id = Previouscategory.id + 1;
            }else{
                id = 1;
            }
        }
        else
        {
             id = 1;
        }
        
       let files =JSON.stringify(req.file);
       //image = files.image[0]['filename'];
       //document = files.document[0]['filename'];
        let Data = {
            id : id,
            name: values.name,  
            createdAt: new Date(),
            updatedAt: new Date(),
            lastModifiedAt: new Date(),
            LastModifiedBy: '',
        } 
        if(req.file != '' && req.file != null && req.file != undefined)
        {
            if(req.file.filename && req.file.filename && req.file.filename.length > 0){
                Data.image = url +req.file.filename;
                Data.image_name = req.file.filename;
            }
        }
        category(Data).save().then((Result) => {
            return res.redirect(AdminUrl+'/admin/categorylist');  
        });
        // res.set('content-type' , 'text/html; charset=mycharset'); 
        // action = 'list'; 
        // res.render('category',{
        //     page_title:" List",
        //     data:Data, 
        //     action:action,
        // });  
    } else {
        res.send({
            code: 201,
            success: false,
            status: "All Fields are Mandatory",
            timestamp: new Date()
        });
    }
});

const updatecategory = catchAsync(async (req, res) => {
    let values = req.body;
    var url  = 'https://edible-love-production.herokuapp.com'; 
    if (values.name != '' && values.name != null && values.name != undefined) 
    {
        
        let query = {
            id:req.params.id
        };
        var Previouscategory = await category.findOne(query).sort('-id').lean().exec();
      
            if(req.file != '' && req.file != null && req.file != undefined)
            {
                if(req.file.filename && req.file.filename && req.file.filename.length > 0)
                {
                    var images = url +req.file.filename;
                    var image_name =  req.file.filename;
                }
            }
            else
            {
                var images = Previouscategory.image;
                var image_name =  Previouscategory.image_name;
            }
       
        let changes = {
            $set: {
                name: values.name,
                image:images,
                image_name: image_name
            }
        }
        category.updateOne(query, changes, { upsert: true }).lean().exec().then((UpdateStatus) => {
            return res.redirect(AdminUrl+'/admin/categorylist');  
        });
    } else {
        res.send({
            code: 201,
            success: false,
            status: "All Fields are Mandatory",
            timestamp: new Date()
        });
    }
});

const deletecategory = catchAsync(async (req, res) => {  
    let query = {
        id:req.params.id
    };
    let changes = {
        $set: {
            status: 1
        }
    }
    category.updateOne(query, changes, { upsert: true }).lean().exec().then((UpdateStatus) => {
        return res.redirect(AdminUrl+'/admin/categorylist');  
    });   
});

///////////////
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
} 

module.exports = {
    categorydetails,
    addcategory,
    categorypage,
    deletecategory,
    categorylist,
    updatecategorydetails,
    updatecategory
};