import axios, { AxiosStatic } from 'axios';

const mockAxios = axios as AxiosStatic & jest.MockInstance<any, any>;
export default mockAxios;
