const { response } = require('express');
const { titleCase } = require('../utils/functions');

const User = require('../models/user');
const jwt = require('../utils/jwt');
const bcrypt = require('bcryptjs');

const create_user = async (req, res = response) => {
  const { email, password, ...data } = req.body;
  try {
    let exist_email = await User.findOne({ email });
    if (exist_email) {
      return res.json({ msg: 'Este correo ya se encuentra registrado.' });
    } else {
      data.email = email;
      data.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
      data.full_name = titleCase(data.first_name + ' ' + data.last_name);
      let reg = await User.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const search_users = async (req, res = response) => {
  const { page = 1, limit = 10, search = '', status, order } = req.query;
  const sort = order == 'desc' ? 1 : -1;

  try {
    const query = {
      full_name: { $regex: search, $options: 'i' },
      status: { $ne: null },
    };

    if (status) {
      query.status = status;
    }

    const options = {
      page,
      limit,
      sort: { created_at: sort },
    };

    let reg = await User.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_users = async (req, res = response) => {
  try {
    let reg = await User.find().sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_user_by_id = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await User.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_user = async (req, res = response) => {
  let id = req.params['id'];

  try {
    const user = await User.findById(id);
    const { email, password, ...data } = req.body;

    if (user.email != email) {
      var exist_email = await User.findOne({ email });
      if (exist_email) {
        return res.json({ msg: 'Este correo ya se encuentra registrado.' });
      } else {
        data.email = email;
      }
    }

    if (password) {
      data.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    }

    data.full_name = titleCase(data.first_name + ' ' + data.last_name);
    let reg = await User.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_user = async (req, res = response) => {
  let id = req.params['id'];
  try {
    if (req.id === id) {
      return res.json({ msg: 'No puedes eliminar un usuario con sesión iniciada.' });
    }
    let reg = await User.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const login_user = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: 'El correo o la contraseña son incorrectos.' });
    } else {
      let valid_password = bcrypt.compareSync(password, user.password);
      if (!valid_password) {
        return res.json({ msg: 'El correo o la contraseña son incorrectos.' });
      } else {
        let token = await jwt.createToken(user);
        return res.json({ data: user, token });
      }
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const renew_token = async (req, res = response) => {
  try {
    let id = req.id;

    let user = await User.findById(id);

    if (!user) {
      return res.json({ msg: 'Usuario not found.' });
    }

    let token = await jwt.createToken(user);

    return res.json({ data: user, token });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_user,
  read_users,
  search_users,
  read_user_by_id,
  update_user,
  delete_user,
  login_user,
  renew_token,
};
