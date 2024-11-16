import axios from 'axios';

const baseUrl = 'https://sms.comtele.com.br/api/v2';
const apiKey = '31d338e7-c7a9-41f7-b335-78de120d6e1d'; // Chave de API direto no código (não recomendado para produção)

// Função para enviar SMS simples
export const sendSms = async (phoneNumber: string, content: string): Promise<any> => {
  const payload = {
    Receivers: phoneNumber,
    Content: content,
  };

  try {
    const response = await axios.post(`${baseUrl}/send`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'auth-key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    throw error;
  }
};

// Função para enviar token SMS com expiração
export const sendToken = async (phoneNumber: string, prefix: string = 'Limport os:'): Promise<any> => {
  const payload = {
    PhoneNumber: phoneNumber,
    Prefix: prefix,
    ExpireInMinutes: 1,
  };

  try {
    const response = await axios.post(`${baseUrl}/tokenmanager`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'auth-key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar token SMS:', error);
    throw error;
  }
};

// Função para validar token SMS
export const validateToken = async (tokenCode: string, phoneNumber: string): Promise<any> => {
  const payload = {
    TokenCode: tokenCode,
    PhoneNumber: phoneNumber,
  };

  try {
    const response = await axios.put(`${baseUrl}/tokenmanager`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'auth-key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    throw error;
  }
};
