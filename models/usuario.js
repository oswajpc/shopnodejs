const conexion = require("../conexion")

module.exports = {

    obtenerPorUsuario(email,pass) {
        return new Promise((resolve, reject) => {
            conexion.query(`select iduser, nombre, email from usuario where email = ? and password = ?`,
                [email,pass],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },

    obtenerVentas(id,fec_in,fec_fi) {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from articulo a inner join com_art ca on a.idart = ca.idart inner join compra c on c.idcompra = ca.idcompra where a.iduser = ? or c.fecha BETWEEN ? and ?`,
                [id,fec_in,fec_fi],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerVentasFecha(id,fec_in,fec_fi) {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from articulo a inner join com_art ca on a.idart = ca.idart inner join compra c on c.idcompra = ca.idcompra where a.iduser = ? and c.fecha BETWEEN ? and ?`,
                [id,fec_in,fec_fi],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
}