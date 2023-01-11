const catchAsync = require('../utils/catchAsync'); 

var product = require('../models/product'); 
var category = require('../models/category'); 




const productdetails = catchAsync(async (req, res) => {
 
    product.find({"status":0}).lean().exec().then(async (Result) => {
        if (Result && Result.length > 0) {
            var newdata = new Array();
            for(let i=0; i<Result.length; i++ )
            {
                var categoryname = await category.findOne({"status":0,id:Result[i].category_id}).sort('id').lean().exec();
                let Data =  {
                    "id" : Result[i].id,
                    "category_id" : categoryname.name,
                    "name" : Result[i].name,
                    "image" : Result[i].image,
                    "Description" : Result[i].Description,
                    "Short_description" : Result[i].Short_description,
                    "video_url" : Result[i].video_url,
                    "status" : Result[i].status
                };
                newdata.push(Data);
            }
            res.send({
                code: 200,
                success: true,
                message: "Data Retrieved Success.",
                data: newdata,
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

const addproduct = catchAsync(async (req, res) => {
    let values = req.body;
    var url  = 'https://edible-love.herokuapp.com/';
    if (values.name != '' && values.name != null && values.name != undefined) 
    {
        var Previousproduct = await product.findOne().sort('-id').lean().exec(); 
        if(Previousproduct != null && Previousproduct != '' && Previousproduct != undefined)
        {
            if(Previousproduct.hasOwnProperty('id') != null){
                id = Previousproduct.id + 1;
            }else{
                id = 1;
            }
        }
        else
        {
             id = 1;
        }
       let files = req.files;
       //image = files.image[0]['filename'];
       //document = files.document[0]['filename'];
        let Data = {
            id : id,
            category_id: values.category_id,  
            name: values.name,  
            Description: values.Description,  
            Short_description: values.Short_description,  
            video_url: values.video_url,  
            createdAt: new Date(),
            updatedAt: new Date(),
            lastModifiedAt: new Date(),
            LastModifiedBy: '',

        }
        if(files && files.image && files.image.length > 0){
            Data.image = url +files.image[0]['filename'];
        }
        product(Data).save().then((Result) => { 
            res.send({
                success: true,
                code: 200,
                message: "Products Added Success ",
                Result:1
            });
        }).catch((err) => {
            console.error('Database Error');
            console.error(err);
            res.send({
                success: false,
                code: 502,
                message: "Database Error", 
                "timestamp": new Date() 
            });
        })
    } else {
        res.send({
            code: 201,
            success: false,
            status: "All Fields are Mandatory",
            timestamp: new Date()
        });
    }
});

const productsadd = catchAsync(async(req, res) => {
    var action = 'Products Add';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    const categoryname = await category.find({"status":0}).sort('id').lean().exec();
    res.render('addproduct',{page_title:"Admin - Product",data:categoryname,LoginUser:LoginUser,action:action});  
});

const productslist = catchAsync(async(req, res) => {
    var action = 'Products List';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    const allRecord = await product.find({"status":0}).lean().exec(); 
    var newdata = new Array();
    for(let i=0; i<allRecord.length; i++ )
    {
        var categoryname = await category.findOne({"status":0,id:allRecord[i].category_id}).sort('id').lean().exec();
        if(categoryname != '' && categoryname != null && categoryname != undefined)
        {
            let Data =  {
                "id" : allRecord[i].id,
                "category_id" : categoryname.name,
                "name" : allRecord[i].name,
                "image_name" : allRecord[i].image_name,
                "Description" : allRecord[i].Description,
                "method" : allRecord[i].method,
                "Short_description" : allRecord[i].Short_description,
                "video_url" : allRecord[i].video_url,
                "status" : allRecord[i].status
            };
            newdata.push(Data);
        }
    }
    res.render('listproduct',{page_title:"Admin - Product",data:newdata,LoginUser:LoginUser,action:action});  
});

const addproductdetail = catchAsync(async (req, res) => {
    let values = req.body;
    console.log(values);
    var url  = 'https://edible-love-production.up.railway.app/'; 
    if (values.name != '' && values.name != null && values.name != undefined) 
    {
        var Previousproduct = await product.findOne().sort('-id').lean().exec(); 
        if(Previousproduct != null && Previousproduct != '' && Previousproduct != undefined)
        {
            if(Previousproduct.hasOwnProperty('id') != null){
                id = Previousproduct.id + 1;
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
            category_id: values.category_id,
            name: values.name,
            Description:values.Description,
            method:values.method,
            Short_description:values.Short_description,
            video_url:values.video_url,  
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
        product(Data).save().then((Result) => {
            return res.redirect(AdminUrl+'/admin/products-add');  
        });
        // res.set('content-type' , 'text/html; charset=mycharset'); 
        // action = 'list'; 
        // res.render('category',{
        //     page_title:" List",
        //     data:Data, 
        //     action:action,
        // });  
    } else {
        // res.send({
        //     code: 201,
        //     success: false,
        //     status: "All Fields are Mandatory",
        //     timestamp: new Date()
        // });
        res.redirect(AdminUrl+'/admin/products-add');
    }
});

const updateproductdetails = catchAsync(async(req, res) => {
    var action = 'category';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; 
    LoginUser = {};
    errorData = {};
    const categoryname =  await category.find({"status":0}).sort('id').lean().exec();
    const allRecord = await product.findOne({"status":0,id:req.params.id}).lean().exec(); 
    var newdata = new Array();
    var categorydetails = new Array();
    if(allRecord != '' && allRecord != null && allRecord != undefined)
    {
        let Data =  {
            "id" : allRecord.id,
            "category_id" : allRecord.category_id,
            "name" : allRecord.name,
            "image_name" : allRecord.image_name,
            "Description" : allRecord.Description,
            "method" : allRecord.method,
            "Short_description" : allRecord.Short_description,
            "video_url" : allRecord.video_url,
            "status" : allRecord.status,
        };
        for(var i = 0;i<categoryname.length;i++)
        {
            categorydetails.push({
                "id":categoryname[i].id,
                "name":categoryname[i].name,
            });
            Data.category_details = categorydetails
        }
        newdata.push(Data);
    }
    res.render('updateproduct',{page_title:"Admin - Category",data:newdata,LoginUser:LoginUser,action:action});  
});

const updateproductdetailpost = catchAsync(async (req, res) => {
    let values = req.body;
    var url  = 'https://edible-love-production.up.railway.app'; 
    if (values.name != '' && values.name != null && values.name != undefined) 
    {
        
        let query = {
            id:req.params.id
        };
        var Previouscategory = await product.findOne(query).sort('-id').lean().exec();
      
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
                category_id: values.category_id,
                name: values.name,
                image:images,
                image_name: image_name,
                Description:values.Description,
                method:values.method,
                Short_description:values.Short_description,
                video_url:values.video_url,
            }
        }
        product.updateOne(query, changes, { upsert: true }).lean().exec().then((UpdateStatus) => {
            return res.redirect(AdminUrl+'/admin/products-lists');  
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

const deleteproductdetails = catchAsync(async (req, res) => {  
    let query = {
        id:req.params.id
    };
    let changes = {
        $set: {
            status: 1
        }
    }
    product.updateOne(query, changes, { upsert: true }).lean().exec().then((UpdateStatus) => {
        return res.redirect(AdminUrl+'/admin/products-lists');  
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
    productdetails,
    addproduct,
    productsadd,
    productslist,
    addproductdetail,
    updateproductdetails,
    updateproductdetailpost,
    deleteproductdetails
    
};