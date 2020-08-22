CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "path" TEXT NOT NULL
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "file_id" INT REFERENCES files(id)
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp DEFAULT NOW()
);

-- If chef or user get deleted, recipe is deleted as well
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "ingredients" TEXT[] NOT NULL,
  "preparation" TEXT[] NOT NULL,
  "information" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  
  "chef_id" INT NOT NULL
    REFERENCES chefs(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  
  "user_id" INT NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,

  "recipe_id" INT NOT NULL 
    REFERENCES recipes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  "file_id" INT NOT NULL
    REFERENCES files(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- FOREIGN KEY
-- ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
-- 
-- ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
-- ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
-- 
-- ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");
-- ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- CREATE PROCEDURE
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CASCADE WHEN DELETE
-- ALTER TABLE "chefs"
-- DROP CONSTRAINT chefs_file_id_fkey,
-- ADD CONSTRAINT chefs_file_id_fkey
-- FOREIGN KEY ("file_id")
-- REFERENCES "files" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "files"
-- DROP CONSTRAINT files_product_id_fkey,
-- ADD CONSTRAINT files_product_id_fkey
-- FOREIGN KEY ("product_id")
-- REFERENCES "products" ("id")
-- ON DELETE CASCADE;