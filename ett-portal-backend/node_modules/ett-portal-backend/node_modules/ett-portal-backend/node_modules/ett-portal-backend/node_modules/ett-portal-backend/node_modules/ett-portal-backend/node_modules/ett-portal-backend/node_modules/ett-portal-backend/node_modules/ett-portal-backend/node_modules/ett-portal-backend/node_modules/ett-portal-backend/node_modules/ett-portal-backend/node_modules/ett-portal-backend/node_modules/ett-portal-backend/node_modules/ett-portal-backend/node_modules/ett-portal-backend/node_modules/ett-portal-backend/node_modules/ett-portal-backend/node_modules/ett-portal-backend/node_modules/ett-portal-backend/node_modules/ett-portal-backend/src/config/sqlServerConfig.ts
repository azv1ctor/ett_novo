// src/config/sqlServerConfig.ts
import sql from 'mssql';

const sqlServerConfig = {
  user: process.env.SQL_SERVER_USER || 'datacampos',
  password: process.env.SQL_SERVER_PASSWORD || '6h1U$u0-VM@O',
  database: process.env.SQL_SERVER_DB || 'CorporeRm-Lugarh',
  server: process.env.SQL_SERVER_HOST || '200.142.111.10',
  port: parseInt(process.env.SQL_SERVER_PORT || '1433', 10),
  options: {
      encrypt: false,
      trustServerCertificate: true,
  },
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
  },
  requestTimeout: 300000, // Timeout temporário de 2 minutos
};



export const connectToSqlServer = async () => {
    try {
        await sql.connect(sqlServerConfig);
        console.log('Conectado ao SQL Server com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao SQL Server:', error);
    }
};

export { sqlServerConfig };
export default sql;
