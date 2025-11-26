import "dotenv/config.js";
import app from './app.js';
const PORT = 3002;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3001');
});
