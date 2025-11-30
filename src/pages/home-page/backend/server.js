const express = require('express');
const cors = require('cors');
const config = require('./config');
const medicalRoutes = require('./routes/medical');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/medical', medicalRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Medical Emergency Services API' });
});

app.listen(config.PORT, () => {
  console.log(`🚑 Medical Emergency Server running on port ${config.PORT}`);
});