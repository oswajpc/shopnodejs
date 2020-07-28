const mysql = require("mysql");
// Coloca aquí tus credenciales
module.exports = mysql.createPool({
  host: "br5ijlgnm8vc3wbtw9yp-mysql.services.clever-cloud.com",
  user: "uykpkcaz02im0q3c",
  password: "mPTvFBPZz6qaq3OxVkfi",
  database: "br5ijlgnm8vc3wbtw9yp"
});