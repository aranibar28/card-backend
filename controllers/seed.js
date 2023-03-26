const { response } = require('express');
const { admin } = require('../utils/data');

const User = require('../models/user');

const seed_data = async (req, res = response) => {
  try {
    let existData = await User.count();
    if (!existData) {
      await User.create(admin);
      return res.json({ msg: 'Data seeded successfully.' });
    } else {
      return res.json({ msg: 'Data already exists.' });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  seed_data,
};
