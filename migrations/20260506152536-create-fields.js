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
    'fields',
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
      label: {
        type: 'string',
        length: 255,
        notNull: true,
      },
      type: {
        type: 'enum',
        length: "'text','number','date','color','select'",
        notNull: true,
      },
      order: {
        type: 'int',
        notNull: true,
        defaultValue: 0,
      },
      required: {
        type: 'boolean',
        notNull: true,
        defaultValue: false,
      },
      options: {
        type: 'json',
        notNull: false,
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
  return db.dropTable('fields');
};

exports._meta = {
  "version": 1
};
