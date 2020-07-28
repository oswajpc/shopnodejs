const conexion = require("../conexion")

module.exports = {

    insertar(nombre, imagen,archivo,precio,descripcion, iduser) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into articulo
            (nombre, imagen, archivo, precio, descripcion,iduser)
            values
            (?, ?, ?, ?, ?, ?)`,
                [nombre, imagen, archivo, precio,descripcion,iduser], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select idart, nombre, imagen, archivo, precio, descripcion from articulo`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorUsuario(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select idart, nombre, imagen, archivo, precio, descripcion from articulo where iduser = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select idart, nombre, imagen, archivo, precio, descripcion from articulo where idart = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    obtenerArtCom(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select a.idart,a.nombre as nomart, a.imagen, a.precio, a.descripcion, u.nombre from articulo a inner join usuario u where a.idart =  ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    obtenerPorUser() {
        return new Promise((resolve, reject) => {
            conexion.query(`select idart, nombre, imagen, archivo, precio, descripcion from articulo where iduser = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    actualizar(id, nombre, precio, descripcion) {
        return new Promise((resolve, reject) => {
            conexion.query(`update articulo
            set nombre = ?,
            precio = ?,
            descripcion = ?,
            where idart = ?`,
                [nombre, precio, descripcion, id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    eliminar(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`delete from articulo
            where idart = ?`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },

}