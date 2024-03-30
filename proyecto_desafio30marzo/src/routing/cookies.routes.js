const {Router} = require('express');

const router = Router();

//setCookie
router.post(`/setCookie`, (req, res)=>{
    const body = req.body;
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
    return res.json({cookie: req.cookies, signedCookies: req.signedCookies});
});

//deleteCookie



module.exports = router;