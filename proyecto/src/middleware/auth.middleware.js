function AuthMdw(req, res, next){
    if(req.session?.user){
           return next();
       }
   
       return res
       .redirect('/api/views/login')
   }
      
  export default AuthMdw;