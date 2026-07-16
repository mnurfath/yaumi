-- Yaumi MVP - Seed Data
-- Run this AFTER running 001_initial_schema.sql
-- Data sourced from public/adhkars.md

-- =============================================
-- CATEGORIES
-- =============================================
insert into public.categories (name, slug, description, display_order) values
  ('General Adhkar', 'general-adhkar', 'General supplications and remembrances', 1),
  ('After Obligatory Prayers', 'after-obligatory-prayers', 'Remembrances recited after the obligatory prayers', 2),
  ('Istikhara (Guidance)', 'istikhara', 'Supplication for seeking guidance in decision-making', 3),
  ('Mosque', 'mosque', 'Supplications for entering, leaving, and going to the mosque', 4),
  ('Wudu (Ablution)', 'wudu', 'Adhkar before and after ablution', 5),
  ('Adhan', 'adhan', 'Adhkar to be recited during and after the call to prayer', 6),
  ('After Voluntary Prayers', 'after-voluntary-prayers', 'Supplications after voluntary prayers such as Witr and Duha', 7)
on conflict (slug) do nothing;

-- =============================================
-- ADHKARS
-- =============================================
do $$
declare
  general_id      uuid;
  obligatory_id   uuid;
  istikhara_id    uuid;
  mosque_id       uuid;
  wudu_id         uuid;
  adhan_id        uuid;
  voluntary_id    uuid;
begin
  -- Get category IDs
  select id into general_id      from categories where slug = 'general-adhkar';
  select id into obligatory_id   from categories where slug = 'after-obligatory-prayers';
  select id into istikhara_id    from categories where slug = 'istikhara';
  select id into mosque_id       from categories where slug = 'mosque';
  select id into wudu_id         from categories where slug = 'wudu';
  select id into adhan_id        from categories where slug = 'adhan';
  select id into voluntary_id    from categories where slug = 'after-voluntary-prayers';

  -- =============================================
  -- I. GENERAL ADHKARS
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      general_id,
      'Asking Allah for Paradise and Refuge from the Fire',
      'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
      'Ya Dhal-Jalali wal-Ikram, ya Hayyu ya Qayyum inni as''alukal-jannah wa a''udhu bika minan-nar.',
      'O Lord of Majesty and Bounty, O Living, O Sustaining, indeed I ask You for Paradise and I seek refuge in You from the Fire.',
      'General',
      1,
      1
    ),
    (
      general_id,
      'Asking Allah by His Beautiful Names',
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللهُ لا إلهَ إِلَّا أَنْتَ الْأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُواً أَحَدٌ',
      'Allahumma inni as''aluka bi-anni ashhadu annaka Antallahu la ilaha illa Antal-Ahadus-Samadulladhi lam yalid wa lam yulad wa lam yakul-lahu kufuwan ahad.',
      'O Allah, I ask You by the fact that I bear witness that You are Allah. There is no deity except You, the One, the Self-Sufficient Master, who has not begotten, nor has been begotten, and to whom no one is equal.',
      'General',
      1,
      2
    );

  -- =============================================
  -- II. ADHKARS AFTER OBLIGATORY PRAYERS
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      obligatory_id,
      'Astaghfirullah & Allahumma Antas-Salam',
      'أَسْتَغْفِرُ اللَّهَ اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      'Astaghfirullah (3 times). Allahumma Antas-Salam, wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.',
      'I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
      'After obligatory prayer',
      3,
      1
    ),
    (
      obligatory_id,
      'La ilaha illallahu wahdahu (1st)',
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
      'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa ''ala kulli shay''in Qadir. Allahumma la mani''a lima a''tayta, wa la mu''tiya lima mana''ta, wa la yanfa''u dhal-jaddi minkal-jadd.',
      'None has the right to be worshipped but Allah alone, He has no partner, His is the dominion and His is the praise, and He is Able to do all things. O Allah, there is none who can withhold what You give, and none may give what You have withheld; and the might of a mighty person cannot benefit him against You.',
      'After obligatory prayer',
      1,
      2
    ),
    (
      obligatory_id,
      'La ilaha illallahu wahdahu (2nd)',
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ ، لَا إِلَهَ إِلَّا اللهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ ، لَهُ النعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ ، لا إلهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ',
      'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa ''ala kulli shay''in Qadir. La hawla wa la quwwata illa billah, la ilaha illallah, wa la na''budu illa iyyah, lahun-ni''matu wa lahul-fadlu wa lahuth-thana''ul-hasan, la ilaha illallahu mukhlisina lahud-dina wa law karihal-kafirun.',
      'None has the right to be worshipped but Allah alone, He has no partner, His is the dominion and His is the praise, and He is Able to do all things. There is no power and no might except by Allah. None has the right to be worshipped but Allah, and we do not worship except Him. For Him is all favor, grace, and glorious praise. None has the right to be worshipped but Allah, making religion purely for Him, even if the disbelievers dislike it.',
      'After obligatory prayer',
      1,
      3
    ),
    (
      obligatory_id,
      'Subhanallah, wal-hamdulillah, wallahu Akbar',
      'سُبْحَانَ اللهِ ، وَالْحَمْدُ لِلَّهِ ، وَاللهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      'Subhanallah, wal-hamdulillah, wallahu Akbar (33 times each). La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa ''ala kulli shay''in Qadir.',
      'Glory is to Allah, and praise is to Allah, and Allah is the Most Great (33 times each). None has the right to be worshipped but Allah alone, He has no partner, His is the dominion and His is the praise, and He is Able to do all things.',
      'After obligatory prayer',
      33,
      4
    ),
    (
      obligatory_id,
      'Surah Al-Ikhlas',
      'قُلْ هُوَ اللَّهُ أَحَدٌ * اللهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      'Qul huwallahu ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.',
      'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."',
      'After Dhuhr, Asr, Isha: once; After Fajr and Maghrib: three times',
      1,
      5
    ),
    (
      obligatory_id,
      'Surah Al-Falaq',
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      'Qul a''udhu bi rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-''uqad. Wa min sharri hasidin idha hasad.',
      'Say, "I seek refuge in the Lord of daybreak, From the evil of that which He created, And from the evil of darkness when it settles, And from the evil of the blowers in knots, And from the evil of an envier when he envies."',
      'After Dhuhr, Asr, Isha: once; After Fajr and Maghrib: three times',
      1,
      6
    ),
    (
      obligatory_id,
      'Surah An-Nas',
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
      'Qul a''udhu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.',
      'Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind. The God of mankind, From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind."',
      'After Dhuhr, Asr, Isha: once; After Fajr and Maghrib: three times',
      1,
      7
    ),
    (
      obligatory_id,
      'Ayat al-Kursi',
      'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      'Allahu la ilaha illa Huwal-Hayyul-Qayyum la ta''khudhuhu sinatun wa la nawm lahu ma fis-samawati wa ma fil-ard man dhal-ladhi yashfa''u ''indahu illa bi-idhnih ya''lamu ma bayna aydihim wa ma khalfahum wa la yuhituna bi-shay''im-min ''ilmihi illa bima sha''a wasi''a kursiyyuhus-samawati wal-ard wa la ya''uduhu hifzhuhuma wa Huwal-''Aliyyul-''Azhim.',
      'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
      'After each obligatory prayer',
      1,
      8
    ),
    (
      obligatory_id,
      'La ilaha illallahu wahdahu (10 times after Fajr and Maghrib)',
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu yuhyi wa yumitu wa Huwa ''ala kulli shay''in qadir.',
      'None has the right to be worshipped but Allah alone, He has no partner, His is the dominion and His is the praise, He gives life and causes death, and He is Able to do all things.',
      'After Maghrib and Fajr prayers (10 times)',
      10,
      9
    ),
    (
      obligatory_id,
      'Dua After Fajr for Knowledge, Provision, and Acceptable Deeds',
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً ، ورِزْقاً طيباً ، وَعَمَلًا مُتَقَبَّلًا',
      'Allahumma inni as''aluka ''ilman nafi''an, wa rizqan tayyiban, wa ''amalan mutaqabbalan.',
      'O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.',
      'After Fajr prayer',
      1,
      10
    );

  -- =============================================
  -- III. ISTIKHARA (GUIDANCE)
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      istikhara_id,
      'Dua of Istikhara',
      'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدُرُ وَلَا أَقْدِرُ ، وَتَعْلَمُ ، وَلَا أَعْلَمُ ، وَأَنْتَ عَلَّامُ الْغُيُوبِ ، اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
      'Allahumma inni astakhiruka bi''ilmika, wa astaqdiruka biqudratika, wa as''aluka min fadlikal-''azim, fa''innaka taqdiru wa la aqdir, wa ta''lamu wa la a''lam, wa Anta ''allamul-ghuyub. Allahumma in kunta ta''lamu anna hadhal-amra - (name the matter) - khayrun li fi dini wa ma''ashi wa ''aqibati amri faqdurhu li wa yassirhu li thumma barik li fih, wa in kunta ta''lamu anna hadhal-amra sharrun li fi dini wa ma''ashi wa ''aqibati amri fasrifhu ''anni wasrifni ''anhu waqdur liyal-khayra haythu kana thumma ardini bih.',
      'O Allah, I seek Your counsel through Your knowledge, and I seek Your strength through Your power, and I ask You of Your immense bounty. For indeed You are Able and I am not, and You know and I do not, and You are the Knower of the unseen. O Allah, if You know that this matter [name the matter] is good for me in my religion, my livelihood, and the outcome of my affairs, then ordain it for me and make it easy for me, then bless me in it. But if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affairs, then turn it away from me and turn me away from it, and ordain for me the good wherever it may be, and make me pleased with it.',
      'Salat al-Istikhara (prayer of seeking guidance)',
      1,
      1
    );

  -- =============================================
  -- IV. MOSQUE SUPPLICATIONS
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      mosque_id,
      'Dua When Going to the Mosque',
      'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُوراً، وَفِي لِسَانِي نُوراً، وَفِي سَمْعِي نُوراً، وَفِي بَصَرِي نُوراً، وَمِنْ فَوْقِي نُوراً، وَمِنْ تَحْتِي نُوراً، وَعَنْ يَمِينِي نُوراً، وَعَنْ شِمَالِي نُوراً، وَمِنْ أَمَامِي نُوراً، وَمِنْ خَلْفِي نُوراً، وَاجْعَلْ فِي نَفْسِي نُوراً، وَأَعْظِمْ لِي نُوراً، وَعَظِّمْ لِي نُوراً، وَاجْعَلْ لِي نُوراً، وَاجْعَلْنِي نُوراً، اللَّهُمَّ أَعْطِنِي نُوراً، وَاجْعَلْ فِي عَصَبِي نُوراً، وَفِي لَحْمِي نُوراً، وَفِي دَمِي نُوراً، وَفِي شَعْرِي نُوراً، وَفِي بَشَرِي نُوراً',
      'Allahummaj''al fi qalbi nuran, wa fi lisani nuran, wa fi sam''i nuran, wa fi basari nuran, wa min fawqi nuran, wa min tahti nuran, wa ''an yamini nuran, wa ''an shimali nuran, wa min amami nuran, wa min khalfi nuran, waj''al fi nafsi nuran, wa a''zhim li nuran, wa ''azzhim li nuran, waj''al li nuran, waj''alni nuran, Allahumma a''tini nuran, waj''al fi ''asabi nuran, wa fi lahmi nuran, wa fi dami nuran, wa fi sha''ri nuran, wa fi bashari nuran.',
      'O Allah, place light in my heart, and light on my tongue, and light in my hearing, and light in my sight, and light above me, and light below me, and light on my right, and light on my left, and light in front of me, and light behind me, and place light in my soul, and magnify for me light, and amplify for me light, and make for me light, and make me light. O Allah, grant me light, and place light in my nerves, and light in my flesh, and light in my blood, and light in my hair, and light in my skin.',
      'Going to the mosque',
      1,
      1
    ),
    (
      mosque_id,
      'Dua When Entering the Mosque (1)',
      'أَعُوذُ بِاللهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ',
      'A''udhu billahil-''Azim, wa bi-wajhihil-karim, wa sultanihil-qadim, minash-shaytanir-rajim.',
      'I seek refuge in Allah the Almighty, and in His Noble Face, and in His Eternal Authority, from the accursed devil.',
      'Entering the mosque',
      1,
      2
    ),
    (
      mosque_id,
      'Dua When Entering the Mosque (2)',
      'بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      'Bismillahi, was-salatu was-salamu ''ala rasulillah, Allahummaftah li abwaba rahmatik.',
      'In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open for me the doors of Your mercy.',
      'Entering the mosque',
      1,
      3
    ),
    (
      mosque_id,
      'Dua When Leaving the Mosque',
      'بِسْمِ اللهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
      'Bismillahi was-salatu was-salamu ''ala rasulillah, Allahumma inni as''aluka min fadlik, Allahumma''simni minash-shaytanir-rajim.',
      'In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You from Your bounty. O Allah, protect me from the accursed devil.',
      'Leaving the mosque',
      1,
      4
    );

  -- =============================================
  -- V. ADHKARS BEFORE AND AFTER WUDU (ABLUTION)
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      wudu_id,
      'Bismillah (Before Ablution)',
      'بِسْمِ اللهِ',
      'Bismillah.',
      'In the name of Allah.',
      'Before ablution',
      1,
      1
    ),
    (
      wudu_id,
      'Shahada (After Ablution 1)',
      'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ',
      'Ashhadu an la ilaha illallahu wahdahu la sharika lah wa ashhadu anna Muhammadan ''abduhu wa rasuluh.',
      'I bear witness that there is no deity worthy of worship except Allah alone, without any partners, and I bear witness that Muhammad is His slave and Messenger.',
      'After ablution',
      1,
      2
    ),
    (
      wudu_id,
      'Dua to be Among the Repentant and Purified (After Ablution 2)',
      'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
      'Allahummaj''alni minat-tawwabina waj''alni minal-mutatahhirin.',
      'O Allah, make me of those who constantly repent and make me of those who purify themselves.',
      'After ablution',
      1,
      3
    ),
    (
      wudu_id,
      'Subhanaka Allahumma (After Ablution 3)',
      'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
      'Subhanakallahumma wa bihamdik, ashhadu an la ilaha illa Ant, astaghfiruka wa atubu ilayk.',
      'Glory is to You, O Allah, and praise is to You. I bear witness that there is no deity except You. I seek Your forgiveness and repent to You.',
      'After ablution',
      1,
      4
    );

  -- =============================================
  -- VI. ADHKARS OF THE ADHAN
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      adhan_id,
      'La hawla wa la quwwata illa billah (Upon hearing Hayya ''alas-Salah & Hayya ''alal-Falah)',
      'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
      'La hawla wa la quwwata illa billah.',
      'There is no power and no might except by Allah.',
      'Upon hearing "Hayya ''alas-Salah" and "Hayya ''alal-Falah" during the Adhan',
      1,
      1
    ),
    (
      adhan_id,
      'Responding to the Shahada After the Adhan',
      'وَأَنَا أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ، رَضِيتُ بِاللهِ رَبَّاً، وَبِمُحَمَّدٍ رَسُولاً، وَبِالْإِسْلَامِ دِيناً',
      'Wa ana ashhadu an la ilaha illallahu wahdahu la sharika lah wa anna Muhammadan ''abduhu wa rasuluh, raditu billahi Rabban, wa bi-Muhammadin rasulan, wa bil-islami dina.',
      'And I bear witness that there is no deity worthy of worship except Allah alone, without any partners, and that Muhammad is His slave and Messenger. I am pleased with Allah as my Lord, with Muhammad as my Messenger, and with Islam as my religion.',
      'After the Mu''adhin says the Shahada',
      1,
      2
    ),
    (
      adhan_id,
      'Dua After the Adhan is Complete',
      'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّداً الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ',
      'Allahumma Rabba hadhihid-da''watit-tammah, was-salatil-qa''imah, ati Muhammadanil-wasilata wal-fadilah, wab''ath-hu maqaman mahmudanilladhi wa''adtah, innaka la tukhliful-mi''ad.',
      'O Allah, Lord of this perfect call and the established prayer, grant Muhammad the intercession and favor, and raise him to the honored station that You have promised him, for verily You do not break Your promise.',
      'After the Adhan is complete',
      1,
      3
    );

  -- =============================================
  -- VII. ADHKARS AFTER VOLUNTARY PRAYERS
  -- =============================================
  insert into public.adhkars (category_id, title, arabic_text, latin_transliteration, english_translation, recitation_context, target_count, display_order) values
    (
      voluntary_id,
      'Subhanal-Malikil-Quddus (After Witr)',
      'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ',
      'Subhanal-Malikil-Quddus.',
      'Glory be to the Sovereign, the Most Holy.',
      'After Witr prayer (3 times, raising voice on the 3rd)',
      3,
      1
    ),
    (
      voluntary_id,
      'Dua After Duha Prayer',
      'اللَّهُمَّ اغْفِرْ لِي، وَتُبْ عَلَيَّ؛ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ',
      'Allahummaghfir li, wa tub ''alayya; innaka Antat-Tawwabul-Ghafur.',
      'O Allah, forgive me and accept my repentance; indeed, You are the Accepter of repentance, the Oft-Forgiving.',
      'After Duha prayer (100 times)',
      100,
      2
    );
end $$;

-- =============================================
-- SALAH EVENTS
-- =============================================
insert into public.salah_events (name, slug, event_type, display_order) values
  ('Fajr', 'fajr', 'WAJIB', 1),
  ('Dhuhr', 'dhuhr', 'WAJIB', 2),
  ('Asr', 'asr', 'WAJIB', 3),
  ('Maghrib', 'maghrib', 'WAJIB', 4),
  ('Isha', 'isha', 'WAJIB', 5),
  ('Dhuha', 'dhuha', 'SUNNAH', 6),
  ('Witr', 'witr', 'SUNNAH', 7),
  ('Tahajjud', 'tahajjud', 'SUNNAH', 8),
  ('Going to Mosque', 'going-to-mosque', 'IBADAH', 9),
  ('Entering Mosque', 'entering-mosque', 'IBADAH', 10),
  ('Leaving Mosque', 'leaving-mosque', 'IBADAH', 11),
  ('Wudu', 'wudu', 'IBADAH', 12),
  ('Adhan', 'adhan', 'IBADAH', 13)
on conflict (slug) do nothing;

-- =============================================
-- UPDATE ADHKAR TIMING TYPES
-- =============================================
update public.adhkars set timing_type = 'GENERAL'
where category_id in (select id from categories where slug in ('general-adhkar', 'istikhara'));

update public.adhkars set timing_type = 'SPECIFIC_SALAH'
where category_id in (select id from categories where slug in ('after-obligatory-prayers', 'after-voluntary-prayers'));

update public.adhkars set timing_type = 'SPECIFIC_IBADAH'
where category_id in (select id from categories where slug in ('mosque', 'wudu', 'adhan'));

-- =============================================
-- ADHKAR <-> SALAH EVENT MAPPINGS
-- =============================================
do $$
declare
  fajr_id         uuid;
  dhuhr_id        uuid;
  asr_id          uuid;
  maghrib_id      uuid;
  isha_id         uuid;
  dhuha_id        uuid;
  witr_id         uuid;
  going_id        uuid;
  entering_id     uuid;
  leaving_id      uuid;
  wudu_id         uuid;
  adhan_id        uuid;
begin
  select id into fajr_id     from salah_events where slug = 'fajr';
  select id into dhuhr_id    from salah_events where slug = 'dhuhr';
  select id into asr_id      from salah_events where slug = 'asr';
  select id into maghrib_id  from salah_events where slug = 'maghrib';
  select id into isha_id     from salah_events where slug = 'isha';
  select id into dhuha_id    from salah_events where slug = 'dhuha';
  select id into witr_id     from salah_events where slug = 'witr';
  select id into going_id    from salah_events where slug = 'going-to-mosque';
  select id into entering_id from salah_events where slug = 'entering-mosque';
  select id into leaving_id  from salah_events where slug = 'leaving-mosque';
  select id into wudu_id     from salah_events where slug = 'wudu';
  select id into adhan_id    from salah_events where slug = 'adhan';

  -- After Obligatory Prayers -> all 5 wajib prayers
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, se.id
    from public.adhkars a
    cross join (values (fajr_id), (dhuhr_id), (asr_id), (maghrib_id), (isha_id)) as se(id)
    where a.category_id = (select id from categories where slug = 'after-obligatory-prayers')
    on conflict do nothing;

  -- Remove incorrect mappings for Fajr/Maghrib-specific adhkar
  delete from public.adhkar_salah_events
    where adhkar_id = (select id from adhkars where title = 'La ilaha illallahu wahdahu (10 times after Fajr and Maghrib)')
    and salah_event_id in (dhuhr_id, asr_id, isha_id);

  -- Remove incorrect mappings for Fajr-specific adhkar
  delete from public.adhkar_salah_events
    where adhkar_id = (select id from adhkars where title = 'Dua After Fajr for Knowledge, Provision, and Acceptable Deeds')
    and salah_event_id in (dhuhr_id, asr_id, maghrib_id, isha_id);

  -- After Voluntary Prayers: Subhanal-Malikil-Quddus -> Witr
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, witr_id
    from public.adhkars a
    where a.title = 'Subhanal-Malikil-Quddus (After Witr)'
    on conflict do nothing;

  -- After Voluntary Prayers: Dua After Duha -> Dhuha
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, dhuha_id
    from public.adhkars a
    where a.title = 'Dua After Duha Prayer'
    on conflict do nothing;

  -- Mosque: Going -> going-to-mosque
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, going_id
    from public.adhkars a
    where a.title = 'Dua When Going to the Mosque'
    on conflict do nothing;

  -- Mosque: Entering -> entering-mosque
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, entering_id
    from public.adhkars a
    where a.title like 'Dua When Entering the Mosque%'
    on conflict do nothing;

  -- Mosque: Leaving -> leaving-mosque
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, leaving_id
    from public.adhkars a
    where a.title = 'Dua When Leaving the Mosque'
    on conflict do nothing;

  -- Wudu -> wudu event
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, wudu_id
    from public.adhkars a
    where a.category_id = (select id from categories where slug = 'wudu')
    on conflict do nothing;

  -- Adhan -> adhan event
  insert into public.adhkar_salah_events (adhkar_id, salah_event_id)
    select a.id, adhan_id
    from public.adhkars a
    where a.category_id = (select id from categories where slug = 'adhan')
    on conflict do nothing;
end $$;