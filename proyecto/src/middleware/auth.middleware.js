     
function authMdw(req, res, next){
    if(req.session?.user){
        console.log("authMdw = ", req.session)
           return next();
       }
   
       return res.redirect('/api/views/login')
   }
      
  export default authMdw;
  