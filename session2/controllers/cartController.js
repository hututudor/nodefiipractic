const HttpStatusCode = require('http-status-codes');
const {
  mongo: { ObjectId }
} = require('mongoose');

const createCart = async (req, res) => {
  try {
    const products = await req.db.Product.find({
      _id: req.body.products.map(id => ObjectId(id))
    });

    let price = 0;

    for (const product of products) {
      price += product.price;
    }

    const cart = await req.db.Cart.create({ ...req.body, value: price });

    return res.success(HttpStatusCode.CREATED, { cart });
  } catch (error) {
    return res.error(error);
  }
};

const getCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    cart.products = await req.db.Product.find({
      _id: cart.products.map(id => ObjectId(id))
    });

    const user = await req.db.User.findOne(
      {
        _id: ObjectId(cart.userId)
      },
      {
        password: 0
      }
    );

    return res.success(HttpStatusCode.OK, {
      cart: {
        ...cart.toObject(),
        user
      }
    });
  } catch (error) {
    return res.error(error);
  }
};

const getCarts = async (req, res) => {
  try {
    const carts = await req.db.Cart.find({});

    return res.success(HttpStatusCode.OK, { carts });
  } catch (error) {
    return res.error(error);
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    if (!cart) {
      return res.message(HttpStatusCode.NOT_FOUND, 'Cart not found!');
    }

    const products = await req.db.Product.find({
      _id: req.body.products.map(id => ObjectId(id))
    });

    let price = 0;

    for (const product of products) {
      price += product.price;
    }

    await req.db.Cart.updateOne(
      {
        _id: ObjectId(cartId)
      },
      { ...req.body, value: price }
    );

    const newCart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    return res.success(HttpStatusCode.OK, {
      cart: newCart
    });
  } catch (error) {
    console.error(error);
    return res.error(error);
  }
};

const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const {
      mongo: { ObjectId }
    } = require('mongoose');

    const cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    if (!cart) {
      return res.message(HttpStatusCode.NOT_FOUND, 'Cart not found!');
    }

    await req.db.Cart.deleteOne({
      _id: ObjectId(cartId)
    });

    return res.success(HttpStatusCode.NO_CONTENT, {});
  } catch (error) {
    return res.error(error);
  }
};

module.exports = {
  createCart,
  getCart,
  getCarts,
  updateCart,
  deleteCart
};
