const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/Products');
const cartRoutes = require('./routes/Cart');
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});