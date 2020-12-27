const fetch = require('node-fetch');

const http = {
  async get({ url, token }) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    }).then((response) => response.json());
  },

  async post({ url, body, token }) {
    return fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    });
  },

  async patch({ url, body, token }) {
    return fetch(url, {
      method: 'PATCH',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    }).then((response) => response.json());
  },

  async remove({ url, token }) {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    }).then((response) => response.json());
  },
};

module.exports = http;
