--
-- PostgreSQL database dump
--

\restrict ykQVP9BvjsudjGUR1iGkkJQCJsckvm5qDrEMSVLQBSwsfUSXgH33YYZgcDjEDvq

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 18.0

-- Started on 2026-04-04 22:16:30

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
-- TOC entry 3776 (class 0 OID 16638)
-- Dependencies: 243
-- Data for Name: analysis; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.analysis (id_analysis, polarity, id_comment, id_aspect) FROM stdin;
1	negative	15	1
2	positive	15	2
3	positive	16	3
4	positive	16	4
5	negative	16	5
6	neutral	17	6
7	positive	18	7
8	negative	18	8
9	positive	18	9
10	positive	19	10
11	positive	19	11
12	neutral	20	12
13	positive	21	13
14	positive	21	14
15	negative	22	15
16	negative	22	15
17	negative	23	15
18	positive	23	16
19	negative	24	15
20	negative	24	15
21	neutral	25	17
22	neutral	25	15
23	positive	26	16
24	neutral	26	18
25	neutral	27	3
26	positive	27	16
27	negative	28	15
28	positive	28	17
29	neutral	29	18
30	negative	29	17
31	neutral	30	18
32	positive	30	18
33	positive	31	15
34	positive	31	15
35	positive	32	15
36	positive	32	18
37	positive	33	18
38	negative	33	3
39	neutral	34	17
40	negative	34	16
41	positive	35	15
42	negative	35	15
43	positive	36	16
44	neutral	36	17
45	negative	37	17
46	neutral	37	16
47	negative	38	3
48	positive	38	18
49	negative	39	16
50	negative	39	15
51	negative	40	17
52	negative	40	3
53	positive	41	18
54	negative	41	16
55	negative	42	16
56	negative	42	3
57	positive	43	16
58	neutral	43	16
59	positive	44	15
60	negative	44	16
61	negative	45	16
62	neutral	45	17
63	negative	46	3
64	neutral	46	17
65	positive	47	18
66	neutral	47	18
67	negative	48	18
68	positive	48	17
69	positive	49	17
70	positive	49	18
71	neutral	50	15
72	neutral	50	15
73	neutral	51	18
74	negative	51	3
75	neutral	52	15
76	positive	52	17
77	neutral	53	16
78	neutral	53	16
79	positive	54	3
80	negative	54	17
81	neutral	55	3
82	positive	55	17
83	negative	56	15
84	neutral	56	3
85	negative	57	16
86	positive	57	16
87	negative	58	3
88	negative	58	18
89	positive	59	15
90	positive	59	17
91	negative	60	18
92	negative	60	16
93	neutral	61	18
94	negative	61	3
95	positive	62	18
96	positive	62	15
97	positive	63	17
98	positive	63	15
99	neutral	64	3
100	neutral	64	3
101	positive	65	18
102	neutral	65	15
103	positive	66	3
104	negative	66	3
105	neutral	67	17
106	negative	67	17
107	positive	68	15
108	neutral	68	16
109	neutral	69	15
110	neutral	69	17
111	positive	70	3
112	positive	70	16
113	positive	71	16
114	positive	71	15
115	negative	72	15
116	positive	72	16
117	positive	73	15
118	neutral	73	16
119	neutral	74	18
120	positive	74	17
121	negative	75	18
122	positive	75	3
123	neutral	76	18
124	neutral	76	17
125	negative	77	16
126	negative	77	17
127	positive	78	16
128	neutral	78	17
129	negative	79	18
130	positive	79	3
131	neutral	80	18
132	neutral	80	18
133	neutral	81	3
134	negative	81	17
135	neutral	82	18
136	negative	82	3
137	neutral	83	3
138	positive	83	3
139	negative	84	17
140	negative	84	18
141	neutral	85	16
142	negative	85	16
143	neutral	86	18
144	neutral	86	18
145	neutral	87	16
146	positive	87	15
147	neutral	88	18
148	positive	88	15
149	positive	89	15
150	negative	89	17
151	positive	90	17
152	positive	90	3
153	neutral	91	17
154	positive	91	17
155	negative	92	18
156	neutral	92	3
157	negative	93	18
158	positive	93	16
159	positive	94	16
160	neutral	94	16
161	positive	95	15
162	negative	95	16
163	negative	96	18
164	positive	96	17
165	negative	97	15
166	positive	97	17
167	neutral	98	15
168	neutral	98	3
169	positive	99	15
170	neutral	99	15
171	neutral	100	16
172	negative	100	17
173	positive	101	18
174	negative	101	16
175	positive	102	17
176	positive	102	17
177	positive	103	17
178	neutral	103	16
179	neutral	104	17
180	negative	104	15
181	negative	105	16
182	positive	105	16
183	negative	106	18
184	neutral	106	15
185	positive	107	16
186	positive	107	15
187	negative	108	3
188	positive	108	16
189	negative	109	17
190	negative	109	3
191	negative	110	18
192	neutral	110	16
193	neutral	111	17
194	positive	111	17
195	neutral	112	16
196	positive	112	17
197	neutral	113	16
198	negative	113	17
199	neutral	114	15
200	positive	114	16
201	positive	115	18
202	positive	115	3
203	negative	116	18
204	negative	116	17
205	positive	117	16
206	negative	117	3
207	positive	118	3
208	positive	118	15
209	positive	119	3
210	negative	119	16
211	neutral	120	3
212	negative	120	15
213	positive	121	18
214	neutral	121	15
215	negative	122	15
216	negative	122	15
217	negative	123	15
218	positive	123	16
219	negative	124	15
220	negative	124	15
221	neutral	125	17
222	neutral	125	15
223	positive	126	16
224	neutral	126	18
225	neutral	127	3
226	positive	127	16
227	negative	128	15
228	positive	128	17
229	neutral	129	18
230	negative	129	17
231	neutral	130	18
232	positive	130	18
233	positive	131	15
234	positive	131	15
235	positive	132	15
236	positive	132	18
237	positive	133	18
238	negative	133	3
239	neutral	134	17
240	negative	134	16
241	positive	135	15
242	negative	135	15
243	positive	136	16
244	neutral	136	17
245	negative	137	17
246	neutral	137	16
247	negative	138	3
248	positive	138	18
249	negative	139	16
250	negative	139	15
251	negative	140	17
252	negative	140	3
253	positive	141	18
254	negative	141	16
255	negative	142	16
256	negative	142	3
257	positive	143	16
258	neutral	143	16
259	positive	144	15
260	negative	144	16
261	negative	145	16
262	neutral	145	17
263	negative	146	3
264	neutral	146	17
265	positive	147	18
266	neutral	147	18
267	negative	148	18
268	positive	148	17
269	positive	149	17
270	positive	149	18
271	neutral	150	15
272	neutral	150	15
273	neutral	151	18
274	negative	151	3
275	neutral	152	15
276	positive	152	17
277	neutral	153	16
278	neutral	153	16
279	positive	154	3
280	negative	154	17
281	neutral	155	3
282	positive	155	17
283	negative	156	15
284	neutral	156	3
285	negative	157	16
286	positive	157	16
287	negative	158	3
288	negative	158	18
289	positive	159	15
290	positive	159	17
291	negative	160	18
292	negative	160	16
293	neutral	161	18
294	negative	161	3
295	positive	162	18
296	positive	162	15
297	positive	163	17
298	positive	163	15
299	neutral	164	3
300	neutral	164	3
301	positive	165	18
302	neutral	165	15
303	positive	166	3
304	negative	166	3
305	neutral	167	17
306	negative	167	17
307	positive	168	15
308	neutral	168	16
309	neutral	169	15
310	neutral	169	17
311	positive	170	3
312	positive	170	16
313	positive	171	16
314	positive	171	15
315	negative	172	15
316	positive	172	16
317	positive	173	15
318	neutral	173	16
319	neutral	174	18
320	positive	174	17
321	negative	175	18
322	positive	175	3
323	neutral	176	18
324	neutral	176	17
325	negative	177	16
326	negative	177	17
327	positive	178	16
328	neutral	178	17
329	negative	179	18
330	positive	179	3
331	neutral	180	18
332	neutral	180	18
333	neutral	181	3
334	negative	181	17
335	neutral	182	18
336	negative	182	3
337	neutral	183	3
338	positive	183	3
339	negative	184	17
340	negative	184	18
341	neutral	185	16
342	negative	185	16
343	neutral	186	18
344	neutral	186	18
345	neutral	187	16
346	positive	187	15
347	neutral	188	18
348	positive	188	15
349	positive	189	15
350	negative	189	17
351	positive	190	17
352	positive	190	3
353	neutral	191	17
354	positive	191	17
355	negative	192	18
356	neutral	192	3
357	negative	193	18
358	positive	193	16
359	positive	194	16
360	neutral	194	16
361	positive	195	15
362	negative	195	16
363	negative	196	18
364	positive	196	17
365	negative	197	15
366	positive	197	17
367	neutral	198	15
368	neutral	198	3
369	positive	199	15
370	neutral	199	15
371	neutral	200	16
372	negative	200	17
373	positive	201	18
374	negative	201	16
375	positive	202	17
376	positive	202	17
377	positive	203	17
378	neutral	203	16
379	neutral	204	17
380	negative	204	15
381	negative	205	16
382	positive	205	16
383	negative	206	18
384	neutral	206	15
385	positive	207	16
386	positive	207	15
387	negative	208	3
388	positive	208	16
389	negative	209	17
390	negative	209	3
391	negative	210	18
392	neutral	210	16
393	neutral	211	17
394	positive	211	17
395	neutral	212	16
396	positive	212	17
397	neutral	213	16
398	negative	213	17
399	neutral	214	15
400	positive	214	16
401	positive	215	18
402	positive	215	3
403	negative	216	18
404	negative	216	17
405	positive	217	16
406	negative	217	3
407	positive	218	3
408	positive	218	15
409	positive	219	3
410	negative	219	16
411	neutral	220	3
412	negative	220	15
413	positive	221	18
414	neutral	221	15
415	negative	222	15
416	negative	222	15
417	negative	223	15
418	positive	223	16
419	negative	224	15
420	negative	224	15
421	neutral	225	17
422	neutral	225	15
423	positive	226	16
424	neutral	226	18
425	neutral	227	3
426	positive	227	16
427	negative	228	15
428	positive	228	17
429	neutral	229	18
430	negative	229	17
431	neutral	230	18
432	positive	230	18
433	positive	231	15
434	positive	231	15
435	positive	232	15
436	positive	232	18
437	positive	233	18
438	negative	233	3
439	neutral	234	17
440	negative	234	16
441	positive	235	15
442	negative	235	15
443	positive	236	16
444	neutral	236	17
445	negative	237	17
446	neutral	237	16
447	negative	238	3
448	positive	238	18
449	negative	239	16
450	negative	239	15
451	negative	240	17
452	negative	240	3
453	positive	241	18
454	negative	241	16
455	negative	242	16
456	negative	242	3
457	positive	243	16
458	neutral	243	16
459	positive	244	15
460	negative	244	16
461	negative	245	16
462	neutral	245	17
463	negative	246	3
464	neutral	246	17
465	positive	247	18
466	neutral	247	18
467	negative	248	18
468	positive	248	17
469	positive	249	17
470	positive	249	18
471	neutral	250	15
472	neutral	250	15
473	neutral	251	18
474	negative	251	3
475	neutral	252	15
476	positive	252	17
477	neutral	253	16
478	neutral	253	16
479	positive	254	3
480	negative	254	17
481	neutral	255	3
482	positive	255	17
483	negative	256	15
484	neutral	256	3
485	negative	257	16
486	positive	257	16
487	negative	258	3
488	negative	258	18
489	positive	259	15
490	positive	259	17
491	negative	260	18
492	negative	260	16
493	neutral	261	18
494	negative	261	3
495	positive	262	18
496	positive	262	15
497	positive	263	17
498	positive	263	15
499	neutral	264	3
500	neutral	264	3
501	positive	265	18
502	neutral	265	15
503	positive	266	3
504	negative	266	3
505	neutral	267	17
506	negative	267	17
507	positive	268	15
508	neutral	268	16
509	neutral	269	15
510	neutral	269	17
511	positive	270	3
512	positive	270	16
513	positive	271	16
514	positive	271	15
515	negative	272	15
516	positive	272	16
517	positive	273	15
518	neutral	273	16
519	neutral	274	18
520	positive	274	17
521	negative	275	18
522	positive	275	3
523	neutral	276	18
524	neutral	276	17
525	negative	277	16
526	negative	277	17
527	positive	278	16
528	neutral	278	17
529	negative	279	18
530	positive	279	3
531	neutral	280	18
532	neutral	280	18
533	neutral	281	3
534	negative	281	17
535	neutral	282	18
536	negative	282	3
537	neutral	283	3
538	positive	283	3
539	negative	284	17
540	negative	284	18
541	neutral	285	16
542	negative	285	16
543	neutral	286	18
544	neutral	286	18
545	neutral	287	16
546	positive	287	15
547	neutral	288	18
548	positive	288	15
549	positive	289	15
550	negative	289	17
551	positive	290	17
552	positive	290	3
553	neutral	291	17
554	positive	291	17
555	negative	292	18
556	neutral	292	3
557	negative	293	18
558	positive	293	16
559	positive	294	16
560	neutral	294	16
561	positive	295	15
562	negative	295	16
563	negative	296	18
564	positive	296	17
565	negative	297	15
566	positive	297	17
567	neutral	298	15
568	neutral	298	3
569	positive	299	15
570	neutral	299	15
571	neutral	300	16
572	negative	300	17
573	positive	301	18
574	negative	301	16
575	positive	302	17
576	positive	302	17
577	positive	303	17
578	neutral	303	16
579	neutral	304	17
580	negative	304	15
581	negative	305	16
582	positive	305	16
583	negative	306	18
584	neutral	306	15
585	positive	307	16
586	positive	307	15
587	negative	308	3
588	positive	308	16
589	negative	309	17
590	negative	309	3
591	negative	310	18
592	neutral	310	16
593	neutral	311	17
594	positive	311	17
595	neutral	312	16
596	positive	312	17
597	neutral	313	16
598	negative	313	17
599	neutral	314	15
600	positive	314	16
601	positive	315	18
602	positive	315	3
603	negative	316	18
604	negative	316	17
605	positive	317	16
606	negative	317	3
607	positive	318	3
608	positive	318	15
609	positive	319	3
610	negative	319	16
611	neutral	320	3
612	negative	320	15
613	positive	321	18
614	neutral	321	15
\.


--
-- TOC entry 3772 (class 0 OID 16616)
-- Dependencies: 239
-- Data for Name: aspect; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.aspect (id_aspect, aspect_name) FROM stdin;
1	Financial
2	Pedagogy
3	location
4	teachers
5	tuition fees
6	Nothing
7	1
8	2
9	3
10	campus
11	place
12	Test
13	greetings
14	autre
15	activities
16	management
17	facilities
18	teaching
\.


--
-- TOC entry 3804 (class 0 OID 16841)
-- Dependencies: 271
-- Data for Name: auth_group; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_group (id, name) FROM stdin;
\.


--
-- TOC entry 3806 (class 0 OID 16849)
-- Dependencies: 273
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- TOC entry 3802 (class 0 OID 16835)
-- Dependencies: 269
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	3	add_permission
6	Can change permission	3	change_permission
7	Can delete permission	3	delete_permission
8	Can view permission	3	view_permission
9	Can add group	2	add_group
10	Can change group	2	change_group
11	Can delete group	2	delete_group
12	Can view group	2	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add analysis	7	add_analysis
26	Can change analysis	7	change_analysis
27	Can delete analysis	7	delete_analysis
28	Can view analysis	7	view_analysis
29	Can add aspect	8	add_aspect
30	Can change aspect	8	change_aspect
31	Can delete aspect	8	delete_aspect
32	Can view aspect	8	view_aspect
33	Can add auth group	9	add_authgroup
34	Can change auth group	9	change_authgroup
35	Can delete auth group	9	delete_authgroup
36	Can view auth group	9	view_authgroup
37	Can add auth group permissions	10	add_authgrouppermissions
38	Can change auth group permissions	10	change_authgrouppermissions
39	Can delete auth group permissions	10	delete_authgrouppermissions
40	Can view auth group permissions	10	view_authgrouppermissions
41	Can add auth permission	11	add_authpermission
42	Can change auth permission	11	change_authpermission
43	Can delete auth permission	11	delete_authpermission
44	Can view auth permission	11	view_authpermission
45	Can add auth user	12	add_authuser
46	Can change auth user	12	change_authuser
47	Can delete auth user	12	delete_authuser
48	Can view auth user	12	view_authuser
49	Can add auth user groups	13	add_authusergroups
50	Can change auth user groups	13	change_authusergroups
51	Can delete auth user groups	13	delete_authusergroups
52	Can view auth user groups	13	view_authusergroups
53	Can add auth user user permissions	14	add_authuseruserpermissions
54	Can change auth user user permissions	14	change_authuseruserpermissions
55	Can delete auth user user permissions	14	delete_authuseruserpermissions
56	Can view auth user user permissions	14	view_authuseruserpermissions
57	Can add choice	15	add_choice
58	Can change choice	15	change_choice
59	Can delete choice	15	delete_choice
60	Can view choice	15	view_choice
61	Can add comment	16	add_comment
62	Can change comment	16	change_comment
63	Can delete comment	16	delete_comment
64	Can view comment	16	view_comment
65	Can add django admin log	17	add_djangoadminlog
66	Can change django admin log	17	change_djangoadminlog
67	Can delete django admin log	17	delete_djangoadminlog
68	Can view django admin log	17	view_djangoadminlog
69	Can add django content type	18	add_djangocontenttype
70	Can change django content type	18	change_djangocontenttype
71	Can delete django content type	18	delete_djangocontenttype
72	Can view django content type	18	view_djangocontenttype
73	Can add django migrations	19	add_djangomigrations
74	Can change django migrations	19	change_djangomigrations
75	Can delete django migrations	19	delete_djangomigrations
76	Can view django migrations	19	view_djangomigrations
77	Can add django session	20	add_djangosession
78	Can change django session	20	change_djangosession
79	Can delete django session	20	delete_djangosession
80	Can view django session	20	view_djangosession
81	Can add mot cle	21	add_motcle
82	Can change mot cle	21	change_motcle
83	Can delete mot cle	21	delete_motcle
84	Can view mot cle	21	view_motcle
85	Can add personality test	22	add_personalitytest
86	Can change personality test	22	change_personalitytest
87	Can delete personality test	22	delete_personalitytest
88	Can view personality test	22	view_personalitytest
89	Can add response test	23	add_responsetest
90	Can change response test	23	change_responsetest
91	Can delete response test	23	delete_responsetest
92	Can view response test	23	view_responsetest
93	Can add school	24	add_school
94	Can change school	24	change_school
95	Can delete school	24	delete_school
96	Can view school	24	view_school
97	Can add school comment	25	add_schoolcomment
98	Can change school comment	25	change_schoolcomment
99	Can delete school comment	25	delete_schoolcomment
100	Can view school comment	25	view_schoolcomment
101	Can add school speciality	26	add_schoolspeciality
102	Can change school speciality	26	change_schoolspeciality
103	Can delete school speciality	26	delete_schoolspeciality
104	Can view school speciality	26	view_schoolspeciality
105	Can add session test	27	add_sessiontest
106	Can change session test	27	change_sessiontest
107	Can delete session test	27	delete_sessiontest
108	Can view session test	27	view_sessiontest
109	Can add speciality	28	add_speciality
110	Can change speciality	28	change_speciality
111	Can delete speciality	28	delete_speciality
112	Can view speciality	28	view_speciality
113	Can add test question	29	add_testquestion
114	Can change test question	29	change_testquestion
115	Can delete test question	29	delete_testquestion
116	Can view test question	29	view_testquestion
117	Can add user	30	add_user
118	Can change user	30	change_user
119	Can delete user	30	delete_user
120	Can view user	30	view_user
121	Can add Token	31	add_token
122	Can change Token	31	change_token
123	Can delete Token	31	delete_token
124	Can view Token	31	view_token
125	Can add Token	32	add_tokenproxy
126	Can change Token	32	change_tokenproxy
127	Can delete Token	32	delete_tokenproxy
128	Can view Token	32	view_tokenproxy
\.


--
-- TOC entry 3808 (class 0 OID 16855)
-- Dependencies: 275
-- Data for Name: auth_user; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- TOC entry 3810 (class 0 OID 16863)
-- Dependencies: 277
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- TOC entry 3812 (class 0 OID 16869)
-- Dependencies: 279
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- TOC entry 3816 (class 0 OID 25167)
-- Dependencies: 283
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- TOC entry 3770 (class 0 OID 16562)
-- Dependencies: 237
-- Data for Name: comment; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.comment (id_comment, data_source, comment_date, comment_content, sentiment_score, sentiment_label) FROM stdin;
9	manual	2026-02-28 14:16:43.662792	Hi!	0	neutral
10	manual	2026-02-28 14:50:17.542803	Hi!	0	neutral
11	manual	2026-02-28 14:50:41.333182	Hi!	100	positive
12	manual	2026-02-28 14:52:21.517308	Hi!	99.99	positive
13	manual	\N	Salam	10	positive
14	manual	\N	HI, test	88	positive
15	manual	\N	Excellent staff but too expensive	0	neutral
16	manual	\N	The school has a great location and the teachers are very helpful, but the tuition fees are too expensive.	0.3333333333333333	positive
17	manual	\N	Hello, test2	0	neutral
18	manual	\N	Hello, test3	0.33	positive
19	manual	2026-03-13 04:02:30.364232	Harvard has a beautiful campus full of eclectic buildings holding its various departments, classrooms, offices, museums, libraries, etc. It's a great place to walk around, explore, marvel, sit, people watch...	1	positive
20	manual	2026-03-13 15:20:47.319764	Hi, test 04	0	neutral
21	manual	2026-03-26 12:37:49.876519	Hello, test 4	1	positive
22	csv	2026-03-28 02:41:12.727518	Nice environment	-1	negative
23	csv	2026-03-28 02:41:13.080149	Excellent facilities	0	neutral
24	csv	2026-03-28 02:41:13.252253	Amazing campus	-1	negative
25	csv	2026-03-28 02:41:13.377225	Great school	0	neutral
26	csv	2026-03-28 02:41:13.526456	Average experience	0.5	positive
27	csv	2026-03-28 02:41:13.675523	Good teachers	0.5	positive
28	csv	2026-03-28 02:41:13.766744	Average experience	0	neutral
29	csv	2026-03-28 02:41:13.852196	Well organized	-0.5	negative
30	csv	2026-03-28 02:41:13.954026	Amazing campus	0.5	positive
31	csv	2026-03-28 02:41:14.053532	Excellent facilities	1	positive
32	csv	2026-03-28 02:41:14.135411	Needs improvement	1	positive
33	csv	2026-03-28 02:41:14.24637	Could be better	0	neutral
34	csv	2026-03-28 02:41:14.336229	Good teachers	-0.5	negative
35	csv	2026-03-28 02:41:14.418321	Needs improvement	0	neutral
36	csv	2026-03-28 02:41:14.502816	Amazing campus	0.5	positive
37	csv	2026-03-28 02:41:14.591579	Could be better	-0.5	negative
38	csv	2026-03-28 02:41:14.707707	Friendly staff	0	neutral
39	csv	2026-03-28 02:41:14.809827	Nice environment	-1	negative
40	csv	2026-03-28 02:41:14.886825	Could be better	-1	negative
41	csv	2026-03-28 02:41:14.986324	Average experience	0	neutral
42	csv	2026-03-28 02:41:15.06919	Amazing campus	-1	negative
43	csv	2026-03-28 02:41:15.149446	Could be better	0.5	positive
44	csv	2026-03-28 02:41:15.238334	Great school	0	neutral
45	csv	2026-03-28 02:41:15.33739	Well organized	-0.5	negative
46	csv	2026-03-28 02:41:15.412769	Friendly staff	-0.5	negative
47	csv	2026-03-28 02:41:15.50082	Friendly staff	0.5	positive
48	csv	2026-03-28 02:41:15.57349	Excellent facilities	0	neutral
49	csv	2026-03-28 02:41:15.684792	Could be better	1	positive
50	csv	2026-03-28 02:41:15.804724	Could be better	0	neutral
51	csv	2026-03-28 02:41:15.915666	Could be better	-0.5	negative
52	csv	2026-03-28 02:41:16.053276	Great school	0.5	positive
53	csv	2026-03-28 02:41:16.151828	Good teachers	0	neutral
54	csv	2026-03-28 02:41:16.325709	Needs improvement	0	neutral
55	csv	2026-03-28 02:41:16.474965	Nice environment	0.5	positive
56	csv	2026-03-28 02:41:16.595523	Needs improvement	-0.5	negative
57	csv	2026-03-28 02:41:16.70356	Friendly staff	0	neutral
58	csv	2026-03-28 02:41:16.797845	Needs improvement	-1	negative
59	csv	2026-03-28 02:41:16.9095	Friendly staff	1	positive
60	csv	2026-03-28 02:41:17.01194	Great school	-1	negative
61	csv	2026-03-28 02:41:17.134775	Needs improvement	-0.5	negative
62	csv	2026-03-28 02:41:17.253614	Excellent facilities	1	positive
63	csv	2026-03-28 02:41:17.3667	Excellent facilities	1	positive
64	csv	2026-03-28 02:41:17.458464	Needs improvement	0	neutral
65	csv	2026-03-28 02:41:17.562325	Friendly staff	0.5	positive
66	csv	2026-03-28 02:41:17.674454	Well organized	0	neutral
67	csv	2026-03-28 02:41:17.791342	Nice environment	-0.5	negative
68	csv	2026-03-28 02:41:17.88316	Needs improvement	0.5	positive
69	csv	2026-03-28 02:41:18.008531	Excellent facilities	0	neutral
70	csv	2026-03-28 02:41:18.100364	Good teachers	1	positive
71	csv	2026-03-28 02:41:18.188956	Excellent facilities	1	positive
72	csv	2026-03-28 02:41:18.27153	Average experience	0	neutral
73	csv	2026-03-28 02:41:18.367464	Well organized	0.5	positive
74	csv	2026-03-28 02:41:18.458557	Excellent facilities	0.5	positive
75	csv	2026-03-28 02:41:18.570536	Excellent facilities	0	neutral
76	csv	2026-03-28 02:41:18.681854	Average experience	0	neutral
77	csv	2026-03-28 02:41:18.787327	Amazing campus	-1	negative
78	csv	2026-03-28 02:41:18.882879	Well organized	0.5	positive
79	csv	2026-03-28 02:41:18.984745	Great school	0	neutral
80	csv	2026-03-28 02:41:19.093345	Amazing campus	0	neutral
81	csv	2026-03-28 02:41:19.211772	Amazing campus	-0.5	negative
82	csv	2026-03-28 02:41:19.29676	Great school	-0.5	negative
83	csv	2026-03-28 02:41:19.388294	Average experience	0.5	positive
84	csv	2026-03-28 02:41:19.486445	Could be better	-1	negative
85	csv	2026-03-28 02:41:19.563615	Well organized	-0.5	negative
86	csv	2026-03-28 02:41:19.65353	Average experience	0	neutral
87	csv	2026-03-28 02:41:19.756478	Well organized	0.5	positive
88	csv	2026-03-28 02:41:19.852487	Average experience	0.5	positive
89	csv	2026-03-28 02:41:19.930298	Well organized	0	neutral
90	csv	2026-03-28 02:41:20.015636	Well organized	1	positive
91	csv	2026-03-28 02:41:20.123824	Friendly staff	0.5	positive
92	csv	2026-03-28 02:41:20.205217	Could be better	-0.5	negative
93	csv	2026-03-28 02:41:20.291449	Good teachers	0	neutral
94	csv	2026-03-28 02:41:20.367084	Good teachers	0.5	positive
95	csv	2026-03-28 02:41:20.468485	Great school	0	neutral
96	csv	2026-03-28 02:41:20.56136	Great school	0	neutral
97	csv	2026-03-28 02:41:20.64832	Average experience	0	neutral
98	csv	2026-03-28 02:41:20.740491	Needs improvement	0	neutral
99	csv	2026-03-28 02:41:20.824218	Good teachers	0.5	positive
100	csv	2026-03-28 02:41:20.907667	Friendly staff	-0.5	negative
101	csv	2026-03-28 02:41:20.988568	Could be better	0	neutral
102	csv	2026-03-28 02:41:21.069196	Great school	1	positive
103	csv	2026-03-28 02:41:21.174111	Great school	0.5	positive
104	csv	2026-03-28 02:41:21.278881	Excellent facilities	-0.5	negative
105	csv	2026-03-28 02:41:21.373011	Great school	0	neutral
106	csv	2026-03-28 02:41:21.455637	Could be better	-0.5	negative
107	csv	2026-03-28 02:41:21.552401	Could be better	1	positive
108	csv	2026-03-28 02:41:21.644249	Great school	0	neutral
109	csv	2026-03-28 02:41:21.744366	Amazing campus	-1	negative
110	csv	2026-03-28 02:41:21.881132	Great school	-0.5	negative
111	csv	2026-03-28 02:41:21.975599	Good teachers	0.5	positive
112	csv	2026-03-28 02:41:22.087248	Great school	0.5	positive
113	csv	2026-03-28 02:41:22.187	Needs improvement	-0.5	negative
114	csv	2026-03-28 02:41:22.271114	Good teachers	0.5	positive
115	csv	2026-03-28 02:41:22.362685	Needs improvement	1	positive
116	csv	2026-03-28 02:41:22.444123	Excellent facilities	-1	negative
117	csv	2026-03-28 02:41:22.543555	Good teachers	0	neutral
118	csv	2026-03-28 02:41:22.634265	Great school	1	positive
119	csv	2026-03-28 02:41:22.734584	Great school	0	neutral
120	csv	2026-03-28 02:41:22.833554	Good teachers	-0.5	negative
121	csv	2026-03-28 02:41:22.936891	Amazing campus	0.5	positive
122	csv	2026-03-28 02:44:36.94926	Nice environment	-1	negative
123	csv	2026-03-28 02:44:37.188851	Excellent facilities	0	neutral
124	csv	2026-03-28 02:44:37.302797	Amazing campus	-1	negative
125	csv	2026-03-28 02:44:37.428126	Great school	0	neutral
126	csv	2026-03-28 02:44:37.539378	Average experience	0.5	positive
127	csv	2026-03-28 02:44:37.643308	Good teachers	0.5	positive
128	csv	2026-03-28 02:44:37.749334	Average experience	0	neutral
129	csv	2026-03-28 02:44:37.834698	Well organized	-0.5	negative
130	csv	2026-03-28 02:44:37.927149	Amazing campus	0.5	positive
131	csv	2026-03-28 02:44:38.008522	Excellent facilities	1	positive
132	csv	2026-03-28 02:44:38.082733	Needs improvement	1	positive
133	csv	2026-03-28 02:44:38.164529	Could be better	0	neutral
134	csv	2026-03-28 02:44:38.252672	Good teachers	-0.5	negative
135	csv	2026-03-28 02:44:38.337056	Needs improvement	0	neutral
136	csv	2026-03-28 02:44:38.423944	Amazing campus	0.5	positive
137	csv	2026-03-28 02:44:38.5299	Could be better	-0.5	negative
138	csv	2026-03-28 02:44:38.613837	Friendly staff	0	neutral
139	csv	2026-03-28 02:44:38.706648	Nice environment	-1	negative
140	csv	2026-03-28 02:44:38.790577	Could be better	-1	negative
141	csv	2026-03-28 02:44:38.872093	Average experience	0	neutral
142	csv	2026-03-28 02:44:38.955576	Amazing campus	-1	negative
143	csv	2026-03-28 02:44:39.039649	Could be better	0.5	positive
144	csv	2026-03-28 02:44:39.118514	Great school	0	neutral
145	csv	2026-03-28 02:44:39.200145	Well organized	-0.5	negative
146	csv	2026-03-28 02:44:39.307198	Friendly staff	-0.5	negative
147	csv	2026-03-28 02:44:39.404911	Friendly staff	0.5	positive
148	csv	2026-03-28 02:44:39.489491	Excellent facilities	0	neutral
149	csv	2026-03-28 02:44:39.586087	Could be better	1	positive
150	csv	2026-03-28 02:44:39.66659	Could be better	0	neutral
151	csv	2026-03-28 02:44:39.746458	Could be better	-0.5	negative
152	csv	2026-03-28 02:44:39.831387	Great school	0.5	positive
153	csv	2026-03-28 02:44:39.915522	Good teachers	0	neutral
154	csv	2026-03-28 02:44:40.004827	Needs improvement	0	neutral
155	csv	2026-03-28 02:44:40.091744	Nice environment	0.5	positive
156	csv	2026-03-28 02:44:40.180387	Needs improvement	-0.5	negative
157	csv	2026-03-28 02:44:40.268827	Friendly staff	0	neutral
158	csv	2026-03-28 02:44:40.352828	Needs improvement	-1	negative
159	csv	2026-03-28 02:44:40.460151	Friendly staff	1	positive
160	csv	2026-03-28 02:44:40.557706	Great school	-1	negative
161	csv	2026-03-28 02:44:40.64206	Needs improvement	-0.5	negative
162	csv	2026-03-28 02:44:40.718142	Excellent facilities	1	positive
163	csv	2026-03-28 02:44:40.796027	Excellent facilities	1	positive
164	csv	2026-03-28 02:44:40.887231	Needs improvement	0	neutral
165	csv	2026-03-28 02:44:40.962224	Friendly staff	0.5	positive
166	csv	2026-03-28 02:44:41.042867	Well organized	0	neutral
167	csv	2026-03-28 02:44:41.117922	Nice environment	-0.5	negative
168	csv	2026-03-28 02:44:41.19764	Needs improvement	0.5	positive
169	csv	2026-03-28 02:44:41.294118	Excellent facilities	0	neutral
170	csv	2026-03-28 02:44:41.394888	Good teachers	1	positive
171	csv	2026-03-28 02:44:41.50783	Excellent facilities	1	positive
172	csv	2026-03-28 02:44:41.60447	Average experience	0	neutral
173	csv	2026-03-28 02:44:41.707067	Well organized	0.5	positive
174	csv	2026-03-28 02:44:41.798608	Excellent facilities	0.5	positive
175	csv	2026-03-28 02:44:41.897256	Excellent facilities	0	neutral
176	csv	2026-03-28 02:44:41.990111	Average experience	0	neutral
177	csv	2026-03-28 02:44:42.077434	Amazing campus	-1	negative
178	csv	2026-03-28 02:44:42.177205	Well organized	0.5	positive
179	csv	2026-03-28 02:44:42.271138	Great school	0	neutral
180	csv	2026-03-28 02:44:42.353873	Amazing campus	0	neutral
181	csv	2026-03-28 02:44:42.454278	Amazing campus	-0.5	negative
182	csv	2026-03-28 02:44:42.558321	Great school	-0.5	negative
183	csv	2026-03-28 02:44:42.658012	Average experience	0.5	positive
184	csv	2026-03-28 02:44:42.754343	Could be better	-1	negative
185	csv	2026-03-28 02:44:42.853866	Well organized	-0.5	negative
186	csv	2026-03-28 02:44:42.954535	Average experience	0	neutral
187	csv	2026-03-28 02:44:43.058052	Well organized	0.5	positive
188	csv	2026-03-28 02:44:43.153664	Average experience	0.5	positive
189	csv	2026-03-28 02:44:43.237275	Well organized	0	neutral
190	csv	2026-03-28 02:44:43.333021	Well organized	1	positive
191	csv	2026-03-28 02:44:43.416909	Friendly staff	0.5	positive
192	csv	2026-03-28 02:44:43.518716	Could be better	-0.5	negative
193	csv	2026-03-28 02:44:43.608326	Good teachers	0	neutral
194	csv	2026-03-28 02:44:43.716365	Good teachers	0.5	positive
195	csv	2026-03-28 02:44:43.805469	Great school	0	neutral
196	csv	2026-03-28 02:44:43.884723	Great school	0	neutral
197	csv	2026-03-28 02:44:43.968194	Average experience	0	neutral
198	csv	2026-03-28 02:44:44.049511	Needs improvement	0	neutral
199	csv	2026-03-28 02:44:44.147021	Good teachers	0.5	positive
200	csv	2026-03-28 02:44:44.238661	Friendly staff	-0.5	negative
201	csv	2026-03-28 02:44:44.341536	Could be better	0	neutral
202	csv	2026-03-28 02:44:44.431025	Great school	1	positive
203	csv	2026-03-28 02:44:44.522853	Great school	0.5	positive
204	csv	2026-03-28 02:44:44.620869	Excellent facilities	-0.5	negative
205	csv	2026-03-28 02:44:44.713009	Great school	0	neutral
206	csv	2026-03-28 02:44:44.808068	Could be better	-0.5	negative
207	csv	2026-03-28 02:44:44.903976	Could be better	1	positive
208	csv	2026-03-28 02:44:44.991421	Great school	0	neutral
209	csv	2026-03-28 02:44:45.076938	Amazing campus	-1	negative
210	csv	2026-03-28 02:44:45.174795	Great school	-0.5	negative
211	csv	2026-03-28 02:44:45.264091	Good teachers	0.5	positive
212	csv	2026-03-28 02:44:45.355741	Great school	0.5	positive
213	csv	2026-03-28 02:44:45.440954	Needs improvement	-0.5	negative
214	csv	2026-03-28 02:44:45.547093	Good teachers	0.5	positive
215	csv	2026-03-28 02:44:45.646672	Needs improvement	1	positive
216	csv	2026-03-28 02:44:45.788028	Excellent facilities	-1	negative
217	csv	2026-03-28 02:44:45.874321	Good teachers	0	neutral
218	csv	2026-03-28 02:44:45.964132	Great school	1	positive
219	csv	2026-03-28 02:44:46.061714	Great school	0	neutral
220	csv	2026-03-28 02:44:46.166209	Good teachers	-0.5	negative
221	csv	2026-03-28 02:44:46.274376	Amazing campus	0.5	positive
222	csv	2026-03-28 02:47:18.894104	Nice environment	-1	negative
223	csv	2026-03-28 02:47:19.202708	Excellent facilities	0	neutral
224	csv	2026-03-28 02:47:19.314964	Amazing campus	-1	negative
225	csv	2026-03-28 02:47:19.444531	Great school	0	neutral
226	csv	2026-03-28 02:47:19.566407	Average experience	0.5	positive
227	csv	2026-03-28 02:47:19.67955	Good teachers	0.5	positive
228	csv	2026-03-28 02:47:19.776667	Average experience	0	neutral
229	csv	2026-03-28 02:47:19.856877	Well organized	-0.5	negative
230	csv	2026-03-28 02:47:19.960999	Amazing campus	0.5	positive
231	csv	2026-03-28 02:47:20.063975	Excellent facilities	1	positive
232	csv	2026-03-28 02:47:20.14936	Needs improvement	1	positive
233	csv	2026-03-28 02:47:20.252535	Could be better	0	neutral
234	csv	2026-03-28 02:47:20.356202	Good teachers	-0.5	negative
235	csv	2026-03-28 02:47:20.455808	Needs improvement	0	neutral
236	csv	2026-03-28 02:47:20.558936	Amazing campus	0.5	positive
237	csv	2026-03-28 02:47:20.645325	Could be better	-0.5	negative
238	csv	2026-03-28 02:47:20.724067	Friendly staff	0	neutral
239	csv	2026-03-28 02:47:20.822254	Nice environment	-1	negative
240	csv	2026-03-28 02:47:20.908144	Could be better	-1	negative
241	csv	2026-03-28 02:47:20.996169	Average experience	0	neutral
242	csv	2026-03-28 02:47:21.079066	Amazing campus	-1	negative
243	csv	2026-03-28 02:47:21.15782	Could be better	0.5	positive
244	csv	2026-03-28 02:47:21.231545	Great school	0	neutral
245	csv	2026-03-28 02:47:21.309283	Well organized	-0.5	negative
246	csv	2026-03-28 02:47:21.38928	Friendly staff	-0.5	negative
247	csv	2026-03-28 02:47:21.475065	Friendly staff	0.5	positive
248	csv	2026-03-28 02:47:21.57078	Excellent facilities	0	neutral
249	csv	2026-03-28 02:47:21.646239	Could be better	1	positive
250	csv	2026-03-28 02:47:21.738512	Could be better	0	neutral
251	csv	2026-03-28 02:47:21.840324	Could be better	-0.5	negative
252	csv	2026-03-28 02:47:21.933593	Great school	0.5	positive
253	csv	2026-03-28 02:47:22.009699	Good teachers	0	neutral
254	csv	2026-03-28 02:47:22.098026	Needs improvement	0	neutral
255	csv	2026-03-28 02:47:22.184933	Nice environment	0.5	positive
256	csv	2026-03-28 02:47:22.275319	Needs improvement	-0.5	negative
257	csv	2026-03-28 02:47:22.377446	Friendly staff	0	neutral
258	csv	2026-03-28 02:47:22.474063	Needs improvement	-1	negative
259	csv	2026-03-28 02:47:22.57278	Friendly staff	1	positive
260	csv	2026-03-28 02:47:22.652567	Great school	-1	negative
261	csv	2026-03-28 02:47:22.735051	Needs improvement	-0.5	negative
262	csv	2026-03-28 02:47:22.818296	Excellent facilities	1	positive
263	csv	2026-03-28 02:47:22.899816	Excellent facilities	1	positive
264	csv	2026-03-28 02:47:22.999117	Needs improvement	0	neutral
265	csv	2026-03-28 02:47:23.07949	Friendly staff	0.5	positive
266	csv	2026-03-28 02:47:23.161392	Well organized	0	neutral
267	csv	2026-03-28 02:47:23.2409	Nice environment	-0.5	negative
268	csv	2026-03-28 02:47:23.316059	Needs improvement	0.5	positive
269	csv	2026-03-28 02:47:23.399872	Excellent facilities	0	neutral
270	csv	2026-03-28 02:47:23.485389	Good teachers	1	positive
271	csv	2026-03-28 02:47:23.574256	Excellent facilities	1	positive
272	csv	2026-03-28 02:47:23.649129	Average experience	0	neutral
273	csv	2026-03-28 02:47:23.728746	Well organized	0.5	positive
274	csv	2026-03-28 02:47:23.816956	Excellent facilities	0.5	positive
275	csv	2026-03-28 02:47:23.894291	Excellent facilities	0	neutral
276	csv	2026-03-28 02:47:23.984221	Average experience	0	neutral
277	csv	2026-03-28 02:47:24.06719	Amazing campus	-1	negative
278	csv	2026-03-28 02:47:24.175778	Well organized	0.5	positive
279	csv	2026-03-28 02:47:24.25885	Great school	0	neutral
280	csv	2026-03-28 02:47:24.349309	Amazing campus	0	neutral
281	csv	2026-03-28 02:47:24.442157	Amazing campus	-0.5	negative
282	csv	2026-03-28 02:47:24.532508	Great school	-0.5	negative
283	csv	2026-03-28 02:47:24.608712	Average experience	0.5	positive
284	csv	2026-03-28 02:47:24.68894	Could be better	-1	negative
285	csv	2026-03-28 02:47:24.767185	Well organized	-0.5	negative
286	csv	2026-03-28 02:47:24.85114	Average experience	0	neutral
287	csv	2026-03-28 02:47:24.941205	Well organized	0.5	positive
288	csv	2026-03-28 02:47:25.024921	Average experience	0.5	positive
289	csv	2026-03-28 02:47:25.098974	Well organized	0	neutral
290	csv	2026-03-28 02:47:25.178201	Well organized	1	positive
291	csv	2026-03-28 02:47:25.259372	Friendly staff	0.5	positive
292	csv	2026-03-28 02:47:25.34087	Could be better	-0.5	negative
293	csv	2026-03-28 02:47:25.424717	Good teachers	0	neutral
294	csv	2026-03-28 02:47:25.522801	Good teachers	0.5	positive
295	csv	2026-03-28 02:47:25.613054	Great school	0	neutral
296	csv	2026-03-28 02:47:25.696061	Great school	0	neutral
297	csv	2026-03-28 02:47:25.77188	Average experience	0	neutral
298	csv	2026-03-28 02:47:25.854266	Needs improvement	0	neutral
299	csv	2026-03-28 02:47:25.938279	Good teachers	0.5	positive
300	csv	2026-03-28 02:47:26.034632	Friendly staff	-0.5	negative
301	csv	2026-03-28 02:47:26.11195	Could be better	0	neutral
302	csv	2026-03-28 02:47:26.192194	Great school	1	positive
303	csv	2026-03-28 02:47:26.273792	Great school	0.5	positive
304	csv	2026-03-28 02:47:26.352586	Excellent facilities	-0.5	negative
305	csv	2026-03-28 02:47:26.436795	Great school	0	neutral
306	csv	2026-03-28 02:47:26.521861	Could be better	-0.5	negative
307	csv	2026-03-28 02:47:26.597919	Could be better	1	positive
308	csv	2026-03-28 02:47:26.686898	Great school	0	neutral
309	csv	2026-03-28 02:47:26.76922	Amazing campus	-1	negative
310	csv	2026-03-28 02:47:26.871925	Great school	-0.5	negative
311	csv	2026-03-28 02:47:26.949179	Good teachers	0.5	positive
312	csv	2026-03-28 02:47:27.02694	Great school	0.5	positive
313	csv	2026-03-28 02:47:27.11381	Needs improvement	-0.5	negative
314	csv	2026-03-28 02:47:27.193185	Good teachers	0.5	positive
315	csv	2026-03-28 02:47:27.266969	Needs improvement	1	positive
316	csv	2026-03-28 02:47:27.340745	Excellent facilities	-1	negative
317	csv	2026-03-28 02:47:27.423919	Good teachers	0	neutral
318	csv	2026-03-28 02:47:27.514124	Great school	1	positive
319	csv	2026-03-28 02:47:27.590019	Great school	0	neutral
320	csv	2026-03-28 02:47:27.672594	Good teachers	-0.5	negative
321	csv	2026-03-28 02:47:27.747548	Amazing campus	0.5	positive
322	hassab	2026-04-04 20:46:43.068003	comment test	0	neutral
323	hassab	2026-04-04 20:46:45.697698	comment test	0	neutral
\.


--
-- TOC entry 3814 (class 0 OID 16927)
-- Dependencies: 281
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- TOC entry 3800 (class 0 OID 16827)
-- Dependencies: 267
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	group
3	auth	permission
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	Admin	analysis
8	Admin	aspect
9	Admin	authgroup
10	Admin	authgrouppermissions
11	Admin	authpermission
12	Admin	authuser
13	Admin	authusergroups
14	Admin	authuseruserpermissions
15	Admin	choice
16	Admin	comment
17	Admin	djangoadminlog
18	Admin	djangocontenttype
19	Admin	djangomigrations
20	Admin	djangosession
21	Admin	motcle
22	Admin	personalitytest
23	Admin	responsetest
24	Admin	school
25	Admin	schoolcomment
26	Admin	schoolspeciality
27	Admin	sessiontest
28	Admin	speciality
29	Admin	testquestion
30	Admin	user
31	authtoken	token
32	authtoken	tokenproxy
\.


--
-- TOC entry 3798 (class 0 OID 16819)
-- Dependencies: 265
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-02-27 12:11:27.553903+00
2	auth	0001_initial	2026-02-27 12:11:27.879578+00
3	admin	0001_initial	2026-02-27 12:11:27.930493+00
4	admin	0002_logentry_remove_auto_add	2026-02-27 12:11:27.940768+00
5	admin	0003_logentry_add_action_flag_choices	2026-02-27 12:11:27.961279+00
6	contenttypes	0002_remove_content_type_name	2026-02-27 12:11:28.010932+00
7	auth	0002_alter_permission_name_max_length	2026-02-27 12:11:28.035387+00
8	auth	0003_alter_user_email_max_length	2026-02-27 12:11:28.072224+00
9	auth	0004_alter_user_username_opts	2026-02-27 12:11:28.114901+00
10	auth	0005_alter_user_last_login_null	2026-02-27 12:11:28.16238+00
11	auth	0006_require_contenttypes_0002	2026-02-27 12:11:28.181745+00
12	auth	0007_alter_validators_add_error_messages	2026-02-27 12:11:28.221381+00
13	auth	0008_alter_user_username_max_length	2026-02-27 12:11:28.316355+00
14	auth	0009_alter_user_last_name_max_length	2026-02-27 12:11:28.332755+00
15	auth	0010_alter_group_name_max_length	2026-02-27 12:11:28.348926+00
16	auth	0011_update_proxy_permissions	2026-02-27 12:11:28.360367+00
17	auth	0012_alter_user_first_name_max_length	2026-02-27 12:11:28.380093+00
18	sessions	0001_initial	2026-02-27 12:11:28.446118+00
19	Admin	0001_initial	2026-02-27 12:36:36.138779+00
20	authtoken	0001_initial	2026-03-13 13:43:59.357899+00
21	authtoken	0002_auto_20160226_1747	2026-03-13 13:43:59.465007+00
22	authtoken	0003_tokenproxy	2026-03-13 13:43:59.531065+00
23	authtoken	0004_alter_tokenproxy_options	2026-03-13 13:43:59.594402+00
\.


--
-- TOC entry 3815 (class 0 OID 16955)
-- Dependencies: 282
-- Data for Name: django_session; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- TOC entry 3774 (class 0 OID 16623)
-- Dependencies: 241
-- Data for Name: mot_cle; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.mot_cle (id_mot_cle, content, id_school) FROM stdin;
\.


--
-- TOC entry 3777 (class 0 OID 16659)
-- Dependencies: 244
-- Data for Name: school_comment; Type: TABLE DATA; Schema: analytics; Owner: badr
--

COPY analytics.school_comment (id_ecole, id_comment) FROM stdin;
\.


--
-- TOC entry 3753 (class 0 OID 16412)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth."user" (id_user, username, password, email, role, prenom, nom, is_verified, verification_code, created_at) FROM stdin;
61	badr.hassab06@gmail.com	pbkdf2_sha256$1200000$82IirJVPiYoeQlh0J3BQqE$FWUPkQcIy2j1Sl7uVWYi1uIEtad6gdAgcpou6RKN6pY=	badr.hassab06@gmail.com	admin	Badr	HASSAB	t		2026-03-19 21:55:30.585654
62	waelkisannie@gmail.com	pbkdf2_sha256$1200000$jfXoptjYwrgWAJMW68ioOf$iG5nInj5qKH4PVnJY9Ucm99RzDIux6LY+8qoAfAv2ug=	waelkisannie@gmail.com	admin	Wael	Chama9ma9	t		2026-04-02 01:21:10.523211
\.


--
-- TOC entry 3785 (class 0 OID 16695)
-- Dependencies: 252
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- TOC entry 3787 (class 0 OID 16703)
-- Dependencies: 254
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- TOC entry 3783 (class 0 OID 16689)
-- Dependencies: 250
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	3	add_permission
6	Can change permission	3	change_permission
7	Can delete permission	3	delete_permission
8	Can view permission	3	view_permission
9	Can add group	2	add_group
10	Can change group	2	change_group
11	Can delete group	2	delete_group
12	Can view group	2	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
\.


--
-- TOC entry 3789 (class 0 OID 16709)
-- Dependencies: 256
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- TOC entry 3791 (class 0 OID 16717)
-- Dependencies: 258
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- TOC entry 3793 (class 0 OID 16723)
-- Dependencies: 260
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- TOC entry 3795 (class 0 OID 16781)
-- Dependencies: 262
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- TOC entry 3781 (class 0 OID 16681)
-- Dependencies: 248
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	group
3	auth	permission
4	auth	user
5	contenttypes	contenttype
6	sessions	session
\.


--
-- TOC entry 3779 (class 0 OID 16673)
-- Dependencies: 246
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-02-25 16:45:32.93735+00
2	auth	0001_initial	2026-02-25 16:45:33.817525+00
3	admin	0001_initial	2026-02-25 16:45:34.026278+00
4	admin	0002_logentry_remove_auto_add	2026-02-25 16:45:34.051192+00
5	admin	0003_logentry_add_action_flag_choices	2026-02-25 16:45:34.092802+00
6	contenttypes	0002_remove_content_type_name	2026-02-25 16:45:34.168016+00
7	auth	0002_alter_permission_name_max_length	2026-02-25 16:45:34.208915+00
8	auth	0003_alter_user_email_max_length	2026-02-25 16:45:34.247322+00
9	auth	0004_alter_user_username_opts	2026-02-25 16:45:34.284025+00
10	auth	0005_alter_user_last_login_null	2026-02-25 16:45:34.323989+00
11	auth	0006_require_contenttypes_0002	2026-02-25 16:45:34.344441+00
12	auth	0007_alter_validators_add_error_messages	2026-02-25 16:45:34.369992+00
13	auth	0008_alter_user_username_max_length	2026-02-25 16:45:34.456002+00
14	auth	0009_alter_user_last_name_max_length	2026-02-25 16:45:34.490345+00
15	auth	0010_alter_group_name_max_length	2026-02-25 16:45:34.539924+00
16	auth	0011_update_proxy_permissions	2026-02-25 16:45:34.567886+00
17	auth	0012_alter_user_first_name_max_length	2026-02-25 16:45:34.60759+00
18	sessions	0001_initial	2026-02-25 16:45:34.830593+00
\.


--
-- TOC entry 3796 (class 0 OID 16809)
-- Dependencies: 263
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: badr
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- TOC entry 3767 (class 0 OID 16532)
-- Dependencies: 234
-- Data for Name: school; Type: TABLE DATA; Schema: school; Owner: badr
--

COPY school.school (id_school, school_name, place, image, financial_type, education_type, university_name, teaching_language, website_link, maps_link, phone_number, email, description) FROM stdin;
1	Test School	Casablanca	\N	public	high school	\N	French	\N	\N	\N	\N	\N
3	EST	edq	\N	public	college	UH2C	bilingual				qsdffsqf	
4	École Supérieure de Technologie à Casablanca	N 1، KM 7, Casablanca	https://www.marocetude.com/adresse/wp-content/uploads/2023/07/AF1QipOuL8dO__ZmIlffS5WBgk8gFpgS1O-miN38sZHqw1600-h1000-k-no.jpeg	public	college	Université Hassan II - Casablanca	bilingual	https://www.est-uh2c.ac.ma/	https://maps.app.goo.gl/zDM4WX6BMN3agdQ27			
\.


--
-- TOC entry 3768 (class 0 OID 16540)
-- Dependencies: 235
-- Data for Name: school_speciality; Type: TABLE DATA; Schema: school; Owner: badr
--

COPY school.school_speciality (id_school, id_speciality) FROM stdin;
\.


--
-- TOC entry 3765 (class 0 OID 16505)
-- Dependencies: 232
-- Data for Name: speciality; Type: TABLE DATA; Schema: school; Owner: postgres
--

COPY school.speciality (id_speciality, speciality_name) FROM stdin;
\.


--
-- TOC entry 3759 (class 0 OID 16451)
-- Dependencies: 226
-- Data for Name: choice; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.choice (id_choice, content, id_question) FROM stdin;
\.


--
-- TOC entry 3755 (class 0 OID 16430)
-- Dependencies: 222
-- Data for Name: personality_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.personality_test (id_test, criteria) FROM stdin;
\.


--
-- TOC entry 3763 (class 0 OID 16483)
-- Dependencies: 230
-- Data for Name: response_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.response_test (id_response, id_session, id_question, id_choice) FROM stdin;
\.


--
-- TOC entry 3761 (class 0 OID 16465)
-- Dependencies: 228
-- Data for Name: session_test; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.session_test (id_session, id_utilisateur, id_test, date) FROM stdin;
\.


--
-- TOC entry 3757 (class 0 OID 16437)
-- Dependencies: 224
-- Data for Name: test_question; Type: TABLE DATA; Schema: test; Owner: postgres
--

COPY test.test_question (id_question, question_content, id_test) FROM stdin;
\.


--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 242
-- Name: analysis_id_analysis_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.analysis_id_analysis_seq', 614, true);


--
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 238
-- Name: aspect_id_aspect_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.aspect_id_aspect_seq', 18, true);


--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 270
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_group_id_seq', 1, false);


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 272
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 268
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_permission_id_seq', 128, true);


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 276
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_user_groups_id_seq', 1, false);


--
-- TOC entry 3845 (class 0 OID 0)
-- Dependencies: 274
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_user_id_seq', 1, false);


--
-- TOC entry 3846 (class 0 OID 0)
-- Dependencies: 278
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.auth_user_user_permissions_id_seq', 1, false);


--
-- TOC entry 3847 (class 0 OID 0)
-- Dependencies: 236
-- Name: comment_id_comment_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.comment_id_comment_seq', 323, true);


--
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 280
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.django_admin_log_id_seq', 1, false);


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 266
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.django_content_type_id_seq', 32, true);


--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 264
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.django_migrations_id_seq', 23, true);


--
-- TOC entry 3851 (class 0 OID 0)
-- Dependencies: 240
-- Name: mot_cle_id_mot_cle_seq; Type: SEQUENCE SET; Schema: analytics; Owner: badr
--

SELECT pg_catalog.setval('analytics.mot_cle_id_mot_cle_seq', 1, false);


--
-- TOC entry 3852 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_user_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.user_id_user_seq', 62, true);


--
-- TOC entry 3853 (class 0 OID 0)
-- Dependencies: 251
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- TOC entry 3854 (class 0 OID 0)
-- Dependencies: 253
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 3855 (class 0 OID 0)
-- Dependencies: 249
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 24, true);


--
-- TOC entry 3856 (class 0 OID 0)
-- Dependencies: 257
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- TOC entry 3857 (class 0 OID 0)
-- Dependencies: 255
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- TOC entry 3858 (class 0 OID 0)
-- Dependencies: 259
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- TOC entry 3859 (class 0 OID 0)
-- Dependencies: 261
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- TOC entry 3860 (class 0 OID 0)
-- Dependencies: 247
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 6, true);


--
-- TOC entry 3861 (class 0 OID 0)
-- Dependencies: 245
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: badr
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 18, true);


--
-- TOC entry 3862 (class 0 OID 0)
-- Dependencies: 233
-- Name: school_id_school_seq; Type: SEQUENCE SET; Schema: school; Owner: badr
--

SELECT pg_catalog.setval('school.school_id_school_seq', 4, true);


--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 231
-- Name: speciality_id_speciality_seq; Type: SEQUENCE SET; Schema: school; Owner: postgres
--

SELECT pg_catalog.setval('school.speciality_id_speciality_seq', 1, false);


--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 225
-- Name: choice_id_choice_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.choice_id_choice_seq', 1, false);


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 221
-- Name: personality_test_id_test_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.personality_test_id_test_seq', 1, false);


--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 229
-- Name: response_test_id_response_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.response_test_id_response_seq', 1, false);


--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 227
-- Name: session_test_id_session_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.session_test_id_session_seq', 1, false);


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 223
-- Name: test_question_id_question_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.test_question_id_question_seq', 1, false);


-- Completed on 2026-04-04 22:16:31

--
-- PostgreSQL database dump complete
--

\unrestrict ykQVP9BvjsudjGUR1iGkkJQCJsckvm5qDrEMSVLQBSwsfUSXgH33YYZgcDjEDvq

