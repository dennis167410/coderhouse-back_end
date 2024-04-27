export const generateProductsErrorInfo = (title, description, code, price, stock, category) => {
    return `Uno o más de los siguientes parametros están incompleto o no son válidos.
    Lista de prámetros:
        *Title: string, se recibio ${title}
        *Description: string, se recibio ${description}
        *Code: string, se recibio ${code}
        *Price: number, se recibio ${price}
        *Stock: number, se recibio ${stock}
        *Category: string, se recibio ${category}`;
        
}