import { Router } from "express";
import nodemailer from "nodemailer";
import { EMAIL, PSW_EMAIL } from "../config/config.js";
import {generateJWT} from '../utils/jwt.js';
const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true, // Use `true` para usar el puerto 465, `false` para otros puertos.
  auth: {
    user: EMAIL,
    pass: PSW_EMAIL,
  },
  tls: {
    rejectUnauthorized: false
}
});


router.post("/send", /*handlePolicies(["USER"]),*/ async (req, res) => {
  try {
    const email = req.body.email;
    req.logger.info(
      "email recibido por el body: ",
      email
    );

  // Genera el token
  const token = await generateJWT({email});
  req.logger.info("token: ", token)

    let resultEmail = await transporter.sendMail({
      from: EMAIL,
      to: EMAIL,
      subject: `email enviado para ${email}!!`,
      html: `
      <div>
        <h1>email de test<h1/>
        Esto es un email de test para ${email}!
        <br>
        Código de seguridad:<br> ${token}
        <br>
        <form action="http://localhost:8080/api/views/recover">
        <button type="submit">Recuperar contraseña</button>
      </form>

      <h5>Atención, email sin archivos adjuntos.</h5>

      </div>
      `,
    });
  

    return handleResponseRecover(req, res, {message: `Éxito, email enviado a ${email}`}, 200);

//    return res.send({ ok: true, message: `email enviado a ${email}` });
  } catch (error) {
    req.logger.error("error:", error);
    res.redirect('/recover');
  }
});


export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: EMAIL,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};


const handleResponseRecover = (req, res, response, statusCode) => {
  if (req.headers['content-type'] === 'application/json' || req.xhr) {
      return res.status(statusCode).json(response);
  } else {
      return res.status(statusCode).render('recover', response);
  }
};

export default router;