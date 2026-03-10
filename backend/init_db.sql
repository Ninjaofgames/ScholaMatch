-- PostgreSQL database dump

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS school;
CREATE SCHEMA IF NOT EXISTS test;

DO $$ BEGIN
    CREATE TYPE analytics.polaritytype AS ENUM ('positive', 'negative', 'neutral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE analytics.sentimentlabel AS ENUM ('postive', 'negative', 'neutral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth.role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE school.educationlvl AS ENUM ('primary', 'secondary', 'high school', 'college');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE school.financialtype AS ENUM ('public', 'private', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE IF NOT EXISTS analytics.analysis (
    id_analysis integer NOT NULL,
    polarity analytics.polaritytype,
    id_comment integer NOT NULL,
    id_aspect integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS analytics.analysis_id_analysis_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE analytics.analysis_id_analysis_seq OWNED BY analytics.analysis.id_analysis;

CREATE TABLE IF NOT EXISTS analytics.aspect (
    id_aspect integer NOT NULL,
    aspect_name character varying(150) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS analytics.aspect_id_aspect_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE analytics.aspect_id_aspect_seq OWNED BY analytics.aspect.id_aspect;

CREATE TABLE IF NOT EXISTS analytics.comment (
    id_comment integer NOT NULL,
    data_source character varying(255),
    comment_date timestamp without time zone DEFAULT now(),
    comment_content text NOT NULL,
    sentiment_score double precision,
    sentiment_label analytics.sentimentlabel
);

CREATE SEQUENCE IF NOT EXISTS analytics.comment_id_comment_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE analytics.comment_id_comment_seq OWNED BY analytics.comment.id_comment;

CREATE TABLE IF NOT EXISTS analytics.mot_cle (
    id_mot_cle integer NOT NULL,
    content character varying(50) NOT NULL,
    id_school integer
);

CREATE SEQUENCE IF NOT EXISTS analytics.mot_cle_id_mot_cle_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE analytics.mot_cle_id_mot_cle_seq OWNED BY analytics.mot_cle.id_mot_cle;

CREATE TABLE IF NOT EXISTS analytics.school_comment (
    id_ecole integer NOT NULL,
    id_comment integer NOT NULL
);

CREATE TABLE IF NOT EXISTS auth."user" (
    id_user integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(500) NOT NULL,
    email character varying(150) NOT NULL,
    role auth.role,
    prenom character varying(100),
    nom character varying(100)
);

CREATE SEQUENCE IF NOT EXISTS auth.user_id_user_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE auth.user_id_user_seq OWNED BY auth."user".id_user;

CREATE TABLE IF NOT EXISTS school.school (
    id_school integer NOT NULL,
    school_name character varying(200) NOT NULL,
    place character varying(500) NOT NULL,
    image text,
    financial_type school.financialtype NOT NULL,
    education_type school.educationlvl NOT NULL,
    university_name character varying(200),
    teaching_language character varying(100) NOT NULL,
    website_link text,
    maps_link text,
    phone_number character varying(50),
    email character varying(150),
    description text
);

CREATE SEQUENCE IF NOT EXISTS school.school_id_school_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE school.school_id_school_seq OWNED BY school.school.id_school;

CREATE TABLE IF NOT EXISTS school.school_speciality (
    id_school integer NOT NULL,
    id_speciality integer NOT NULL
);

CREATE TABLE IF NOT EXISTS school.speciality (
    id_speciality integer NOT NULL,
    speciality_name text NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS school.speciality_id_speciality_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE school.speciality_id_speciality_seq OWNED BY school.speciality.id_speciality;

CREATE TABLE IF NOT EXISTS test.choice (
    id_choice integer NOT NULL,
    content text NOT NULL,
    id_question integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS test.choice_id_choice_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE test.choice_id_choice_seq OWNED BY test.choice.id_choice;

CREATE TABLE IF NOT EXISTS test.personality_test (
    id_test integer NOT NULL,
    criteria character varying(255)
);

CREATE SEQUENCE IF NOT EXISTS test.personality_test_id_test_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE test.personality_test_id_test_seq OWNED BY test.personality_test.id_test;

CREATE TABLE IF NOT EXISTS test.response_test (
    id_response integer NOT NULL,
    id_session integer NOT NULL,
    id_question integer NOT NULL,
    id_choice integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS test.response_test_id_response_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE test.response_test_id_response_seq OWNED BY test.response_test.id_response;

CREATE TABLE IF NOT EXISTS test.session_test (
    id_session integer NOT NULL,
    id_utilisateur integer NOT NULL,
    id_test integer NOT NULL,
    date date DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS test.session_test_id_session_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE test.session_test_id_session_seq OWNED BY test.session_test.id_session;

CREATE TABLE IF NOT EXISTS test.test_question (
    id_question integer NOT NULL,
    question_content text NOT NULL,
    id_test integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS test.test_question_id_question_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE test.test_question_id_question_seq OWNED BY test.test_question.id_question;

ALTER TABLE ONLY analytics.analysis ALTER COLUMN id_analysis SET DEFAULT nextval('analytics.analysis_id_analysis_seq'::regclass);
ALTER TABLE ONLY analytics.aspect ALTER COLUMN id_aspect SET DEFAULT nextval('analytics.aspect_id_aspect_seq'::regclass);
ALTER TABLE ONLY analytics.comment ALTER COLUMN id_comment SET DEFAULT nextval('analytics.comment_id_comment_seq'::regclass);
ALTER TABLE ONLY analytics.mot_cle ALTER COLUMN id_mot_cle SET DEFAULT nextval('analytics.mot_cle_id_mot_cle_seq'::regclass);
ALTER TABLE ONLY auth."user" ALTER COLUMN id_user SET DEFAULT nextval('auth.user_id_user_seq'::regclass);
ALTER TABLE ONLY school.school ALTER COLUMN id_school SET DEFAULT nextval('school.school_id_school_seq'::regclass);
ALTER TABLE ONLY school.speciality ALTER COLUMN id_speciality SET DEFAULT nextval('school.speciality_id_speciality_seq'::regclass);
ALTER TABLE ONLY test.choice ALTER COLUMN id_choice SET DEFAULT nextval('test.choice_id_choice_seq'::regclass);
ALTER TABLE ONLY test.personality_test ALTER COLUMN id_test SET DEFAULT nextval('test.personality_test_id_test_seq'::regclass);
ALTER TABLE ONLY test.response_test ALTER COLUMN id_response SET DEFAULT nextval('test.response_test_id_response_seq'::regclass);
ALTER TABLE ONLY test.session_test ALTER COLUMN id_session SET DEFAULT nextval('test.session_test_id_session_seq'::regclass);
ALTER TABLE ONLY test.test_question ALTER COLUMN id_question SET DEFAULT nextval('test.test_question_id_question_seq'::regclass);

DO $$ BEGIN
    ALTER TABLE ONLY analytics.analysis ADD CONSTRAINT analysis_pkey PRIMARY KEY (id_analysis);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.aspect ADD CONSTRAINT aspect_pkey PRIMARY KEY (id_aspect);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.comment ADD CONSTRAINT comment_pkey PRIMARY KEY (id_comment);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.mot_cle ADD CONSTRAINT mot_cle_pkey PRIMARY KEY (id_mot_cle);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY auth."user" ADD CONSTRAINT user_email_key UNIQUE (email);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY auth."user" ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY school.school ADD CONSTRAINT school_pkey PRIMARY KEY (id_school);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY school.speciality ADD CONSTRAINT speciality_pkey PRIMARY KEY (id_speciality);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.choice ADD CONSTRAINT choice_pkey PRIMARY KEY (id_choice);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.personality_test ADD CONSTRAINT personality_test_pkey PRIMARY KEY (id_test);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.response_test ADD CONSTRAINT response_test_pkey PRIMARY KEY (id_response);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.session_test ADD CONSTRAINT session_test_pkey PRIMARY KEY (id_session);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.test_question ADD CONSTRAINT test_question_pkey PRIMARY KEY (id_question);
EXCEPTION WHEN invalid_table_definition THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.analysis ADD CONSTRAINT analysis_id_aspect_fkey FOREIGN KEY (id_aspect) REFERENCES analytics.aspect(id_aspect) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.analysis ADD CONSTRAINT analysis_id_comment_fkey FOREIGN KEY (id_comment) REFERENCES analytics.comment(id_comment) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.mot_cle ADD CONSTRAINT mot_cle_id_school_fkey FOREIGN KEY (id_school) REFERENCES school.school(id_school) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.school_comment ADD CONSTRAINT school_comment_id_comment_fkey FOREIGN KEY (id_comment) REFERENCES analytics.comment(id_comment) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY analytics.school_comment ADD CONSTRAINT school_comment_id_ecole_fkey FOREIGN KEY (id_ecole) REFERENCES school.school(id_school) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY school.school_speciality ADD CONSTRAINT school_speciality_id_school_fkey FOREIGN KEY (id_school) REFERENCES school.school(id_school) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY school.school_speciality ADD CONSTRAINT school_speciality_id_speciality_fkey FOREIGN KEY (id_speciality) REFERENCES school.speciality(id_speciality) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.choice ADD CONSTRAINT choice_id_question_fkey FOREIGN KEY (id_question) REFERENCES test.test_question(id_question) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.response_test ADD CONSTRAINT response_test_id_choice_fkey FOREIGN KEY (id_choice) REFERENCES test.choice(id_choice) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.response_test ADD CONSTRAINT response_test_id_question_fkey FOREIGN KEY (id_question) REFERENCES test.test_question(id_question) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.response_test ADD CONSTRAINT response_test_id_session_fkey FOREIGN KEY (id_session) REFERENCES test.session_test(id_session) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.session_test ADD CONSTRAINT session_test_id_test_fkey FOREIGN KEY (id_test) REFERENCES test.personality_test(id_test) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.session_test ADD CONSTRAINT session_test_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES auth."user"(id_user) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE ONLY test.test_question ADD CONSTRAINT test_question_id_test_fkey FOREIGN KEY (id_test) REFERENCES test.personality_test(id_test) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
