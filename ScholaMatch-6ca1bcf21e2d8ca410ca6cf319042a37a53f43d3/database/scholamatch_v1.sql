--
-- PostgreSQL database dump
--

\restrict IbOXmwgfLpnBRwVkmOrp1YYE29hFwx8valyl6QfEhwxaEKKOX1bjlXOu5IDZWVr

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-21 03:58:51

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

--
-- TOC entry 8 (class 2615 OID 16396)
-- Name: analytics; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA analytics;


ALTER SCHEMA analytics OWNER TO postgres;

--
-- TOC entry 6 (class 2615 OID 16394)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 9 (class 2615 OID 16397)
-- Name: school; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA school;


ALTER SCHEMA school OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 16395)
-- Name: test; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA test;


ALTER SCHEMA test OWNER TO postgres;

--
-- TOC entry 917 (class 1247 OID 16630)
-- Name: polaritytype; Type: TYPE; Schema: analytics; Owner: badr
--

CREATE TYPE analytics.polaritytype AS ENUM (
    'positive',
    'negative',
    'neutral'
);


ALTER TYPE analytics.polaritytype OWNER TO badr;

--
-- TOC entry 905 (class 1247 OID 16554)
-- Name: sentimentlabel; Type: TYPE; Schema: analytics; Owner: badr
--

CREATE TYPE analytics.sentimentlabel AS ENUM (
    'postive',
    'negative',
    'neutral'
);


ALTER TYPE analytics.sentimentlabel OWNER TO badr;

--
-- TOC entry 869 (class 1247 OID 16406)
-- Name: role; Type: TYPE; Schema: auth; Owner: postgres
--

CREATE TYPE auth.role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE auth.role OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 16522)
-- Name: educationlvl; Type: TYPE; Schema: school; Owner: badr
--

CREATE TYPE school.educationlvl AS ENUM (
    'primary',
    'secondary',
    'high school',
    'college'
);


ALTER TYPE school.educationlvl OWNER TO badr;

--
-- TOC entry 893 (class 1247 OID 16514)
-- Name: financialtype; Type: TYPE; Schema: school; Owner: badr
--

CREATE TYPE school.financialtype AS ENUM (
    'public',
    'private',
    'hybrid'
);


ALTER TYPE school.financialtype OWNER TO badr;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 243 (class 1259 OID 16638)
-- Name: analysis; Type: TABLE; Schema: analytics; Owner: badr
--

CREATE TABLE analytics.analysis (
    id_analysis integer NOT NULL,
    polarity analytics.polaritytype,
    id_comment integer NOT NULL,
    id_aspect integer NOT NULL
);


ALTER TABLE analytics.analysis OWNER TO badr;

--
-- TOC entry 242 (class 1259 OID 16637)
-- Name: analysis_id_analysis_seq; Type: SEQUENCE; Schema: analytics; Owner: badr
--

CREATE SEQUENCE analytics.analysis_id_analysis_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.analysis_id_analysis_seq OWNER TO badr;

--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 242
-- Name: analysis_id_analysis_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: badr
--

ALTER SEQUENCE analytics.analysis_id_analysis_seq OWNED BY analytics.analysis.id_analysis;


--
-- TOC entry 239 (class 1259 OID 16616)
-- Name: aspect; Type: TABLE; Schema: analytics; Owner: badr
--

CREATE TABLE analytics.aspect (
    id_aspect integer NOT NULL,
    aspect_name character varying(150) NOT NULL
);


ALTER TABLE analytics.aspect OWNER TO badr;

--
-- TOC entry 238 (class 1259 OID 16615)
-- Name: aspect_id_aspect_seq; Type: SEQUENCE; Schema: analytics; Owner: badr
--

CREATE SEQUENCE analytics.aspect_id_aspect_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.aspect_id_aspect_seq OWNER TO badr;

--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 238
-- Name: aspect_id_aspect_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: badr
--

ALTER SEQUENCE analytics.aspect_id_aspect_seq OWNED BY analytics.aspect.id_aspect;


--
-- TOC entry 237 (class 1259 OID 16562)
-- Name: comment; Type: TABLE; Schema: analytics; Owner: badr
--

CREATE TABLE analytics.comment (
    id_comment integer NOT NULL,
    data_source character varying(255),
    comment_date timestamp without time zone DEFAULT now(),
    comment_content text NOT NULL,
    sentiment_score double precision,
    sentiment_label analytics.sentimentlabel
);


ALTER TABLE analytics.comment OWNER TO badr;

--
-- TOC entry 236 (class 1259 OID 16561)
-- Name: comment_id_comment_seq; Type: SEQUENCE; Schema: analytics; Owner: badr
--

CREATE SEQUENCE analytics.comment_id_comment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.comment_id_comment_seq OWNER TO badr;

--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 236
-- Name: comment_id_comment_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: badr
--

ALTER SEQUENCE analytics.comment_id_comment_seq OWNED BY analytics.comment.id_comment;


--
-- TOC entry 241 (class 1259 OID 16623)
-- Name: mot_cle; Type: TABLE; Schema: analytics; Owner: badr
--

CREATE TABLE analytics.mot_cle (
    id_mot_cle integer NOT NULL,
    content character varying(50) NOT NULL,
    id_school integer
);


ALTER TABLE analytics.mot_cle OWNER TO badr;

--
-- TOC entry 240 (class 1259 OID 16622)
-- Name: mot_cle_id_mot_cle_seq; Type: SEQUENCE; Schema: analytics; Owner: badr
--

CREATE SEQUENCE analytics.mot_cle_id_mot_cle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.mot_cle_id_mot_cle_seq OWNER TO badr;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 240
-- Name: mot_cle_id_mot_cle_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: badr
--

ALTER SEQUENCE analytics.mot_cle_id_mot_cle_seq OWNED BY analytics.mot_cle.id_mot_cle;


--
-- TOC entry 244 (class 1259 OID 16659)
-- Name: school_comment; Type: TABLE; Schema: analytics; Owner: badr
--

CREATE TABLE analytics.school_comment (
    id_ecole integer NOT NULL,
    id_comment integer NOT NULL
);


ALTER TABLE analytics.school_comment OWNER TO badr;

--
-- TOC entry 220 (class 1259 OID 16412)
-- Name: user; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth."user" (
    id_user integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(500) NOT NULL,
    email character varying(150) NOT NULL,
    role auth.role,
    prenom character varying(100),
    nom character varying(100)
);


ALTER TABLE auth."user" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: user_id_user_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.user_id_user_seq OWNER TO postgres;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.user_id_user_seq OWNED BY auth."user".id_user;


--
-- TOC entry 234 (class 1259 OID 16532)
-- Name: school; Type: TABLE; Schema: school; Owner: badr
--

CREATE TABLE school.school (
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


ALTER TABLE school.school OWNER TO badr;

--
-- TOC entry 233 (class 1259 OID 16531)
-- Name: school_id_school_seq; Type: SEQUENCE; Schema: school; Owner: badr
--

CREATE SEQUENCE school.school_id_school_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE school.school_id_school_seq OWNER TO badr;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 233
-- Name: school_id_school_seq; Type: SEQUENCE OWNED BY; Schema: school; Owner: badr
--

ALTER SEQUENCE school.school_id_school_seq OWNED BY school.school.id_school;


--
-- TOC entry 235 (class 1259 OID 16540)
-- Name: school_speciality; Type: TABLE; Schema: school; Owner: badr
--

CREATE TABLE school.school_speciality (
    id_school integer NOT NULL,
    id_speciality integer NOT NULL
);


ALTER TABLE school.school_speciality OWNER TO badr;

--
-- TOC entry 232 (class 1259 OID 16505)
-- Name: speciality; Type: TABLE; Schema: school; Owner: postgres
--

CREATE TABLE school.speciality (
    id_speciality integer NOT NULL,
    speciality_name text NOT NULL
);


ALTER TABLE school.speciality OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16504)
-- Name: speciality_id_speciality_seq; Type: SEQUENCE; Schema: school; Owner: postgres
--

CREATE SEQUENCE school.speciality_id_speciality_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE school.speciality_id_speciality_seq OWNER TO postgres;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 231
-- Name: speciality_id_speciality_seq; Type: SEQUENCE OWNED BY; Schema: school; Owner: postgres
--

ALTER SEQUENCE school.speciality_id_speciality_seq OWNED BY school.speciality.id_speciality;


--
-- TOC entry 226 (class 1259 OID 16451)
-- Name: choice; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.choice (
    id_choice integer NOT NULL,
    content text NOT NULL,
    id_question integer NOT NULL
);


ALTER TABLE test.choice OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16450)
-- Name: choice_id_choice_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.choice_id_choice_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE test.choice_id_choice_seq OWNER TO postgres;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 225
-- Name: choice_id_choice_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.choice_id_choice_seq OWNED BY test.choice.id_choice;


--
-- TOC entry 222 (class 1259 OID 16430)
-- Name: personality_test; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.personality_test (
    id_test integer NOT NULL,
    criteria character varying(255)
);


ALTER TABLE test.personality_test OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16429)
-- Name: personality_test_id_test_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.personality_test_id_test_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE test.personality_test_id_test_seq OWNER TO postgres;

--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 221
-- Name: personality_test_id_test_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.personality_test_id_test_seq OWNED BY test.personality_test.id_test;


--
-- TOC entry 230 (class 1259 OID 16483)
-- Name: response_test; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.response_test (
    id_response integer NOT NULL,
    id_session integer NOT NULL,
    id_question integer NOT NULL,
    id_choice integer NOT NULL
);


ALTER TABLE test.response_test OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16482)
-- Name: response_test_id_response_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.response_test_id_response_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE test.response_test_id_response_seq OWNER TO postgres;

--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 229
-- Name: response_test_id_response_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.response_test_id_response_seq OWNED BY test.response_test.id_response;


--
-- TOC entry 228 (class 1259 OID 16465)
-- Name: session_test; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.session_test (
    id_session integer NOT NULL,
    id_utilisateur integer NOT NULL,
    id_test integer NOT NULL,
    date date DEFAULT now()
);


ALTER TABLE test.session_test OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16464)
-- Name: session_test_id_session_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.session_test_id_session_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE test.session_test_id_session_seq OWNER TO postgres;

--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 227
-- Name: session_test_id_session_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.session_test_id_session_seq OWNED BY test.session_test.id_session;


--
-- TOC entry 224 (class 1259 OID 16437)
-- Name: test_question; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.test_question (
    id_question integer NOT NULL,
    question_content text NOT NULL,
    id_test integer NOT NULL
);


ALTER TABLE test.test_question OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16436)
-- Name: test_question_id_question_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.test_question_id_question_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE test.test_question_id_question_seq OWNER TO postgres;

--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 223
-- Name: test_question_id_question_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.test_question_id_question_seq OWNED BY test.test_question.id_question;


--
-- TOC entry 3344 (class 2604 OID 16641)
-- Name: analysis id_analysis; Type: DEFAULT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.analysis ALTER COLUMN id_analysis SET DEFAULT nextval('analytics.analysis_id_analysis_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 16619)
-- Name: aspect id_aspect; Type: DEFAULT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.aspect ALTER COLUMN id_aspect SET DEFAULT nextval('analytics.aspect_id_aspect_seq'::regclass);


--
-- TOC entry 3340 (class 2604 OID 16565)
-- Name: comment id_comment; Type: DEFAULT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.comment ALTER COLUMN id_comment SET DEFAULT nextval('analytics.comment_id_comment_seq'::regclass);


--
-- TOC entry 3343 (class 2604 OID 16626)
-- Name: mot_cle id_mot_cle; Type: DEFAULT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.mot_cle ALTER COLUMN id_mot_cle SET DEFAULT nextval('analytics.mot_cle_id_mot_cle_seq'::regclass);


--
-- TOC entry 3331 (class 2604 OID 16415)
-- Name: user id_user; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth."user" ALTER COLUMN id_user SET DEFAULT nextval('auth.user_id_user_seq'::regclass);


--
-- TOC entry 3339 (class 2604 OID 16535)
-- Name: school id_school; Type: DEFAULT; Schema: school; Owner: badr
--

ALTER TABLE ONLY school.school ALTER COLUMN id_school SET DEFAULT nextval('school.school_id_school_seq'::regclass);


--
-- TOC entry 3338 (class 2604 OID 16508)
-- Name: speciality id_speciality; Type: DEFAULT; Schema: school; Owner: postgres
--

ALTER TABLE ONLY school.speciality ALTER COLUMN id_speciality SET DEFAULT nextval('school.speciality_id_speciality_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 16454)
-- Name: choice id_choice; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.choice ALTER COLUMN id_choice SET DEFAULT nextval('test.choice_id_choice_seq'::regclass);


--
-- TOC entry 3332 (class 2604 OID 16433)
-- Name: personality_test id_test; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.personality_test ALTER COLUMN id_test SET DEFAULT nextval('test.personality_test_id_test_seq'::regclass);


--
-- TOC entry 3337 (class 2604 OID 16486)
-- Name: response_test id_response; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.response_test ALTER COLUMN id_response SET DEFAULT nextval('test.response_test_id_response_seq'::regclass);


--
-- TOC entry 3335 (class 2604 OID 16468)
-- Name: session_test id_session; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.session_test ALTER COLUMN id_session SET DEFAULT nextval('test.session_test_id_session_seq'::regclass);


--
-- TOC entry 3333 (class 2604 OID 16440)
-- Name: test_question id_question; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.test_question ALTER COLUMN id_question SET DEFAULT nextval('test.test_question_id_question_seq'::regclass);


--
-- TOC entry 3552 (class 0 OID 16638)
-- Dependencies: 243
-- Data for Name: analysis; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.analysis (id_analysis, polarity, id_comment, id_aspect) FROM stdin;
\.


--
-- TOC entry 3548 (class 0 OID 16616)
-- Dependencies: 239
-- Data for Name: aspect; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.aspect (id_aspect, aspect_name) FROM stdin;
\.


--
-- TOC entry 3546 (class 0 OID 16562)
-- Dependencies: 237
-- Data for Name: comment; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.comment (id_comment, data_source, comment_date, comment_content, sentiment_score, sentiment_label) FROM stdin;
\.


--
-- TOC entry 3550 (class 0 OID 16623)
-- Dependencies: 241
-- Data for Name: mot_cle; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.mot_cle (id_mot_cle, content, id_school) FROM stdin;
\.


--
-- TOC entry 3553 (class 0 OID 16659)
-- Dependencies: 244
-- Data for Name: school_comment; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.school_comment (id_ecole, id_comment) FROM stdin;
\.


--
-- TOC entry 3529 (class 0 OID 16412)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth."user" (id_user, username, password, email, role, prenom, nom) FROM stdin;
\.


--
-- TOC entry 3543 (class 0 OID 16532)
-- Dependencies: 234
-- Data for Name: school; Type: TABLE DATA; Schema: school; Owner: badr
--

COPY school.school (id_school, school_name, place, image, financial_type, education_type, university_name, teaching_language, website_link, maps_link, phone_number, email, description) FROM stdin;
\.


--
-- TOC entry 3544 (class 0 OID 16540)
-- Dependencies: 235
-- Data for Name: school_speciality; Type: TABLE DATA; Schema: school; Owner: badr
--

COPY school.school_speciality (id_school, id_speciality) FROM stdin;
\.


--
-- TOC entry 3541 (class 0 OID 16505)
-- Dependencies: 232
-- Data for Name: speciality; Type: TABLE DATA; Schema: school; Owner: postgres
--

COPY school.speciality (id_speciality, speciality_name) FROM stdin;
\.


--
-- TOC entry 3535 (class 0 OID 16451)
-- Dependencies: 226
-- Data for Name: choice; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.choice (id_choice, content, id_question) FROM stdin;
\.


--
-- TOC entry 3531 (class 0 OID 16430)
-- Dependencies: 222
-- Data for Name: personality_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.personality_test (id_test, criteria) FROM stdin;
\.


--
-- TOC entry 3539 (class 0 OID 16483)
-- Dependencies: 230
-- Data for Name: response_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.response_test (id_response, id_session, id_question, id_choice) FROM stdin;
\.


--
-- TOC entry 3537 (class 0 OID 16465)
-- Dependencies: 228
-- Data for Name: session_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.session_test (id_session, id_utilisateur, id_test, date) FROM stdin;
\.


--
-- TOC entry 3533 (class 0 OID 16437)
-- Dependencies: 224
-- Data for Name: test_question; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.test_question (id_question, question_content, id_test) FROM stdin;
\.


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 242
-- Name: analysis_id_analysis_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.analysis_id_analysis_seq', 1, false);


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 238
-- Name: aspect_id_aspect_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.aspect_id_aspect_seq', 1, false);


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 236
-- Name: comment_id_comment_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.comment_id_comment_seq', 1, false);


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 240
-- Name: mot_cle_id_mot_cle_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.mot_cle_id_mot_cle_seq', 1, false);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_user_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.user_id_user_seq', 1, false);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 233
-- Name: school_id_school_seq; Type: SEQUENCE SET; Schema: school; Owner: badr
--

SELECT pg_catalog.setval('school.school_id_school_seq', 1, false);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 231
-- Name: speciality_id_speciality_seq; Type: SEQUENCE SET; Schema: school; Owner: postgres
--

SELECT pg_catalog.setval('school.speciality_id_speciality_seq', 1, false);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 225
-- Name: choice_id_choice_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.choice_id_choice_seq', 1, false);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 221
-- Name: personality_test_id_test_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.personality_test_id_test_seq', 1, false);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 229
-- Name: response_test_id_response_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.response_test_id_response_seq', 1, false);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 227
-- Name: session_test_id_session_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.session_test_id_session_seq', 1, false);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 223
-- Name: test_question_id_question_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.test_question_id_question_seq', 1, false);


--
-- TOC entry 3370 (class 2606 OID 16643)
-- Name: analysis analysis_pkey; Type: CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.analysis
    ADD CONSTRAINT analysis_pkey PRIMARY KEY (id_analysis);


--
-- TOC entry 3366 (class 2606 OID 16621)
-- Name: aspect aspect_pkey; Type: CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.aspect
    ADD CONSTRAINT aspect_pkey PRIMARY KEY (id_aspect);


--
-- TOC entry 3364 (class 2606 OID 16570)
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id_comment);


--
-- TOC entry 3368 (class 2606 OID 16628)
-- Name: mot_cle mot_cle_pkey; Type: CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.mot_cle
    ADD CONSTRAINT mot_cle_pkey PRIMARY KEY (id_mot_cle);


--
-- TOC entry 3346 (class 2606 OID 16421)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 3348 (class 2606 OID 16419)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3362 (class 2606 OID 16539)
-- Name: school school_pkey; Type: CONSTRAINT; Schema: school; Owner: badr
--

ALTER TABLE ONLY school.school
    ADD CONSTRAINT school_pkey PRIMARY KEY (id_school);


--
-- TOC entry 3360 (class 2606 OID 16512)
-- Name: speciality speciality_pkey; Type: CONSTRAINT; Schema: school; Owner: postgres
--

ALTER TABLE ONLY school.speciality
    ADD CONSTRAINT speciality_pkey PRIMARY KEY (id_speciality);


--
-- TOC entry 3354 (class 2606 OID 16458)
-- Name: choice choice_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.choice
    ADD CONSTRAINT choice_pkey PRIMARY KEY (id_choice);


--
-- TOC entry 3350 (class 2606 OID 16435)
-- Name: personality_test personality_test_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.personality_test
    ADD CONSTRAINT personality_test_pkey PRIMARY KEY (id_test);


--
-- TOC entry 3358 (class 2606 OID 16488)
-- Name: response_test response_test_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.response_test
    ADD CONSTRAINT response_test_pkey PRIMARY KEY (id_response);


--
-- TOC entry 3356 (class 2606 OID 16471)
-- Name: session_test session_test_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.session_test
    ADD CONSTRAINT session_test_pkey PRIMARY KEY (id_session);


--
-- TOC entry 3352 (class 2606 OID 16444)
-- Name: test_question test_question_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.test_question
    ADD CONSTRAINT test_question_pkey PRIMARY KEY (id_question);


--
-- TOC entry 3381 (class 2606 OID 16649)
-- Name: analysis analysis_id_aspect_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.analysis
    ADD CONSTRAINT analysis_id_aspect_fkey FOREIGN KEY (id_aspect) REFERENCES analytics.aspect(id_aspect) ON DELETE CASCADE;


--
-- TOC entry 3382 (class 2606 OID 16644)
-- Name: analysis analysis_id_comment_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.analysis
    ADD CONSTRAINT analysis_id_comment_fkey FOREIGN KEY (id_comment) REFERENCES analytics.comment(id_comment) ON DELETE CASCADE;


--
-- TOC entry 3380 (class 2606 OID 16654)
-- Name: mot_cle mot_cle_id_school_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.mot_cle
    ADD CONSTRAINT mot_cle_id_school_fkey FOREIGN KEY (id_school) REFERENCES school.school(id_school) ON DELETE CASCADE;


--
-- TOC entry 3383 (class 2606 OID 16667)
-- Name: school_comment school_comment_id_comment_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.school_comment
    ADD CONSTRAINT school_comment_id_comment_fkey FOREIGN KEY (id_comment) REFERENCES analytics.comment(id_comment) ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 16662)
-- Name: school_comment school_comment_id_ecole_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: badr
--

ALTER TABLE ONLY analytics.school_comment
    ADD CONSTRAINT school_comment_id_ecole_fkey FOREIGN KEY (id_ecole) REFERENCES school.school(id_school) ON DELETE CASCADE;


--
-- TOC entry 3378 (class 2606 OID 16543)
-- Name: school_speciality school_speciality_id_school_fkey; Type: FK CONSTRAINT; Schema: school; Owner: badr
--

ALTER TABLE ONLY school.school_speciality
    ADD CONSTRAINT school_speciality_id_school_fkey FOREIGN KEY (id_school) REFERENCES school.school(id_school) ON DELETE CASCADE;


--
-- TOC entry 3379 (class 2606 OID 16548)
-- Name: school_speciality school_speciality_id_speciality_fkey; Type: FK CONSTRAINT; Schema: school; Owner: badr
--

ALTER TABLE ONLY school.school_speciality
    ADD CONSTRAINT school_speciality_id_speciality_fkey FOREIGN KEY (id_speciality) REFERENCES school.speciality(id_speciality) ON DELETE CASCADE;


--
-- TOC entry 3372 (class 2606 OID 16459)
-- Name: choice choice_id_question_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.choice
    ADD CONSTRAINT choice_id_question_fkey FOREIGN KEY (id_question) REFERENCES test.test_question(id_question) ON DELETE CASCADE;


--
-- TOC entry 3375 (class 2606 OID 16499)
-- Name: response_test response_test_id_choice_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.response_test
    ADD CONSTRAINT response_test_id_choice_fkey FOREIGN KEY (id_choice) REFERENCES test.choice(id_choice) ON DELETE CASCADE;


--
-- TOC entry 3376 (class 2606 OID 16494)
-- Name: response_test response_test_id_question_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.response_test
    ADD CONSTRAINT response_test_id_question_fkey FOREIGN KEY (id_question) REFERENCES test.test_question(id_question) ON DELETE CASCADE;


--
-- TOC entry 3377 (class 2606 OID 16489)
-- Name: response_test response_test_id_session_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.response_test
    ADD CONSTRAINT response_test_id_session_fkey FOREIGN KEY (id_session) REFERENCES test.session_test(id_session) ON DELETE CASCADE;


--
-- TOC entry 3373 (class 2606 OID 16477)
-- Name: session_test session_test_id_test_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.session_test
    ADD CONSTRAINT session_test_id_test_fkey FOREIGN KEY (id_test) REFERENCES test.personality_test(id_test) ON DELETE CASCADE;


--
-- TOC entry 3374 (class 2606 OID 16472)
-- Name: session_test session_test_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.session_test
    ADD CONSTRAINT session_test_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES auth."user"(id_user) ON DELETE CASCADE;


--
-- TOC entry 3371 (class 2606 OID 16445)
-- Name: test_question test_question_id_test_fkey; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.test_question
    ADD CONSTRAINT test_question_id_test_fkey FOREIGN KEY (id_test) REFERENCES test.personality_test(id_test) ON DELETE CASCADE;


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA analytics; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA analytics TO badr;


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA auth TO badr;


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 9
-- Name: SCHEMA school; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA school TO badr;


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA test; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA test TO badr;


--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE "user"; Type: ACL; Schema: auth; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth."user" TO badr;


-- Completed on 2026-02-21 03:58:51

--
-- PostgreSQL database dump complete
--

\unrestrict IbOXmwgfLpnBRwVkmOrp1YYE29hFwx8valyl6QfEhwxaEKKOX1bjlXOu5IDZWVr

