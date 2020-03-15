const HttpStatusCodes = require('http-status-codes');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await req.db.User.findOne({
      email,
      password
    });

    if (!user) {
      return res.message(HttpStatusCodes.NOT_FOUND, 'User not found!');
    }

    return res.success(HttpStatusCodes.OK, {
      user
    });
  } catch (error) {
    return res.error(error);
  }
};

const register = async (req, res) => {
  try {
    const existingUser = await req.db.User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      return res.message(HttpStatusCodes.CONFLICT, 'User already exists!');
    }

    const user = await req.db.User.create(req.body);

    return res.success(HttpStatusCodes.CREATED, {
      user
    });
  } catch (error) {
    return res.error(error);
  }
};

module.exports = {
  login,
  register
};
