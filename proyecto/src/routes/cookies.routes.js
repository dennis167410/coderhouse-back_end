const {Router} = require('express');

const router = Router();

//setCookie
router.post(`/setCookie`, (req, res)=>{
    const body = req.body;
   // console.log("Cookies del setCookie= ", body);

    return res
    .cookie(
        'cookieUser',
        {user: `${body.email}`}, 
        {maxAge: 10000}
      )
    .send();
});

//getCookie
router.get(`/`, (req, res)=>{
    //console.log("Info de las cookies ", req.cookies, req.signedCookies);
    //return res.json({cookie: req.cookies});
    return res.json({cookie: req.cookies, signedCookies: req.signedCookies});
});

//deleteCookie



module.exports = router;