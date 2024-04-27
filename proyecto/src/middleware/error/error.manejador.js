import { StatusCodes } from "http-status-codes";

//Dónde ocurre el error.
export const DictionaryErrors = {
  ERROR_DE_RUTEO: `ERROR_DE_RUTEO`,
  ERROR_DE_TIPOS_NO_VALIDOS: `ERROR_DE_TIPOS_NO_VALIDOS`, 
  ERROR_DEL_CONTROLADOR: `ERROR_DEL_CONTROLADOR`, 
  ERROR_DEL_SERVICIO: `ERROR_DEL_SERVICIO`, 
  ERROR_EN_LA_BASE_DE_DATOS: `ERROR_EN_LA_BASE_DE_DATOS`,
  ERROR_PARAMETROS_NO_VALIDOS: `ERROR_PARAMETROS_NO_VALIDOS`,
  ERROR_INTERNO_DEL_SERVIDOR: `ERROR_INTERNO_DEL_SERVIDOR`,
};

export class HttpResponse {
  OK(res, message, data) {
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      statusMessage: message,
      data,
    });
  }

 NotFound(res, message, data) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      statusMessage: message,
      data,
    });
  }


  Unauthorized(res, message, data) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      statusMessage: message,
      data,
    });
  }


  Forbbiden(res, message, data) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      statusMessage: message,
      data,
    });
  }


  //Un dato que falta en el body
  BadRequest(res, message, data) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      statusMessage: message,
      data,
    });
  }


  Error(res, message, data, codeError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: message,
      data,
      codeError,
    });
  }

}