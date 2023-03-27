const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const { uploadImage, deleteImage } = require('../middlewares/cloudinary');
const fs = require('fs');

const upload_image = async (req, res = response) => {
  const id = req.params['id'];
  const entityType = req.params.type;
  const validEntityTypes = ['users', 'categories', 'products'];

  if (!validEntityTypes.includes(entityType)) {
    return res.json({ msg: 'No es un tipo válido' });
  }

  if (req.files) {
    const tempFilePath = req.files.image.tempFilePath;
    const image = await uploadImage(tempFilePath, entityType);
    let reg;

    switch (entityType) {
      case 'products':
        reg = await updateEntityImage(id, Product, image, tempFilePath);
        break;
      case 'categories':
        reg = await updateEntityImage(id, Category, image, tempFilePath);
        break;
      case 'users':
        reg = await updateEntityImage(id, User, image, tempFilePath);
        break;
    }
    return res.json({ data: reg });
  }
};

const updateEntityImage = async (id, Model, image, tempFilePath) => {
  let entity = await Model.findById(id);
  if (!entity) {
    throw new Error(`No se encontró una entidad ${Model.modelName} con ID ${id}`);
  }
  let updatedEntity = await Model.findByIdAndUpdate(id, { image }, { new: true });
  fs.unlinkSync(tempFilePath);
  if (entity.image.public_id) {
    await deleteImage(entity.image.public_id);
  }
  return updatedEntity;
};

module.exports = {
  upload_image,
};
