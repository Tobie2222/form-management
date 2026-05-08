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
    'forms',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      title: {
        type: 'string',
        length: 255,
        notNull: true,
      },
      description: {
        type: 'text',
        notNull: false,
      },
      order: {
        type: 'int',
        notNull: true,
        defaultValue: 0,
      },
      status: {
        type: 'enum',
        length: "'active','draft'",
        notNull: true,
        defaultValue: 'draft',
      },
      created_at: {
        type: 'datetime',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'datetime',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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
  return db.dropTable('forms');
};

exports._meta = {
  "version": 1
};
