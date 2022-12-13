CREATE TABLE users(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    is_premium TINYINT,
    sex INT,
    user_site VARCHAR(100),
    password VARCHAR(255),
    city VARCHAR(100),
    bio TEXT,
    profile_picture_url VARCHAR(255),
    map_style VARCHAR(100),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE followers(
    follower_id INT,
    leader_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(follower_id, leader_id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(leader_id) REFERENCES users(id)
);

CREATE TABLE ski(
    id INT AUTO_INCREMENT,
    avg_angle FLOAT,
    max_angle FLOAT,
    approach_distance VARCHAR(50),
    aspect VARCHAR(3),
    difficulty INT,
    elevation VARCHAR(50),
    exposure INT,
    gain VARCHAR(50),
    gear VARCHAR(50),
    season VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE climb(
    id INT AUTO_INCREMENT,
    grade VARCHAR(50),
    first_ascent VARCHAR(255),
    pitches INT,
    protection VARCHAR(100),
    approach TEXT,
    climb_type VARCHAR(100),
    light_times VARCHAR(100),
    season VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE hike(
    id INT AUTO_INCREMENT,
    difficulty INT,
    elevation INT,
    distance FLOAT,
    season VARCHAR(100),
    gain INT,
    PRIMARY KEY(id)
);

CREATE TABLE adventures(
    id INT AUTO_INCREMENT,
    adventure_ski_id INT,
    adventure_hike_id INT,
    adventure_climb_id INT,
    adventure_name VARCHAR(100) NOT NULL,
    adventure_type VARCHAR(100) NOT NULL,
    bio TEXT,
    coordinates_lat FLOAT NOT NULL,
    coordinates_lng FLOAT NOT NULL,
    creator_id INT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nearest_city VARCHAR(100),
    public TINYINT NOT NULL,
    rating FLOAT,
    PRIMARY KEY(id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(adventure_ski_id) REFERENCES ski(id),
    FOREIGN KEY(adventure_climb_id) REFERENCES climb(id),
    FOREIGN KEY(adventure_hike_id) REFERENCES hike(id),
    CHECK ((adventure_ski_id IS NULL AND adventure_hike_id IS NULL AND adventure_climb_id IS NOT NULL)
    OR (adventure_ski_id IS NULL AND adventure_climb_id IS NULL AND adventure_hike_id IS NOT NULL)
    OR (adventure_climb_id IS NULL AND adventure_hike_id IS NULL AND adventure_ski_id IS NOT NULL))
);

CREATE TABLE adventure_editors(
    editor_id INT,
    adventure_id INT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(editor_id, date_updated),
    FOREIGN KEY(editor_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE ticks(
    creator_id INT,
    adventure_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(creator_id, adventure_id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE activities(
    creator_id INT,
    adventure_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    efforts INT,
    public TINYINT,
    PRIMARY KEY(creator_id, adventure_id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(adventure_id) REFERENCES adventures(id)
);

CREATE TABLE user_images(
    file_name VARCHAR(150),
    creator_id INT,
    adventure_id INT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    public TINYINT,
    PRIMARY KEY(file_name)
);

ALTER TABLE adventures ADD INDEX adventure_index (adventure_name);
ALTER TABLE adventures ADD INDEX adventure_type (adventure_type);

DROP TABLE user_images;
DROP TABLE password_reset_tokens;
DROP TABLE activities;
DROP TABLE ticks;
DROP TABLE adventure_editors;
DROP TABLE adventures;
DROP TABLE ski;
DROP TABLE climb;
DROP TABLE hike;
DROP TABLE followers;
DROP TABLE users;