const conexion = require("../conexion")

module.exports = {

    insertar(nombre, precio,estatus, iduser,idart) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into orden
            (nombre, precio, estatus,iduser,idart)
            values
            (?, ?, ?, ?,?)`,
                [nombre, precio,estatus, iduser,idart], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select idorden,nombre, precio, estatus,iduser, idart from orden where estatus = 'proceso' and iduser = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },

 
    eliminar(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`delete from orden
            where idorden = ?`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },

}