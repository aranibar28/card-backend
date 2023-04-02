const { response } = require('express');
const { deleteImage } = require('../middlewares/cloudinary');
const Product = require('../models/product');

const create_product = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_title = await Product.findOne({ title: data.title });

    if (exist_title) {
      return res.json({ msg: 'Este título ya se encuentra registrado.', exist: true });
    } else {
      let reg = await Product.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const search_products = async (req, res = response) => {
  const { page = 1, limit = 5, search = '' } = req.query;

  try {
    const query = {
      title: { $regex: search, $options: 'i' },
    };

    const options = {
      page,
      limit,
      populate: 'category',
      sort: { created_at: -1 },
    };

    let reg = await Product.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_products = async (req, res = response) => {
  try {
    let reg = await Product.find().sort({ created_at: -1 }).populate('category');
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_product_by_id = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Product.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_products_by_category = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Product.find({ category: id }).sort({ price: 1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_product = async (req, res = response) => {
  let id = req.params['id'];
  const { title, ...data } = req.body;

  try {
    const product = await Product.findById(id);

    if (product.title != title) {
      const exist_title = await Product.findOne({ title });
      if (exist_title) {
        return res.json({ msg: 'Este título ya se encuentra registrado.', exist: true });
      }
    }

    data.title = title;

    let reg = await Product.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_product = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Product.findByIdAndDelete(id);
    if (reg.image.public_id) {
      await deleteImage(reg.image.public_id);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_product,
  read_products,
  search_products,
  read_product_by_id,
  read_products_by_category,
  update_product,
  delete_product,
};
