BEGIN TRANSACTION;

-- email: test@0721.com, password:123
INSERT INTO users (name, email, entries, joined, pet, age ) values ('test-docker-0721', 'test@0721.com', 5, '2020-07-21','cat',5);
INSERT INTO login (hash, email ) values ('$2a$10$KqWcUNkhvZXYQcxcbSxhCeyTFA.s0/fHR2xXhsi58//jmWvPqGA8W', 'test@0721.com');

-- email: 1@1.com, password:1
INSERT INTO users (name, email, entries, joined, pet, age ) values ('test-docker-0725', '1@1.com', 725, '2020-07-25','dog',725);
INSERT INTO login (hash, email ) values ('$2a$10$2sgCIi/Tf6rDOVF0LuSN2O9Y/6IV6BPoeQ5mMXcu84B2PQghcG4My', '1@1.com');

-- email: 2@2.com, password:1
INSERT INTO users (name, email, entries, joined, pet, age ) values ('test-docker-0728', '2@2.com', 0, '2020-07-28','koi',0);
INSERT INTO login (hash, email ) values ('$2a$10$2sgCIi/Tf6rDOVF0LuSN2O9Y/6IV6BPoeQ5mMXcu84B2PQghcG4My', '2@2.com');

COMMIT;