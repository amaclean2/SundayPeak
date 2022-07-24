USE friends;

CREATE TABLE users(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    is_premium TINYINT,
    sex INT,
    user_site VARCHAR(100),
    password VARCHAR(255),
    city VARCHAR(100),
    bio TEXT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE followers(
    id INT AUTO_INCREMENT,
    follower_id INT,
    leader_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(leader_id) REFERENCES users(id)
);

CREATE TABLE adventures(
    id INT AUTO_INCREMENT,
    adventure_type VARCHAR(100),
    adventure_name VARCHAR(100),
    approach_distance VARCHAR(50),
    season VARCHAR(50),
    avg_angle VARCHAR(50),
    max_angle VARCHAR(50),
    difficulty VARCHAR(50),
    elevation VARCHAR(50),
    gear VARCHAR(50),
    gain VARCHAR(50),
    bio TEXT,
    nearest_city VARCHAR(100),
    creator_id INT,
    coordinates_lat FLOAT,
    coordinates_lng FLOAT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(id),
    FOREIGN KEY(creator_id) REFERENCES users(id)
);

CREATE TABLE adventure_editors(
    id INT AUTO_INCREMENT,
    editor_id INT,
    adventure_id INT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(editor_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE ticks(
    id INT AUTO_INCREMENT,
    creator_id INT,
    adventure_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE activities(
    id INT AUTO_INCREMENT,
    creator_id INT,
    adventure_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE password_reset_tokens(
    id INT AUTO_INCREMENT,
    email VARCHAR(100),
    reset_token VARCHAR(255),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);