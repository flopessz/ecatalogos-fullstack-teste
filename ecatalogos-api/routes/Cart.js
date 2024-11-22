const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Image = require('../models/Image');

router.post('/', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'A lista de IDs é inválida ou está vazia.' });
  }

  try {
    const products = await Product.findAll({
      where: { id: ids },
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['path', 'company_key'],
        },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado.' });
    }

    const formattedProducts = products.map((product) => ({
      ...product.toJSON(),
      images: product.images.map((image) => ({
        link: `https://fazolin.api.forca-de-vendas.integrador.e-catalogos.net/images/${image.company_key}/${image.path}`,
      })),
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
});

module.exports = router;
