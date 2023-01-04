const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async(req, res) => {
    var action = 'dashboard';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('dashboard',{page_title:"Admin - Dashboard",data:data,LoginUser:LoginUser,action:action});  
});

module.exports = {
    dashboard
};