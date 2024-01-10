CREATE TABLE users(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	name text NOT NULL,
	email text NOT NULL UNIQUE,
	password text NOT NULL,
	image text NOT NULL
);
CREATE TABLE sessions(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	token text NOT NULL UNIQUE,
	"userId"  integer NOT NULL REFERENCES "users"("id")
);

CREATE TABLE posts(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	url text NOT NULL,
	"description" text,
	"userId"  integer NOT NULL REFERENCES "users"("id")
);

CREATE TABLE "userComments"(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	"commentText" text NOT NULL,
	"postId" integer NOT NULL REFERENCES "posts"("id"),
	"userId"  integer NOT NULL REFERENCES "users"("id")
);

CREATE TABLE likes(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	"postId" integer NOT NULL REFERENCES "posts"("id"),
	"userId"  integer NOT NULL REFERENCES "users"("id"),
	UNIQUE ("postId","userId")
);
CREATE TABLE hashtags(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	name text NOT NULL UNIQUE
);

CREATE TABLE "hashtagPost"(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	"postId" integer NOT NULL REFERENCES "posts"("id"),
	"hashtagId"  integer NOT NULL REFERENCES "hashtags"("id"),
	UNIQUE ("hashtagId","postId")
);

CREATE TABLE follow(
	id serial NOT NULL PRIMARY KEY,
	"createdAt" TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
	"followerId"  integer NOT NULL REFERENCES "users"("id"),
	"followedId"  integer NOT NULL REFERENCES "users"("id")
);


