const conexion = require("../conexion")

module.exports = {

    insertar(idcompra, idart) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into com_art
            (idcompra, idart)
            values
            (?, ?)`,
                [idcompra, idart], (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                });
        });
    },

}