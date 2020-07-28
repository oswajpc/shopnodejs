const conexion = require("../conexion")

module.exports = {

    insertar(fecha, total,iduser,estatu) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into compra
            (fecha, total, iduser,estatu)
            values
            (?, ?, ?,?)`,
                [fecha, total,iduser,estatu], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select idcompra, fecha, total, iduser, estatu from compra where estatu = 'comprado'`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerMisCompras(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select a.nombre, a.imagen, a.archivo, a.precio, c.fecha, c.total from com_art ca inner join articulo a on ca.idart = a.idart inner join compra c on ca.idcompra = c.idcompra inner join usuario u on c.iduser = u.iduser where u.iduser = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },

}