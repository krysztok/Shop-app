CREATE DATABASE "shop-app-clients";
\c "shop-app-clients";

CREATE TABLE IF NOT EXISTS Users (
id SERIAL PRIMARY KEY,
email varchar(60) NOT NULL,
password varchar(250) NOT NULL,
role varchar(6) NOT NULL,
name varchar(15) NOT NULL,
surname varchar(40) NOT NULL,
phoneNumber varchar(40) NOT NULL,
city varchar(40) NOT NULL,
street varchar(60) NOT NULL,
number varchar(10) NOT NULL,
active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO Users
        (email, password, role, name, surname, phoneNumber, city, street, number)
    VALUES
		('admin', '$2a$10$Uq2sAOx.Ehr0FaDJ51wpi.xxEym.nBdBisfuSAU8UGlQgPjiN8Rzy', 'ADMIN', 'admin', 'admin', '123456789', 'admin', 'admin', 'a'),
        ('aa@aa.aa', '$2a$10$0hH.1hJSL814PviP.iu7euCsPijHPKcRXXGk3CCMuXDtS8fbhXxlO', 'CLIENT', 'Aname', 'Asurname', '123456789', 'Acity', 'Astreet', 'a1'),
        ('bb@bb.bb', '$2a$10$0hH.1hJSL814PviP.iu7euCsPijHPKcRXXGk3CCMuXDtS8fbhXxlO', 'CLIENT', 'Bname', 'Bsurname', '223456789', 'Bcity', 'Bstreet', 'b1'),
        ('cc@cc.cc', '$2a$10$0hH.1hJSL814PviP.iu7euCsPijHPKcRXXGk3CCMuXDtS8fbhXxlO', 'CLIENT', 'Cname', 'Csurname', '323456789', 'Ccity', 'Cstreet', 'c1'),
        ('dd@dd.dd', '$2a$10$0hH.1hJSL814PviP.iu7euCsPijHPKcRXXGk3CCMuXDtS8fbhXxlO', 'CLIENT', 'Dname', 'Dsurname', '423456789', 'Dcity', 'Dstreet', 'd1'),
        ('ee@ee.ee', '$2a$10$0hH.1hJSL814PviP.iu7euCsPijHPKcRXXGk3CCMuXDtS8fbhXxlO', 'CLIENT', 'Ename', 'Esurname', '523456789', 'Ecity', 'Estreet', 'e1');


Select * from Users