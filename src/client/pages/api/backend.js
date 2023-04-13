import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    // 'http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com/',
    'http://localhost:3000/'
});

// Returns an object of structure `{ token: string; violations: string[] }`
export const invoiceCreate = async (data) => {
  console.log(data);
  const axiosResponse = await axiosInstance.post(
    'frontend/invoice/create',
    data,
  );

  return axiosResponse.data;
};

export const invoiceRender = async (token) => {
  const axiosResponse = await axiosInstance.get('frontend/invoice/render', {
    params: { token },
  });

  return axiosResponse.data;
};
