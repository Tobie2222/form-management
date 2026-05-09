'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    'submissions',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      form_id: {
        type: 'int',
        notNull: true,
      },
      data: {
        type: 'json',
        notNull: true,
      },
      submitted_at: {
        type: 'datetime',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: 'datetime',
        notNull: false,
        defaultValue: null,
      },
    },
    callback,
  );
};

exports.down = function (db) {
  return db.dropTable('submissions');
};

exports._meta = {
  "version": 1
};
