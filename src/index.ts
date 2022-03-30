import 'dotenv/config';
import express from 'express';
import oracledb from 'oracledb';
import dbconfig from './db/dbconfig';
import routes from './router';

async function init() {
  try {
    console.log('Aguarde, criando pool');
    await oracledb.createPool(dbconfig);
    console.log('Pool Oracle criado');
  } catch (error) {
    console.log('Erro ao iniciar pool do Oracle');
  }
}

// const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: false, limit: '200mb' }));
app.use(routes);

app.listen(3000, () => {
  console.log(`Server iniciando... http://localhost:${3000}`);

  init();
});
