
-- Insert 48 Algerian wilayas
INSERT INTO wilayas (code, name_arabic, name_french, name_english) VALUES
('01', 'أدرار', 'Adrar', 'Adrar'),
('02', 'الشلف', 'Chlef', 'Chlef'),
('03', 'الأغواط', 'Laghouat', 'Laghouat'),
('04', 'أم البواقي', 'Oum El Bouaghi', 'Oum El Bouaghi'),
('05', 'باتنة', 'Batna', 'Batna'),
('06', 'بجاية', 'Béjaïa', 'Bejaia'),
('07', 'بسكرة', 'Biskra', 'Biskra'),
('08', 'بشار', 'Béchar', 'Bechar'),
('09', 'البليدة', 'Blida', 'Blida'),
('10', 'البويرة', 'Bouira', 'Bouira'),
('11', 'تمنراست', 'Tamanrasset', 'Tamanrasset'),
('12', 'تبسة', 'Tébessa', 'Tebessa'),
('13', 'تلمسان', 'Tlemcen', 'Tlemcen'),
('14', 'تيارت', 'Tiaret', 'Tiaret'),
('15', 'تيزي وزو', 'Tizi Ouzou', 'Tizi Ouzou'),
('16', 'الجزائر', 'Alger', 'Algiers'),
('17', 'الجلفة', 'Djelfa', 'Djelfa'),
('18', 'جيجل', 'Jijel', 'Jijel'),
('19', 'سطيف', 'Sétif', 'Setif'),
('20', 'سعيدة', 'Saïda', 'Saida'),
('21', 'سكيكدة', 'Skikda', 'Skikda'),
('22', 'سيدي بلعباس', 'Sidi Bel Abbès', 'Sidi Bel Abbes'),
('23', 'عنابة', 'Annaba', 'Annaba'),
('24', 'قالمة', 'Guelma', 'Guelma'),
('25', 'قسنطينة', 'Constantine', 'Constantine'),
('26', 'المدية', 'Médéa', 'Medea'),
('27', 'مستغانم', 'Mostaganem', 'Mostaganem'),
('28', 'المسيلة', 'M''Sila', 'M''Sila'),
('29', 'معسكر', 'Mascara', 'Mascara'),
('30', 'ورقلة', 'Ouargla', 'Ouargla'),
('31', 'وهران', 'Oran', 'Oran'),
('32', 'البيض', 'El Bayadh', 'El Bayadh'),
('33', 'إليزي', 'Illizi', 'Illizi'),
('34', 'برج بوعريريج', 'Bordj Bou Arréridj', 'Bordj Bou Arreridj'),
('35', 'بومرداس', 'Boumerdès', 'Boumerdes'),
('36', 'الطارف', 'El Tarf', 'El Tarf'),
('37', 'تندوف', 'Tindouf', 'Tindouf'),
('38', 'تيسمسيلت', 'Tissemsilt', 'Tissemsilt'),
('39', 'الوادي', 'El Oued', 'El Oued'),
('40', 'خنشلة', 'Khenchela', 'Khenchela'),
('41', 'سوق أهراس', 'Souk Ahras', 'Souk Ahras'),
('42', 'تيبازة', 'Tipaza', 'Tipaza'),
('43', 'ميلة', 'Mila', 'Mila'),
('44', 'عين الدفلى', 'Aïn Defla', 'Ain Defla'),
('45', 'النعامة', 'Naâma', 'Naama'),
('46', 'عين تيموشنت', 'Aïn Témouchent', 'Ain Temouchent'),
('47', 'غرداية', 'Ghardaïa', 'Ghardaia'),
('48', 'غليزان', 'Relizane', 'Relizane')
ON CONFLICT (code) DO NOTHING;

-- Insert specialties
INSERT INTO specialties (name_arabic, name_french, name_english) VALUES
('طب عام', 'Médecine générale', 'General Medicine'),
('طب الأطفال', 'Pédiatrie', 'Pediatrics'),
('أمراض النساء والتوليد', 'Gynécologie-Obstétrique', 'Gynecology & Obstetrics'),
('طب القلب والشرايين', 'Cardiologie', 'Cardiology'),
('طب العظام والمفاصل', 'Orthopédie', 'Orthopedics'),
('طب الجلد والتجميل', 'Dermatologie', 'Dermatology'),
('طب العيون', 'Ophtalmologie', 'Ophthalmology'),
('طب الأسنان', 'Dentisterie', 'Dentistry'),
('طب الأعصاب', 'Neurologie', 'Neurology'),
('جراحة عامة', 'Chirurgie générale', 'General Surgery'),
('طب الطوارئ', 'Médecine d''urgence', 'Emergency Medicine'),
('طب الصدر والجهاز التنفسي', 'Pneumologie', 'Pulmonology'),
('طب الكلى', 'Néphrologie', 'Nephrology'),
('الطب النفسي', 'Psychiatrie', 'Psychiatry'),
('طب الأورام', 'Oncologie', 'Oncology')
ON CONFLICT DO NOTHING;

-- Insert baladiyas for Annaba (wilaya 23)
INSERT INTO baladiyas (wilaya_id, name_arabic, name_french) VALUES
(23, 'عنابة', 'Annaba'),
(23, 'سرايدي', 'Seraïdi'),
(23, 'العلمة', 'El Eulma'),
(23, 'الحجار', 'El Hadjar'),
(23, 'برحال', 'Berrahal'),
(23, 'الشرفة', 'Chorfa'),
(23, 'عين الباردة', 'Aïn Berda'),
(23, 'شطايبي', 'Chétaibi');

-- Insert baladiyas for Algiers (wilaya 16)
INSERT INTO baladiyas (wilaya_id, name_arabic, name_french) VALUES
(16, 'الجزائر الوسطى', 'Alger Centre'),
(16, 'باب الوادي', 'Bab El Oued'),
(16, 'حسين داي', 'Hussein Dey'),
(16, 'بئر مراد رايس', 'Bir Mourad Raïs'),
(16, 'الحراش', 'El Harrach'),
(16, 'بن عكنون', 'Ben Aknoun'),
(16, 'درارية', 'Draria'),
(16, 'بابا حسن', 'Baba Hassen');

-- Insert baladiyas for Oran (wilaya 31)
INSERT INTO baladiyas (wilaya_id, name_arabic, name_french) VALUES
(31, 'وهران', 'Oran'),
(31, 'بئر الجير', 'Bir El Djir'),
(31, 'سيدي الشحمي', 'Sidi El Chami'),
(31, 'عرزيو', 'Arzew'),
(31, 'مرسى الكبير', 'Mers El Kébir');

-- Insert baladiyas for Constantine (wilaya 25)
INSERT INTO baladiyas (wilaya_id, name_arabic, name_french) VALUES
(25, 'قسنطينة', 'Constantine'),
(25, 'ابن باديس', 'Ibn Badis'),
(25, 'زيغود يوسف', 'Zighoud Youcef'),
(25, 'عين عبيد', 'Aïn Abid');

-- Insert sample doctors
INSERT INTO doctors (name, specialty_id, wilaya_id, baladiya_id, address, phone, fee, rating, reviews_count, years_experience, patients_count, satisfaction_rate, about, tags, image_url, is_verified, lat, lng) VALUES
('د. أمين بن علي', 3, 23, 4, 'شارع الاستقلال، الحجار - عنابة', '0555 12 34 56', 1500, 4.9, 280, 12, 2800, 98, 'أخصائي في أمراض النساء والتوليد، علاج عقم المرأة، متابعة الحمل، الجراحة، علاج عنق الرحم باللیزر، أمراض الثدي.', ARRAY['النساء والتوليد', 'الجراحة', 'متابعة الحمل'], 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400', true, 36.7753, 7.7242),
('د. سامية براح', 2, 23, 1, 'حي السلام، عنابة', '0554 23 45 67', 1200, 4.8, 190, 8, 1500, 95, 'طبيبة أطفال وحديثي الولادة، خبرة في أمراض الأطفال المزمنة وتطعيم الأطفال.', ARRAY['طب الأطفال', 'حديثي الولادة', 'التطعيم'], 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400', true, 36.9000, 7.7667),
('د. كريم حمداني', 5, 23, 1, 'سيدي عمار، عنابة', '0553 34 56 78', 1000, 4.7, 156, 10, 2000, 92, 'أخصائي في طب العظام والمفاصل، الكسور والتشوهات، تركيب الأطراف الصناعية.', ARRAY['العظام', 'المفاصل', 'الكسور'], 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400', true, 36.8900, 7.7500),
('د. وليد زروقي', 4, 23, 1, 'اليونيفرسيتي، عنابة', '0552 45 67 89', 1000, 4.6, 120, 15, 3000, 90, 'أخصائي في طب القلب والشرايين، قسطرة قلبية، ترقيع الأوعية الدموية.', ARRAY['القلب', 'الشرايين', 'القسطرة'], 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400', true, 36.9100, 7.7600),
('د. فاطمة قاسمي', 6, 16, 10, 'بن عكنون، الجزائر', '0551 56 78 90', 800, 4.5, 95, 7, 1200, 88, 'أخصائية الأمراض الجلدية والتجميل الطبي.', ARRAY['الجلد', 'التجميل', 'الليزر'], 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400', true, 36.7500, 3.0800),
('د. يوسف بوزيد', 1, 31, 17, 'وهران المدينة', '0550 67 89 01', 600, 4.3, 75, 5, 900, 85, 'طبيب عام، متابعة المرضى المزمنين والوقاية الصحية.', ARRAY['طب عام', 'المتابعة', 'الوقاية'], 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400', true, 35.6969, -0.6331);

-- Insert sample pharmacies
INSERT INTO pharmacies (name, wilaya_id, baladiya_id, address, phone, on_call_24h, night_shift) VALUES
('صيدلية الشفاء', 23, 1, 'شارع الاستقلال، عنابة', '038 12 34 56', true, true),
('صيدلية الحياة', 23, 4, 'حي الحجار، عنابة', '038 23 45 67', false, true),
('صيدلية النور', 23, 1, 'شارع الثورة، عنابة', '038 34 56 78', true, false),
('صيدلية السلام', 16, 9, 'الجزائر الوسطى', '021 12 34 56', true, true),
('صيدلية الرحمة', 31, 17, 'وهران المدينة', '041 23 45 67', false, false);

-- Insert sample hospitals
INSERT INTO hospitals (name, type, wilaya_id, baladiya_id, address, phone, services, beds_count) VALUES
('مستشفى ابن سينا', 'public', 23, 1, 'شارع الاستقلال، عنابة', '038 11 22 33', ARRAY['طب عام', 'جراحة', 'طوارئ', 'مختبر'], 300),
('مستشفى الشهداء', 'public', 23, 1, 'حي العلية، عنابة', '038 44 55 66', ARRAY['طب نساء', 'أطفال', 'طوارئ'], 250),
('عيادة الصحة والتضامن', 'private', 23, 1, 'شارع بن بادة، عنابة', '038 77 88 99', ARRAY['طب عام', 'تصوير طبي', 'مختبر'], 50),
('مستشفى مصطفى باشا', 'public', 16, 9, 'الجزائر الوسطى', '021 33 44 55', ARRAY['كل التخصصات', 'طوارئ', 'جراحة'], 800),
('مستشفى الجمهورية', 'public', 31, 17, 'وهران المدينة', '041 55 66 77', ARRAY['طب عام', 'جراحة', 'طوارئ'], 400);

-- Insert sample blood donors
INSERT INTO blood_donors (name, blood_type, wilaya_id, baladiya_id, phone, is_available, hide_name) VALUES
('يوسف بوزيد', 'O+', 23, 1, '0555 12 34 56', true, false),
('سارة يوزري', 'A+', 23, 4, '0554 23 45 67', true, false),
('محمد لعقابي', 'B+', 23, 1, '0553 34 56 78', true, false),
('فاطمة قاسمي', 'AB+', 16, 9, '0552 45 67 89', true, true),
('أحمد بوزيد', 'O-', 31, 17, '0551 56 78 90', false, false);

-- Insert sample equipment donors
INSERT INTO equipment_donors (equipment_type, condition, wilaya_id, baladiya_id, phone, description, is_available) VALUES
('كرسي متحرك', 'جيدة', 23, 1, '0555 11 22 33', 'كرسي متحرك يدوي، حالة ممتازة', true),
('عكاز', 'جيدة', 23, 4, '0554 22 33 44', 'عكازان، قابل للتعديل', true),
('سرير طبي كهربائي', 'جيدة', 16, 9, 'وسط المدينة', 'سرير طبي كامل الوظائف', true),
('جهاز أكسجين', 'جيدة', 31, 17, '0551 44 55 66', 'جهاز أكسجين منزلي', true),
('أطراف اصطناعية', 'مشابه للجديد', 25, 22, '0550 55 66 77', 'طرف اصطناعي للساق', true);
