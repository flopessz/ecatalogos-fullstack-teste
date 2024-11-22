const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Image = require('../models/Image');

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Image,
                    as: 'images',
                    attributes: ['path', 'company_key'],
                },
            ],
        });

        const formattedProducts = products.map(product => ({
            ...product.toJSON(),
            images: product.images.map(image => ({
                link: `https://fazolin.api.forca-de-vendas.integrador.e-catalogos.net/images/${image.company_key}/${image.path}`,
            })),
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).send('Erro ao buscar os produtos',error);
    }
});

module.exports = router;