'use strict';

const Datastore = require('nedb');
const configuation = require('./configuration');

const database = {};
database.categories = new Datastore({ filename: `${configuation.database}/categories.db`, autoload: true });
database.answers = new Datastore({ filename: `${configuation.database}/answers.db`, autoload: true });

exports.categories = (fun) => {
  database.categories.find({}, (err, docs) => {
    console.log('[info] Sending list of categories');
    fun(docs);
  });
};

exports.addCategory = (name, detail, fun) => {
  database.categories.find({name}, (err, docs) => {
    if (docs.length > 0) {
      const message = `[warn] Error in adding category ${name} because category with this name exist!`;
      console.log(message);
      fun(false, message);
    } else {
      const message = `[info] Successfully adding category ${name}!`;
      database.categories.insert({name, detail});
      console.log(message);
      fun(true, message)
    }
  });
};

exports.addAnswer = (name, detail, category, photos, files, fun) => {
  database.answers.find({name}, (err, docs) => {
    if (docs.length > 0) {
      const message = `[warn] Error in adding answer ${name} because answer with this name exist!`;
      console.log(message);
      fun(false, message, {});
    } else {
      database.categories.find({name: category}, (err, docs) => {
        if (docs.length > 0) {
          database.answers.insert({name, detail, category, photos, files});
          const message = `[info] Successfully adding answer ${name}!`;
          console.log(message);
          fun(true, message, {});
        } else {
          const message = `[warn] Error in adding answer ${name} because category ${category} doesn't exist!`;
          console.log(message);
          fun(false, message, {});
        }
      });
    }
  });
};

exports.answers = (category, fun) => {
  database.answers.find({category}, (err, docs) => {
    const message = `[info] Sending list of answers from ${category}!`;
    console.log(message);
    fun(true, message, docs);
  });
}

exports.deleteCategory = (name) => {
  database.categories.remove({name});
  database.answers.remove({category: name});
}

exports.deleteAnswer = (name) => {
  database.answers.remove({name});
}