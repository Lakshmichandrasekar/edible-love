const catchAsync = require('../utils/catchAsync');
var User = require('../models/user');
const usercontoller = require('../controllers/user.controller');



const login = catchAsync(async(req, res) => {
    var values = JSON.parse(JSON.stringify(req.body));
    console.log(values.email);
    data = {};
    errorData = {};
    var action = 'login';
    if (req.method == "POST") { 
        var user = await User.findOne({email:values.email,password:values.password}).lean().exec(); 
       
        if (user != null && user != '' && user != undefined) { 
            return res.redirect(AdminUrl+'/admin/dashboard');  
            
        }else{
            data.email = values.email; 
            data.password = values.password; 
            errorData.email = 'Invalid username and password.';
        }
        res.set('content-type' , 'text/html; charset=mycharset'); 
        res.render('login',{page_title:"Admin - Login",data:data,errorData:errorData,controller:usercontoller,action:action});  
    }
    
});

module.exports = {
    login
};