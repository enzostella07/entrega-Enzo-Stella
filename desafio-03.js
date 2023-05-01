const fs = require("fs");
const { json } = require("node:stream/consumers");

class ProductManager {
  constructor(path) {
    this.currentId = 0;
    this.path = path;
  }
  async addProduct(product) {
    // propiedades del producto
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return console.log("error");
    }

    //Para no copiar el mismo codigo, me traigo la linea haciendo esto:
    let products = await this.getProducts();

    if (fs.existsSync(this.path)) {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      products = JSON.parse(fileData);
    }

    // ¿existe el producto?
    if (products.some((prod) => prod.code === product.code)) {
      return "Product exists";
    }

    // Else, push product
    product = { id: this.currentId++, ...product };
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async getProducts() {
    let products = [];
    if (fs.existsSync(this.path)) {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      products = JSON.parse(fileData);
    }
    return products;
  }

  async getProductById(id) {
    // me fijo si existe el producto
    let products = await this.getProducts();
    const productFound = products.find((product) => product.id == id);
    if (!productFound) {
      return `products whit id ${id} is not found`;
    }
    return `products found`;
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    if (!products.some((product) => product.id === id)) {
      return "product whit id not found";
    }
    const newProducts = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newProducts, null, 2)
    );
  }

  async updateProduct(id, newProductData) {
    //obtengo la lista de productos
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return `product whit id: ${id}. not found`;
    }

    //actualizo
    products[productIndex] = {
      ...products[productIndex],
      ...newProductData,
    };

    //guardo los cambios en el archivo
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[productIndex];
  }
}
test();
async function test() {
  const myProductManager = new ProductManager("productos.json");
  // Muestro mis productos
  console.log(await myProductManager.getProducts());
  // creo product1
  const product1 = {
    title: "producto prueba",
    description: "Este es un producto prueba 1",
    price: 200,
    thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Felegifruta.com.ar%2Fconoce-los-beneficios-la-manzana-roja%2F&psig=AOvVaw3ZoyMadHJJjv4WH659_PVq&ust=1681427965337000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNCnq5y9pf4CFQAAAAAdAAAAABAE",
    code: "abc123",
    stock: 25,
  };
  // agrego el producto y espero a que guarde los datos en el data file
  console.log(await myProductManager.addProduct(product1));
  // muestro mis productos actuales. debe devolver un producto por primera vez. la segunda vez debe devolver 2 productos.
  console.log(await myProductManager.getProducts());
  // checkeo producto por su id. retorna product1
  console.log(await myProductManager.getProductById(0));
  // creo algunos campos para actualizar
  const productOneUpdates = {
    title: "Nombre actualizado",
    description: "Descripción actualizada",
  };
  // Update product1
  console.log(await myProductManager.updateProduct(1, productOneUpdates));
}