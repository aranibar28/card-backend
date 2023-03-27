const { response } = require('express');
const Category = require('../models/category');

const create_category = async (req, res = response) => {
  let data = req.body;
  try {
    let reg = await Category.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const search_categories = async (req, res = response) => {
  const { page = 1, limit = 10, search = '', status, order } = req.query;
  const sort = order == 'desc' ? 1 : -1;

  try {
    const query = {
      title: { $regex: search, $options: 'i' },
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

    let reg = await Category.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_categories = async (req, res = response) => {
  try {
    let reg = await Category.find().sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_category_by_id = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Category.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_category = async (req, res = response) => {
  let id = req.params['id'];
  let data = req.body;

  try {
    let reg = await Category.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_category = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Category.findByIdAndDelete(id, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_category,
  read_categories,
  search_categories,
  read_category_by_id,
  update_category,
  delete_category,
};
