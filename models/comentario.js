const conexion = require("../conexion")

module.exports = {

    insertar(comentario, iduser,idart) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into comentario
            (comentario, iduser, idart)
            values
            (?, ?, ?)`,
                [comentario, iduser,idart], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },

    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`SELECT c.idart, c.comentario, u.nombre FROM comentario c inner join usuario u on c.iduser = u.iduser where c.idart = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },

}