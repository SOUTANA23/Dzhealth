export type Language = 'ar' | 'fr' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // ─── عام ───────────────────────────────────────
    appName: 'DzHealth',
    tagline: 'كل الخدمات الصحية في مكان واحد',
    loading: 'جاري التحميل...',
    noResults: 'لا توجد نتائج',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    viewAll: 'عرض الكل',
    next: 'التالي',
    skip: 'تخطى',
    getStarted: 'ابدأ الآن',
    more: 'المزيد',
    available: 'متاح',
    notAvailable: 'غير متاح',
    confirmed: 'مؤكد',
    cancelled: 'ملغى',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',

    // ─── تنقل ──────────────────────────────────────
    home: 'الرئيسية',
    search: 'بحث',
    add: 'إضافة',
    appointments: 'المواعيد',
    profile: 'ملفي',

    // ─── خدمات ─────────────────────────────────────
    doctors: 'الأطباء',
    pharmacies: 'الصيدليات',
    hospitals: 'المستشفيات',
    bloodDonors: 'متبرعو الدم',
    equipment: 'المعدات الطبية',
    herbalMedicine: 'الطب البديل',
    civilProtection: 'الحماية المدنية',
    vetClinics: 'الطب البيطري',

    // ─── مصادقة ────────────────────────────────────
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordMismatch: 'كلمتا المرور غير متطابقتان',
    forgotPassword: 'نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب؟',
    terms: 'الشروط والأحكام',
    agreeToTerms: 'أوافق على الشروط والأحكام',

    // ─── ملف المستخدم ──────────────────────────────
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    wilaya: 'الولاية',
    baladiya: 'البلدية',
    bloodType: 'فصيلة الدم',
    editProfile: 'تعديل الملف الشخصي',
    changeAvatar: 'تغيير الصورة',

    // ─── الصفحة الرئيسية ───────────────────────────
    greeting: 'مرحباً',
    howCanWeHelp: 'كيف يمكننا مساعدتك اليوم؟',
    searchPlaceholder: 'ابحث عن طبيب، تخصص، ولاية...',
    mainServices: 'الخدمات الرئيسية',
    featured: 'أطباء مميزون',
    nearbyDonors: 'متبرعو الدم بالقرب منك',

    // ─── الأطباء ───────────────────────────────────
    specialty: 'التخصص',
    distance: 'المسافة',
    rating: 'التقييم',
    reviews: 'تقييمات',
    fee: 'رسوم الطبيب',
    years: 'سنوات الخبرة',
    patients: 'مرضى',
    satisfaction: 'نسبة الرضا',
    about: 'نبذة عن الطبيب',
    tags: 'التخصصات',
    verified: 'معتمد',
    callNow: 'اتصل الآن',
    sendMessage: 'رسالة',
    location: 'الموقع',

    // ─── حجز الموعد ────────────────────────────────
    bookAppointment: 'احجز موعد',
    selectDate: 'اختر التاريخ',
    selectTime: 'اختر الوقت',
    visitType: 'نوع الزيارة',
    inPerson: 'حضوري',
    online: 'أونلاين',
    platformFee: 'رسوم المنصة',
    total: 'المجموع',
    confirmBooking: 'تأكيد الحجز',

    // ─── متبرعو الدم ────────────────────────────────
    availableNow: 'متاح الآن',
    emergency: 'حالة طارئة',
    registerDonor: 'سجل كمتبرع',
    hideName: 'إخفاء الاسم',
    allDonors: 'الكل',
    emergencyRequest: 'طلب طارئ',
    donorCount: 'متبرع',

    // ─── المعدات الطبية ─────────────────────────────
    addEquipment: 'إضافة معدة',
    condition: 'الحالة',
    description: 'الوصف',
    addLocation: 'إضافة الموقع',
    register: 'تسجيل',
    allTypes: 'الكل',
    equipmentCount: 'معدة',

    // ─── الصيدليات والمستشفيات ──────────────────────
    services: 'الخدمات',
    onCall24h: 'مناوبة 24 ساعة',
    onCall: 'مفتوح 24/24',
    nightShift: 'مناوبة الليل',
    publicHospital: 'مستشفى عام',
    privateHospital: 'مستشفى خاص',

    // ─── إضافة معلومة ───────────────────────────────
    addInfo: 'إضافة معلومة',
    submitInfo: 'إرسال المعلومات',
    warningMessage: 'تأكد من صحة المعلومات قبل الإرسال',
    hospital: 'مستشفى',
    doctor: 'طبيب',
    vetClinic: 'طب بيطري',
    pharmacy: 'صيدلية',
    civilStation: 'محطة حماية مدنية',
    herbal: 'طب بديل',

    // ─── الإعدادات ──────────────────────────────────
    darkMode: 'الوضع الداكن',
    notifications: 'الإشعارات',
    notificationsEnabled: 'الإشعارات مفعلة',
    locationEnabled: 'الموقع مفعل',
    language: 'اللغة',
    security: 'الأمان والخصوصية',
    help: 'المساعدة والدعم',
    privacy: 'سياسة الخصوصية',
    aboutApp: 'حول التطبيق',

    // ─── أيام الأسبوع ────────────────────────────────
    sun: 'أحد',
    mon: 'اثنين',
    tue: 'ثلاثاء',
    wed: 'أربعاء',
    thu: 'خميس',
    fri: 'جمعة',
    sat: 'سبت',

    // ─── رسائل النظام ────────────────────────────────
    errorGeneral: 'حدث خطأ، حاول مجدداً',
    errorAuth: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    errorFields: 'يرجى ملء جميع الحقول المطلوبة',
    successSaved: 'تم الحفظ بنجاح',
    successRegistered: 'تم التسجيل بنجاح',
    successBooking: 'تم حجز الموعد بنجاح',
  },

  fr: {
    // ─── Général ───────────────────────────────────
    appName: 'DzHealth',
    tagline: 'Tous les services de santé en un seul endroit',
    loading: 'Chargement...',
    noResults: 'Aucun résultat',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    viewAll: 'Voir tout',
    next: 'Suivant',
    skip: 'Passer',
    getStarted: 'Commencer',
    more: 'Plus',
    available: 'Disponible',
    notAvailable: 'Indisponible',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
    pending: 'En attente',

    // ─── Navigation ────────────────────────────────
    home: 'Accueil',
    search: 'Recherche',
    add: 'Ajouter',
    appointments: 'Rendez-vous',
    profile: 'Profil',

    // ─── Services ──────────────────────────────────
    doctors: 'Médecins',
    pharmacies: 'Pharmacies',
    hospitals: 'Hôpitaux',
    bloodDonors: 'Donneurs de sang',
    equipment: 'Équipements médicaux',
    herbalMedicine: 'Médecine douce',
    civilProtection: 'Protection civile',
    vetClinics: 'Vétérinaires',

    // ─── Authentification ──────────────────────────
    login: 'Connexion',
    signup: 'Créer un compte',
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas de compte ?',
    haveAccount: 'Déjà un compte ?',
    terms: 'Conditions d\'utilisation',
    agreeToTerms: 'J\'accepte les conditions',

    // ─── Profil ────────────────────────────────────
    fullName: 'Nom complet',
    phone: 'Téléphone',
    wilaya: 'Wilaya',
    baladiya: 'Commune',
    bloodType: 'Groupe sanguin',
    editProfile: 'Modifier le profil',
    changeAvatar: 'Changer la photo',

    // ─── Accueil ────────────────────────────────────
    greeting: 'Bonjour',
    howCanWeHelp: 'Comment pouvons-nous vous aider ?',
    searchPlaceholder: 'Rechercher un médecin, spécialité...',
    mainServices: 'Services principaux',
    featured: 'Médecins recommandés',
    nearbyDonors: 'Donneurs de sang près de vous',

    // ─── Médecins ──────────────────────────────────
    specialty: 'Spécialité',
    distance: 'Distance',
    rating: 'Évaluation',
    reviews: 'avis',
    fee: 'Honoraires',
    years: 'Ans d\'expérience',
    patients: 'Patients',
    satisfaction: 'Taux de satisfaction',
    about: 'À propos du médecin',
    tags: 'Spécialisations',
    verified: 'Vérifié',
    callNow: 'Appeler',
    sendMessage: 'Message',
    location: 'Localisation',

    // ─── Réservation ───────────────────────────────
    bookAppointment: 'Prendre RDV',
    selectDate: 'Choisir la date',
    selectTime: 'Choisir l\'heure',
    visitType: 'Type de visite',
    inPerson: 'Présentiel',
    online: 'En ligne',
    platformFee: 'Frais de plateforme',
    total: 'Total',
    confirmBooking: 'Confirmer le RDV',

    // ─── Donneurs de sang ──────────────────────────
    availableNow: 'Disponible maintenant',
    emergency: 'Urgence',
    registerDonor: 'S\'inscrire comme donneur',
    hideName: 'Masquer le nom',
    allDonors: 'Tous',
    emergencyRequest: 'Demande urgente',
    donorCount: 'donneurs',

    // ─── Équipements ───────────────────────────────
    addEquipment: 'Ajouter équipement',
    condition: 'État',
    description: 'Description',
    addLocation: 'Ajouter localisation',
    register: 'S\'inscrire',
    allTypes: 'Tous',
    equipmentCount: 'équipements',

    // ─── Pharmacies et hôpitaux ────────────────────
    services: 'Services',
    onCall24h: 'Garde 24h',
    onCall: 'Ouvert 24h/24',
    nightShift: 'Garde de nuit',
    publicHospital: 'Hôpital public',
    privateHospital: 'Clinique privée',

    // ─── Ajouter une info ──────────────────────────
    addInfo: 'Ajouter info',
    submitInfo: 'Envoyer',
    warningMessage: 'Vérifiez les informations avant envoi',
    hospital: 'Hôpital',
    doctor: 'Médecin',
    vetClinic: 'Vétérinaire',
    pharmacy: 'Pharmacie',
    civilStation: 'Protection civile',
    herbal: 'Médecine douce',

    // ─── Paramètres ────────────────────────────────
    darkMode: 'Mode sombre',
    notifications: 'Notifications',
    notificationsEnabled: 'Notifications activées',
    locationEnabled: 'Localisation activée',
    language: 'Langue',
    security: 'Sécurité & Confidentialité',
    help: 'Aide & Support',
    privacy: 'Politique de confidentialité',
    aboutApp: 'À propos',

    // ─── Jours de la semaine ───────────────────────
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',

    // ─── Messages système ──────────────────────────
    errorGeneral: 'Une erreur est survenue, réessayez',
    errorAuth: 'Email ou mot de passe incorrect',
    errorFields: 'Veuillez remplir tous les champs requis',
    successSaved: 'Enregistré avec succès',
    successRegistered: 'Inscription réussie',
    successBooking: 'Rendez-vous confirmé',
  },

  en: {
    // ─── General ───────────────────────────────────
    appName: 'DzHealth',
    tagline: 'All health services in one place',
    loading: 'Loading...',
    noResults: 'No results found',
    save: 'Save Changes',
    cancel: 'Cancel',
    viewAll: 'View All',
    next: 'Next',
    skip: 'Skip',
    getStarted: 'Get Started',
    more: 'More',
    available: 'Available',
    notAvailable: 'Not Available',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    pending: 'Pending',

    // ─── Navigation ────────────────────────────────
    home: 'Home',
    search: 'Search',
    add: 'Add',
    appointments: 'Appointments',
    profile: 'Profile',

    // ─── Services ──────────────────────────────────
    doctors: 'Doctors',
    pharmacies: 'Pharmacies',
    hospitals: 'Hospitals',
    bloodDonors: 'Blood Donors',
    equipment: 'Medical Equipment',
    herbalMedicine: 'Herbal Medicine',
    civilProtection: 'Civil Protection',
    vetClinics: 'Vet Clinics',

    // ─── Authentication ────────────────────────────
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordMismatch: 'Passwords do not match',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    terms: 'Terms & Conditions',
    agreeToTerms: 'I agree to the terms',

    // ─── Profile ───────────────────────────────────
    fullName: 'Full Name',
    phone: 'Phone',
    wilaya: 'Wilaya',
    baladiya: 'Municipality',
    bloodType: 'Blood Type',
    editProfile: 'Edit Profile',
    changeAvatar: 'Change Avatar',

    // ─── Home ──────────────────────────────────────
    greeting: 'Hello',
    howCanWeHelp: 'How can we help you today?',
    searchPlaceholder: 'Search doctor, specialty, wilaya...',
    mainServices: 'Main Services',
    featured: 'Featured Doctors',
    nearbyDonors: 'Nearby Blood Donors',

    // ─── Doctors ───────────────────────────────────
    specialty: 'Specialty',
    distance: 'Distance',
    rating: 'Rating',
    reviews: 'reviews',
    fee: 'Consultation Fee',
    years: 'Years Experience',
    patients: 'Patients',
    satisfaction: 'Satisfaction Rate',
    about: 'About Doctor',
    tags: 'Specializations',
    verified: 'Verified',
    callNow: 'Call Now',
    sendMessage: 'Message',
    location: 'Location',

    // ─── Booking ───────────────────────────────────
    bookAppointment: 'Book Appointment',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    visitType: 'Visit Type',
    inPerson: 'In Person',
    online: 'Online',
    platformFee: 'Platform Fee',
    total: 'Total',
    confirmBooking: 'Confirm Booking',

    // ─── Blood Donors ──────────────────────────────
    availableNow: 'Available Now',
    emergency: 'Emergency',
    registerDonor: 'Register as Donor',
    hideName: 'Hide Name',
    allDonors: 'All',
    emergencyRequest: 'Emergency Request',
    donorCount: 'donors',

    // ─── Equipment ─────────────────────────────────
    addEquipment: 'Add Equipment',
    condition: 'Condition',
    description: 'Description',
    addLocation: 'Add Location',
    register: 'Register',
    allTypes: 'All',
    equipmentCount: 'equipment',

    // ─── Pharmacies & Hospitals ────────────────────
    services: 'Services',
    onCall24h: '24h On Call',
    onCall: 'Open 24/7',
    nightShift: 'Night Shift',
    publicHospital: 'Public Hospital',
    privateHospital: 'Private Clinic',

    // ─── Add Info ──────────────────────────────────
    addInfo: 'Add Information',
    submitInfo: 'Submit',
    warningMessage: 'Verify information before submitting',
    hospital: 'Hospital',
    doctor: 'Doctor',
    vetClinic: 'Vet Clinic',
    pharmacy: 'Pharmacy',
    civilStation: 'Civil Protection Station',
    herbal: 'Herbal Medicine',

    // ─── Settings ──────────────────────────────────
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    notificationsEnabled: 'Notifications enabled',
    locationEnabled: 'Location enabled',
    language: 'Language',
    security: 'Security & Privacy',
    help: 'Help & Support',
    privacy: 'Privacy Policy',
    aboutApp: 'About App',

    // ─── Days of week ──────────────────────────────
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',

    // ─── System messages ───────────────────────────
    errorGeneral: 'An error occurred, please try again',
    errorAuth: 'Incorrect email or password',
    errorFields: 'Please fill all required fields',
    successSaved: 'Saved successfully',
    successRegistered: 'Registration successful',
    successBooking: 'Appointment booked successfully',
  },
};

let currentLanguage: Language = (localStorage.getItem('language') as Language) || 'ar';

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
}

export function t(key: string): string {
  return translations[currentLanguage][key] ?? translations['ar'][key] ?? key;
}

export function isRTL(): boolean {
  return currentLanguage === 'ar';
}
