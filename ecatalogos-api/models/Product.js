const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Image = require('../models/Image');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(8000),
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    subcategory: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    prompt_delivery: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_erp: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    brand_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    deadline_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
    },
    deleted: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
    },
    variant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'products',
    timestamps: false,
});

Product.hasMany(Image, { foreignKey: 'product_id', as: 'images' });
Image.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = Product;
