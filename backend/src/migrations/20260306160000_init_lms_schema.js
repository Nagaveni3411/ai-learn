/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("email", 255).notNullable().unique().index();
    table.string("password_hash", 255).notNullable();
    table.string("name", 255).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("subjects", (table) => {
    table.bigIncrements("id").primary();
    table.string("title", 255).notNullable();
    table.string("slug", 255).notNullable().unique().index();
    table.text("description").nullable();
    table.boolean("is_published").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("sections", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("subject_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("subjects")
      .onDelete("CASCADE");
    table.string("title", 255).notNullable();
    table.integer("order_index").notNullable();
    table.timestamps(true, true);
    table.unique(["subject_id", "order_index"]);
    table.index(["subject_id", "order_index"]);
  });

  await knex.schema.createTable("videos", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("section_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sections")
      .onDelete("CASCADE");
    table.string("title", 255).notNullable();
    table.text("description").nullable();
    table.string("youtube_url", 1024).notNullable();
    table.integer("order_index").notNullable();
    table.integer("duration_seconds").nullable();
    table.timestamps(true, true);
    table.unique(["section_id", "order_index"]);
    table.index(["section_id", "order_index"]);
  });

  await knex.schema.createTable("enrollments", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .bigInteger("subject_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("subjects")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "subject_id"]);
  });

  await knex.schema.createTable("video_progress", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .bigInteger("video_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("videos")
      .onDelete("CASCADE");
    table.integer("last_position_seconds").notNullable().defaultTo(0);
    table.boolean("is_completed").notNullable().defaultTo(false);
    table.timestamp("completed_at").nullable();
    table.timestamps(true, true);
    table.unique(["user_id", "video_id"]);
  });

  await knex.schema.createTable("refresh_tokens", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("token_hash", 128).notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("revoked_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["user_id", "token_hash"]);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_tokens");
  await knex.schema.dropTableIfExists("video_progress");
  await knex.schema.dropTableIfExists("enrollments");
  await knex.schema.dropTableIfExists("videos");
  await knex.schema.dropTableIfExists("sections");
  await knex.schema.dropTableIfExists("subjects");
  await knex.schema.dropTableIfExists("users");
};
