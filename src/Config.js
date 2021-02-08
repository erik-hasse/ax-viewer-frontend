var api_url = 'api'
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  api_url = 'http://erik-carbon.local:8080';
}


var static_url = 'static_files'
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  static_url = 'http://erik-carbon.local:8000';
}

module.exports = { api_url, static_url };
