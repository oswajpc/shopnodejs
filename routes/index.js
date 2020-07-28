var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require('path');
var crypto = require('crypto');
const artModel = require("../models/articulo");
const comModel = require("../models/comentario");
const userModel = require("../models/usuario");
const session = require('express-session');
const bodyParser = require('body-parser');
const orden = require("../models/orden");
const compraModel = require("../models/compra");
const compra_articulo = require("../models/com_art");
const moment = require('moment');

var data;
router.use(express.static(__dirname + '/public/'));

router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/manuales')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
  storage,
  dest: 'public/manuales'
}).single('manual');

router.get('/login', function (req, res, next) {
  var message = '';
  res.render("usuario/login",{msg:message});
});
router.post('/auth', function(request, response) {
	var username = request.body.Email;
	var password = request.body.Password;
	if (username && password) {
    userModel.obtenerPorUsuario(request.body.Email,request.body.Password)
      .then( user => {
          if(user){
            request.session.loggedin = true;
            request.session.iduser = user.iduser;
            request.session.nombre = user.nombre;

            response.redirect('/');
          }else{
            response.render("usuario/login",{msg:"Credenciales Incorrectas"});
          }
          response.end();
      })
	
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/logout', function (req,res,next){
    req.session.destroy((err) => {
      res.redirect('/login');
    });
    
});

/* GET home page. */
router.get('/', function(req, res, next) {

  var msgAgregado = '';
  if(req.session.loggedin)
  {
    artModel.obtener()
    .then(articulo => {
        res.render('articulo/articulos',{articulo: articulo,msgAgregado:msgAgregado});
    })
    .catch( err => {
      return res.status(500).send("Error obteniendo productos");
    });
  }else{
    res.redirect('/login');
  }

  // res.render('index', { title: 'Express' });
});

router.get('/productos', function (req, res, next) {
  if(req.session.loggedin){
      artModel
      .obtenerPorUsuario(req.session.iduser)
      .then(art => {
          if (art) {
              res.render("articulo/add_articulos", {
                articulo: art,
              });
          } else {
              return res.status(500).send("Error");
          }
      })
      .catch(err => {
          return res.status(500).send("Error obteniendo articulo");
      });
  }else{
    res.redirect('/login');
  }

});

router.get('/agregar', function (req, res, next) {
  res.render("articulo/add");
});

router.get('/ver/:id', function (req, res, next) {
  var comentarios = '';
  artModel
      .obtenerArtCom(req.params.id)
      .then(art => {
          if (art) {
            comModel
            .obtenerPorId(req.params.id)
            .then(com => {
                
                res.render("articulo/single", {
                    articulo: art,
                    comentarios: com,
                    idart:req.params.id
                });
            })
            .catch(err => {
                return res.status(500).send("Error obteniendo articulo");
            })
          } else {
              return res.status(500).send("Error");
          }
      })
      .catch(err => {
          return res.status(500).send("Error obteniendo articulo");
      });
});

router.post('/insertar', function (req, res, next) {
    upload(req, res, (err) => {

      // res.redirect("/agregar");

        var manual = req.file.filename;
        var id = req.session.iduser;
        const {nombre,Foto,precio,descripcion, iduser} = req.body;

        artModel
          .insertar(nombre, Foto, manual, precio, descripcion, id)
          .then( () => {
              res.redirect("/productos");
          })
          .catch( err => {
              
              return res.status(500).send(err);
          });

    })
});

router.get('/editar/:id', function (req, res, next) {
  artModel
      .obtenerPorId(req.params.id)
      .then(art => {
          if (art) {
              res.render("articulo/editar", {
                articulo: art,
              });
          } 
      })
      .catch(err => {
          return res.status(500).send("Error ");
      });
});
router.post('/actualizar', function (req, res, next) {
  // Obtener el nombre y precio. Es lo mismo que
  // const nombre = req.body.nombre;
  // const precio = req.body.precio;
  const { idart, nombre1,descripcion1, precio1 } = req.body;
 
  // Si todo va bien, seguimos
    artModel
      .actualizar(idart, nombre1, precio1, descripcion1)
      .then(() => {
          res.redirect("/");
      })
      .catch(err => {
          return res.status(500).send(err);
      });
});
router.get('/eliminar/:id', function (req, res, next) {
  artModel
      .eliminar(req.params.id)
      .then(() => {
          res.redirect("/productos");
      })
      .catch(err => {
          return res.status(500).send("Error eliminando");
      });
});

router.get('/carrito', function (req, res, next) {
  var msgAgregado = '';
  var element = 0;
  if(req.session.loggedin)
  {
    var id = req.session.iduser;+
    
    orden.obtenerPorId(id)
    .then(ordenArt => {
      ordenArt.forEach(elemento => {
            element = element + elemento.precio;
        });
        
        res.render('articulo/carrito',{ordenArt: ordenArt,msgAgregado:msgAgregado,total:element});
        console.log(element);
    })
    .catch( err => {
      return res.status(500).send("Error obteniendo productos");
    });
  }else{
    res.redirect('/login');
  }
  
});

router.post('/comprar', function (req, res, next) {
  var id = req.session.iduser;
  var estatu = 'proceso';
  const { nombre,precio, idarticulo } = req.body;
  orden
    .insertar(nombre, precio,estatu,id,idarticulo)
    .then( () => {
      res.redirect("/carrito");
    })
    .catch( err => {
        
        return res.status(500).send(err);
    });

});

router.get('/eliminar_pro/:id', function (req, res, next) {
  orden
      .eliminar(req.params.id)
      .then(() => {
          res.redirect("/carrito");
      })
      .catch(err => {
          return res.status(500).send("Error eliminando");
      });
});

router.get('/confirmarPago', function (req, res, next) {
  var id = req.session.iduser;
  // let ts = Date.now();
  var element = 0;
  var estatu = "comprado";
  // var hoy = new Date();
  // var fecha = hoy.getFullYear() + '-' + hoy.getDate() + '-' +(hoy.getMonth() + 1);
  // var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
  var ts = moment().format("DD/MM/YYYY");

  orden.obtenerPorId(id)
  .then(ordenArt => {
    ordenArt.forEach(elemento => {
          element = element + elemento.precio;
    });
    compraModel
    .insertar(ts, element,id,estatu)
    .then( () => {
        compraModel.obtener()
        .then(compraPen => {
          compraPen.forEach(pen => {
            ordenArt.forEach(art => {
              compra_articulo.insertar(pen.idcompra,art.idart)              
            });
          });
          ordenArt.forEach(del => {
            orden.eliminar(del.idorden)              
          });
          res.redirect('/miscompras');
        })
    })
    .catch( err => {
        return res.status(500).send(err);
    });


      // res.redirect('articulo/miscompras');
      // console.log(element);
  })
  .catch( err => {
    return res.status(500).send("Error obteniendo productos");
  });

});

router.get('/miscompras', function (req, res, next) {
  if(req.session.loggedin)
  {
    var id = req.session.iduser;+
    compraModel.obtenerMisCompras(id)
    .then(compras => {
        res.render('articulo/compras',{compras: compras});
    })
    .catch( err => {
      return res.status(500).send("Error obteniendo productos");
    });
  }else{
    res.redirect('/login');
  }
});

router.get('/nosotros', function (req, res, next) {
  res.render("usuario/nosotros");
});

router.post('/agregarcoment', function (req, res, next) {
 
    var id = req.session.iduser;
    const {coment, idart} = req.body;
    comModel
      .insertar(coment, id, idart)
      .then( () => {
          res.redirect("/ver/"+idart);
      })
      .catch( err => {
          
          return res.status(500).send(err);
      });
});

router.get('/misventas', function (req, res, next) {
  var fecha_ini = '';
  var fecha_fin = '';
  if(req.session.loggedin)
  {
    var id = req.session.iduser;
    if(req.body.fecha_ini && req.body.fecha_fin)
    {
        fecha_ini = req.body.fecha_ini;
        fecha_fin = req.body.fecha_fin;
    }
    userModel.obtenerVentas(id,fecha_ini,fecha_fin)
    .then(compras => {
        res.render('articulo/ventas',{compras: compras});
    })
    .catch( err => { 
      return res.status(500).send("Error obteniendo productos");
    });

  }else{
    res.redirect('/login');
  }
});

router.post('/buscar', function (req, res, next) {

    var id = req.session.iduser;
    fecha_ini = req.body.fecha_ini;
    fecha_fin = req.body.fecha_fin;
    userModel.obtenerVentasFecha(id,fecha_ini.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1'),fecha_fin.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1'))
    .then(compras => {
        console.log(compras);
        res.render('articulo/busqueda',{compras: compras});
    })
    .catch( err => { 
      return res.status(500).send(err);
    });

});

module.exports = router;
