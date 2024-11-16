import sql from '../config/sqlServerConfig';
import mysql from 'mysql2/promise';

// Configuração para conectar ao MySQL diretamente no script
const mysqlConfig = {
  host: 'localhost',
  user: 'dtc_saga',
  password: '179856',
  database: 'db_st_ettfirst',
  port: 3308,
};

async function syncParceirosUnicos() {
  let sqlConnection: any;
  let mysqlConnection: any;

  try {
    // Conectar ao SQL Server e armazenar a conexão
    sqlConnection = await sql.connect({
      user: 'datacampos',
      password: '6h1U$u0-VM@O',
      database: 'CorporeRm-Lugarh',
      server: '200.142.111.10',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    const result = await sqlConnection.query(`
      SELECT DISTINCT DESCRICAO_SECAO AS nome_parceiro, CODCOLIGADA AS coligada_id
      FROM dbo.ZPWPortalCliente
    `);
    const empresasParceiras = result.recordset;

    // Conectar ao MySQL e armazenar a conexão
    mysqlConnection = await mysql.createConnection(mysqlConfig);

    for (const empresa of empresasParceiras) {
      const { nome_parceiro, coligada_id } = empresa;

      // Inserir o registro apenas se ele não existir, com o nome_parceiro correto
      await mysqlConnection.execute(`
        INSERT IGNORE INTO controle_acesso_parceiros (nome_parceiro, coligada_id, status_acesso)
        VALUES (?, ?, TRUE)
      `, [nome_parceiro, coligada_id]);
    }

    console.log('Empresas parceiras sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar empresas parceiras:', error);
  } finally {
    // Fechar a conexão do SQL Server, se existir
    if (sqlConnection) {
      await sqlConnection.close();
    }
    // Fechar a conexão do MySQL, se existir
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

syncParceirosUnicos();
