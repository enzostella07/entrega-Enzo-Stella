import fs from "fs"

class ProductManager {
  constructor() {
    this.path = "./src/productos.json";
  }

  async addProduct(product) {
    try {
      //Para no copiar el mismo codigo, me traigo la linea haciendo esto:
      let products = await this.getProducts();
      
      // ¿existe el producto?
      if (products.some((prod) => prod.code === product.code)) {
        return "Product exists";
      }
      
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
        
      // Else, push product
      let id = products.length ? products[products.length - 1].id + 1 : 1
      product = { id: 4, ...product };
      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return product;
    } catch (e) {
      throw new Error (e)
    }
  }

  async getProducts() {
    let products = [];
    try {
      if (fs.existsSync(this.path)) {
        const fileData = await fs.promises.readFile(this.path, "utf-8");
        products = JSON.parse(fileData);
      }
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      let products = await this.getProducts();
      const productFound = products.find((product) => product.id == id);
      if (!productFound) {
        throw new Error("product not found")
      }
      return productFound;
    } catch (error) {
      throw new Error (error)
    }
  }
    // me fijo si existe el producto

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
export default ProductManager;