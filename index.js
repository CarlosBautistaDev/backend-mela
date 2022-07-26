const express = require("express");
const app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
app.use(cors());

// FUNCTIONS

// Establecer Author
const setAuthor = {
  name: "Carlos",
  lastname: "Bautista",
};
// Establecer decimales en base a la moneda
const setDecimals = (current) => {
  if (current === "ARS") {
    return 2;
  } else {
    return 2;
  }
};

// Obtener lista completa
const obtenerListaProductos = (data) => {
  if (!data.length) return ["No hubo coincidencias"];
  const listaProductos = [];
  data.forEach((el) => {
    const producto = {};
    producto.id = el.id;
    producto.title = el.title;
    producto.price = {
      currency: el.currency_id,
      amount: el.price,
      decimals: setDecimals(el.currency_id),
    };
    producto.picture = el.thumbnail;
    producto.condition = el.condition;
    producto.free_shipping = el.shipping.free_shipping;
    listaProductos.push(producto);
  });
  return listaProductos;
};

const obtenerProducto = (data) => {
  if (!data) return ["No hubo coincidencias"];
  const producto = {};
  producto.id = data.id;
  producto.title = data.title;
  producto.price = {
    currency: data.currency_id,
    amount: data.price,
    decimals: setDecimals(data.currency_id),
  };
  producto.picture = data.thumbnail;
  producto.condition = data.condition;
  producto.free_shipping = data.shipping.free_shipping;
  producto.sold_quantity = data.sold_quantity;
  producto.description = "";
  return producto;
};

const obtenerCategorias = (datos) => {
  let allCats = [];
  if (datos.filters.length === 0) return (allCats = ["No hubo coincidencias"]);
  datos.filters.map((filters) =>
    filters.values.map((values) => {
      if (values.path_from_root.length) {
        values.path_from_root.map((pathFromRoot) => {
          if (pathFromRoot.name) {
            allCats.push(pathFromRoot.name);
          }
        });
      }
    })
  );
  return allCats;
};

/// END POINTS

// 1. Recibe el parametro de la consulta y se la busqueda, devuelve lista de 4 porductos
app.get("/api/items", async (request, response) => {
  var query = request.query;
  const url = `https://api.mercadolibre.com/sites/MLA/search?q=${query.search}`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    const listaCompleta = {
      author: {
        ...setAuthor,
      },
      categories: obtenerCategorias(result),
      items: obtenerListaProductos(result.results.slice(0, 4)),
    };
    response.send(listaCompleta);
  } catch (err) {
    console.log(err);
    response.status(404).end();
  }
});

// 2. Recibe consulta de la busqueda por id
app.get("/api/items/:id", async (request, response) => {
  var id = request.params.id;
  const url = `https://api.mercadolibre.com/items/${id}`;
  const urlDesc = `https://api.mercadolibre.com/items/${id}/description`;
  try {
    const res = await fetch(url);
    const reqDesc = await fetch(urlDesc);
    const result = await res.json();
    const resultDesc = await reqDesc.json();
    const productoCompleto = {
      author: {
        ...setAuthor,
      },
      items: obtenerProducto(result),
    };
    productoCompleto.description = resultDesc.plain_text;
    response.send(productoCompleto);
  } catch (err) {
    console.log(err);
    response.status(404).end();
  }
});



const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

