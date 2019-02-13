'use strict';

const express = require('express');
const configuration = require('./configuration');
const database = require('./database');
const sha256 = require('sha256');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : `${configuration.database}/${configuration.files}/`
}));

class Answer {
  constructor(status, comment, object = {}) {
    this.result = {status, comment, object}
  }
}

class Authorization {
  constructor(password, response, fun) {
    this.action = () => {
      if (password) {
        if (sha256(password) === configuration.password) {
          fun();
        } else {
          const message = `[warn] Error authorization with password ${password}`;
          console.log(message);
          response.send(new Answer(false, message).result);
        }
      } else {
        const message = `[warn] Error authorization without password`;
        console.log(message);
        response.send(new Answer(false, message).result);
      }
    };
  }
}

app.post('/categories/add', (request, response) => {
  const authorization = new Authorization(request.query.password, response, () => {
    const name = request.query.name;
    let detail = '';
    if (request.query.detail) {
      detail = request.query.detail;
    }
    database.addCategory(name, detail, (status, comment) => {
      response.send(new Answer(status, comment).result);
    });
  });
  authorization.action();
});

app.post('/categories', (request, response) => {
  database.categories((docs) => {
    response.send(new Answer(true, '', docs).result);
  });
});

app.post('/answer/add', (request, response) => {

  new Authorization(request.query.password, response, () => {

    const name = request.query.name;
    const detail = request.query.detail;
    const category = request.query.category;

    let files = undefined;
    let photos = undefined;
    if (request.files) {
      files = request.files.files;
      if (files && Array.isArray(files)) {
        files = files.map(file => {
          return { name: file.name, path: file.tempFilePath };
        });
      } else {
        files = { name: files.name, path: files.tempFilePath }
      }

      let photos = request.files.photos;
      if (photos && Array.isArray(photos)) {
        photos = photos.filter(photo => photo.mimetype.includes('image'))
                        .map(photo => {
                          return { name: photo.name, path: photo.tempFilePath };
                        });
      } else {
        photos = { name: photos.name, path: photos.tempFilePath }
      }
    
    }
    
    database.addAnswer(name, detail, category, photos, files, (status, comment, result) => {
      response.send(new Answer(status, comment, result).result);
    });

  }).action();
});

app.post('/answers', (request, response) => {
  database.answers(request.query.category, (status, comment, result) => {
    response.send(new Answer(status, comment, result).result);
  });
});

app.post('/file', (request, response) => {
  response.sendFile(request.query.path);
  console.log(`[info] Success sending file ${request.query.path}`);
});

app.post('/category/delete', (request, response) => {
  new Authorization(request.query.password, response, () => {
    const name = request.query.name;
    database.deleteCategory(name);
    response.send(new Answer(true, '').result)
    console.log(`[info] Success deleting category ${name}`);
  }).action();
});

app.post('/answer/delete', (request, response) => {
  new Authorization(request.query.password, response, () => {
    const name = request.query.name;
    database.deleteAnswer(name);
    response.send(new Answer(true, '').result)
    console.log(`[info] Success deleting answer ${name}`);
  }).action();
});

app.listen(configuration.port, () => {
  console.log(`[info] Server was started on port ${configuration.port} and use database from ${configuration.database}.`);
});