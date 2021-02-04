var api_url = 'api'
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  api_url = 'http://192.168.0.110:8000';
}

export default api_url;
