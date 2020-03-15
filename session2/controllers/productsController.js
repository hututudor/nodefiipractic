const HttpStatusCode = require('http-status-codes');

const {
  mongo: { ObjectId }
} = require('mongoose');

const getProducts = async (req, res) => {
  try {
    const products = await req.db.Product.find({});

    return res.success(HttpStatusCode.OK, {
      products
    });
  } catch (error) {
    return res.error(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await req.db.Product.create(req.body);

    return res.success(HttpStatusCode.CREATED, {
      product
    });
  } catch (error) {
    return res.error(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await req.db.Product.findOne({
      _id: ObjectId(productId)
    });

    if (!product) {
      return res.message(HttpStatusCode.NOT_FOUND, 'Product not found!');
    }

    await req.db.Product.updateOne(
      {
        _id: ObjectId(productId)
      },
      req.body
    );

    const newProduct = await req.db.Product.findOne({
      _id: ObjectId(productId)
    });

    return res.success(HttpStatusCode.OK, {
      product: newProduct
    });
  } catch (error) {
    return res.error(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await req.db.Product.findOne({
      _id: ObjectId(productId)
    });

    if (!product) {
      return res.message(HttpStatusCode.NOT_FOUND, 'Product not found!');
    }

    await req.db.Product.deleteOne({
      _id: ObjectId(productId)
    });

    return res.success(HttpStatusCode.NO_CONTENT, {
      success: true
    });
  } catch (error) {
    return res.error(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
