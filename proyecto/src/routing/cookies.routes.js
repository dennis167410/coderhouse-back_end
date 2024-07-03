import {Router} from 'express';

const router = Router();

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

router.get(`/`, (req, res)=>{
    return res.json({cookie: req.cookies, signedCookies: req.signedCookies});
});

//deleteCookie


export default router;
