import React, { useState } from 'react';
import { translations } from './translations';
import SistemaMagma from './SistemaMagma';
import { 
  Sun, 
  Moon,
  Leaf, 
  Zap, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Menu, 
  X, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  FileText, 
  Briefcase,
  Users,
  Compass,
  Building,
  User,
  MessageSquare,
  Send
} from 'lucide-react';

const getAssetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('magma-theme') || 'dark';
  });

  // Language State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('magma-lang') || 'es';
  });

  React.useEffect(() => {
    localStorage.setItem('magma-lang', lang);
    document.querySelectorAll("iframe").forEach(frame => {
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ lang: lang }, "*");
      }
    });
  }, [lang]);

  const toggleLang = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    setLang(newLang);
    document.querySelectorAll("iframe").forEach(frame => {
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ lang: newLang }, "*");
      }
    });
  };

  const t = (key) => {
    return translations[lang][key] || translations['es'][key] || key;
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('magma-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    const frame = document.getElementById("magma-map-frame");
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ theme: newTheme, lang: lang }, "*");
    }
  };

  // Booking Form State
  const [selectedService, setSelectedService] = useState('Energía Solar');
  const [selectedDate, setSelectedDate] = useState(17); // Default August 17, 2026
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    area: 'Dirección General',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Company Geomagmatic Process Step State
  const [geomagmaticStep, setGeomagmaticStep] = useState(0);

  // Franchise Roadmap Active Phase State
  const [activePhase, setActivePhase] = useState(1);

  // Franchise Joint Venture Selection State
  const [selectedJvId, setSelectedJvId] = useState(1);

  React.useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.magmaMapHeight) {
        const frame = document.getElementById("magma-map-frame");
        if (frame) {
          frame.style.height = e.data.magmaMapHeight + "px";
          // Sync theme to iframe when it loads
          if (frame.contentWindow) {
            frame.contentWindow.postMessage({ theme: theme, lang: lang }, "*");
          }
        }
      }
      if (e.data && e.data.action === 'scrollToContact') {
        setContactForm({
          firstName: '',
          lastName: '',
          email: '',
          area: 'Dirección Comercial-Proyectos',
          message: `Hola, me gustaría recibir más detalles sobre la franquicia tecnológica y el modelo de alianza de ${e.data.jvName}.`
        });
        setActiveTab('contactos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme]);

  // Interactive booking calendar details
  const daysInAugust = Array.from({ length: 31 }, (_, i) => i + 1);
  // August 2026 starts on Saturday (so Saturday=1, Sunday=2, Monday=3, etc.)
  // Let's create empty spaces for alignment. Saturday is day 6 of week.
  const emptyDaysBefore = Array.from({ length: 5 }, () => null); // Monday to Friday empty offset
  const calendarCells = [...emptyDaysBefore, ...daysInAugust];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  // Geomagmatic Process Steps
  const processSteps = [
    {
      title: t("step1_title"),
      subtitle: t("step1_sub"),
      description: t("step1_desc"),
      icon: <Zap className="step-icon step-icon--magma" size={32} />
    },
    {
      title: t("step2_title"),
      subtitle: t("step2_sub"),
      description: t("step2_desc"),
      icon: <Database className="step-icon step-icon--electric" size={32} />
    },
    {
      title: t("step3_title"),
      subtitle: t("step3_sub"),
      description: t("step3_desc"),
      icon: <Compass className="step-icon step-icon--forest" size={32} />
    },
    {
      title: t("step4_title"),
      subtitle: t("step4_sub"),
      description: t("step4_desc"),
      icon: <Cpu className="step-icon step-icon--grey" size={32} />
    }
  ];

  const jvData = [
    {
      id: 1,
      name: "JV North America",
      classification: "A",
      classText: "STRATEGIC CAMPUS JV",
      countries: "Estados Unidos, Canadá, México",
      centerName: "Nevada, USA",
      centerType: "Campus Estratégico",
      centerDetail: "Reno-Sparks Tech Park",
      color: "#3b82f6",
      coords: { x: 17.0, y: 48.2 },
      boxCoords: { x: 1.1, y: 14.8, w: 15.0, h: 27.8 },
      focusAreas: [
        "Tecnología Avanzada",
        "Centros de Datos",
        "Geotermia",
        "Manufactura de Alta Precisión",
        "Innovación e I+D"
      ]
    },
    {
      id: 2,
      name: "JV LATAM",
      classification: "A",
      classText: "STRATEGIC CAMPUS JV",
      countries: "México, Centroamérica, Caribe, Sudamérica",
      centerName: "Costa Rica",
      centerType: "Campus Estratégico",
      centerDetail: "Guanacaste Innovation Park",
      color: "#10b981",
      coords: { x: 27.3, y: 67.8 },
      boxCoords: { x: 1.1, y: 44.5, w: 15.0, h: 27.8 },
      focusAreas: [
        "Energía Geotérmica",
        "Infraestructura",
        "Minería",
        "Manufactura Regional",
        "Desarrollo de Proyectos"
      ]
    },
    {
      id: 3,
      name: "JV Europe",
      classification: "B",
      classText: "REGIONAL DEVELOPMENT JV",
      countries: "Unión Europea, Reino Unido, Países Nórdicos",
      centerName: "Irlanda",
      centerType: "Centro Tecnológico",
      centerDetail: "Dublín Tech Hub",
      color: "#f59e0b",
      coords: { x: 45.6, y: 46.8 },
      boxCoords: { x: 36.1, y: 14.8, w: 15.0, h: 27.8 },
      focusAreas: [
        "Ingeniería y Diseño",
        "Certificaciones",
        "Soporte Técnico Regional",
        "Innovación"
      ]
    },
    {
      id: 4,
      name: "JV Asia Pacific",
      classification: "A",
      classText: "STRATEGIC CAMPUS JV",
      countries: "India, ASEAN, Japón, Corea del Sur, Australia, Nueva Zelanda, Pacífico",
      centerName: "Singapur",
      centerType: "Campus Estratégico",
      centerDetail: "Tuas Tech & Energy Campus",
      color: "#06b6d4",
      coords: { x: 78.3, y: 78.5 },
      boxCoords: { x: 82.5, y: 19.8, w: 15.6, h: 28.5 },
      focusAreas: [
        "Manufactura Avanzada",
        "Energía Geotérmica",
        "Centros de Datos",
        "Tecnología y Automatización",
        "Formación y Entrenamiento"
      ]
    },
    {
      id: 5,
      name: "JV Africa",
      classification: "B",
      classText: "REGIONAL DEVELOPMENT JV",
      countries: "África del Norte, África Subsahariana",
      centerName: "Kenia",
      centerType: "Centro Tecnológico",
      centerDetail: "Nairobi Green Tech Hub",
      color: "#8b5cf6",
      coords: { x: 57.8, y: 87.8 },
      boxCoords: { x: 37.1, y: 49.8, w: 15.0, h: 25.8 },
      focusAreas: [
        "Energía Geotérmica",
        "Infraestructura",
        "Minería",
        "Desarrollo de Proyectos",
        "Formación Técnica"
      ]
    },
    {
      id: 6,
      name: "JV Middle East",
      classification: "B",
      classText: "REGIONAL DEVELOPMENT JV",
      countries: "Golfo Pérsico, Turquía, Israel, Países del Levante",
      centerName: "Abu Dhabi, EAU",
      centerType: "Centro Tecnológico",
      centerDetail: "Masdar Innovation Hub",
      color: "#f97316",
      coords: { x: 63.5, y: 72.9 },
      boxCoords: { x: 81.5, y: 50.0, w: 17.0, h: 26.8 },
      focusAreas: [
        "Energía",
        "Desalación",
        "Petróleo & Gas",
        "Infraestructura",
        "Centros de Datos"
      ]
    }
  ];

  const activeJv = jvData.find(jv => jv.id === selectedJvId);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingEmail || !selectedTime) {
      alert("Por favor ingrese su email y seleccione un horario disponible.");
      return;
    }
    setBookingSuccess(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
  };

  const handleJvContactClick = (jvName, centerName) => {
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      area: 'Alianzas Comerciales',
      message: `Hola, estoy interesado en recibir más detalles sobre el modelo de franquicia tecnológica y el ecosistema de alianzas para ${jvName} (${centerName}).`
    });
    // Navigate to Contactos tab and scroll to top smoothly
    setActiveTab('contactos');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setBookingEmail('');
    setBookingNotes('');
    setSelectedTime(null);
  };

  const resetContact = () => {
    setContactSuccess(false);
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      area: 'Dirección General',
      message: ''
    });
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mpp-layout">
      {/* Background Decorative Glows */}
      <div className="bg-glow-orange"></div>
      <div className="bg-glow-blue"></div>
      <div className="bg-glow-green"></div>

      {/* HEADER / NAVIGATION */}
      <header className="mpp-header">
        <div className="container mpp-header__container">
          <div className="mpp-header__brand" onClick={() => navigateTo('inicio')}>
            <img src={theme === 'dark' ? getAssetUrl('/logo-horizontal-white.png') : getAssetUrl('/logo-horizontal-color.png')} alt="MAGMA POWER PLANT" className="mpp-header__logo" width="240" height="90" fetchpriority="high" decoding="async" />
          </div>

          {/* Desktop Nav */}
          <nav className="mpp-nav-desktop">
            <button className={`mpp-nav-link ${activeTab === 'inicio' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('inicio')}>{t('nav_inicio')}</button>
            <button className={`mpp-nav-link ${activeTab === 'compania' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('compania')}>{t('nav_compania')}</button>
            <button className={`mpp-nav-link ${activeTab === 'tecnologia' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('tecnologia')}>{t('nav_tecnologia')}</button>
            <button className={`mpp-nav-link ${activeTab === 'servicios' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('servicios')}>{t('nav_servicios')}</button>
            <button className={`mpp-nav-link ${activeTab === 'equipo' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('equipo')}>{t('nav_equipo')}</button>
            <button className={`mpp-nav-link ${activeTab === 'franquicias' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('franquicias')}>{t('nav_franquicias')}</button>
            <button className={`mpp-nav-link ${activeTab === 'contactos' ? 'mpp-nav-link--active' : ''}`} onClick={() => navigateTo('contactos')}>{t('nav_contactos')}</button>
          </nav>

          <div className="mpp-header__actions-wrapper">
            {/* Language Toggle */}
            <button className="mpp-lang-toggle" onClick={toggleLang} aria-label="Toggle Language" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '0.85rem', marginRight: '0.5rem' }}>
              {lang.toUpperCase()}
            </button>

            {/* Theme Toggle */}
            <button className="mpp-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Hamburger Icon */}
            <button className="mpp-burger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="mpp-nav-mobile">
            <button className={`mpp-nav-mobile-link ${activeTab === 'inicio' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('inicio')}>{t('nav_inicio')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'compania' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('compania')}>{t('nav_compania')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'tecnologia' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('tecnologia')}>{t('nav_tecnologia')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'servicios' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('servicios')}>{t('nav_servicios')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'equipo' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('equipo')}>{t('nav_equipo')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'franquicias' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('franquicias')}>{t('nav_franquicias')}</button>
            <button className={`mpp-nav-mobile-link ${activeTab === 'contactos' ? 'mpp-nav-mobile-link--active' : ''}`} onClick={() => navigateTo('contactos')}>{t('nav_contactos')}</button>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT PORT */}
      <main className="mpp-main">

        {/* TAB: INICIO */}
        {activeTab === 'inicio' && (
          <section className="mpp-section-home animate-fade">
            {/* Hero Banner */}
            <div className="mpp-hero">
              <div className="container mpp-hero__container">
                <div className="mpp-hero__content">
                  <span className="mpp-hero__tag">{t('hero_tag')}</span>
                  <h1 className="mpp-hero__title">
                    {t('hero_title_part1')}<span className="text-gradient-magma">{t('hero_title_gradient')}</span>{t('hero_title_part2')}
                  </h1>
                  <p className="mpp-hero__desc">
                    {t('hero_desc')}
                  </p>
                  <div className="mpp-hero__actions">
                    <button className="mpp-btn mpp-btn--primary" onClick={() => navigateTo('compania')}>
                      {t('hero_btn_learn')} <ArrowRight size={18} />
                    </button>
                    <button className="mpp-btn mpp-btn--secondary" onClick={() => navigateTo('contactos')}>
                      {t('hero_btn_talk')}
                    </button>
                  </div>
                </div>

                <div className="mpp-hero__image-wrapper">
                  <div className="mpp-hero__image-card">
                    <img src={getAssetUrl('/logo-3d-transparent.png')} alt="Magma Power Plant 3D Logo" className="mpp-hero__logo-3d" width="360" height="360" fetchpriority="high" decoding="async" />
                    <div className="mpp-hero__badge">
                      <ShieldCheck size={20} className="color-forest" />
                      <span>{t('hero_badge')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 3D Model Section on Home */}
            <div className="container section animate-fade">
              <div className="mpp-section-header">
                <span className="mpp-section-subtitle">VISUALIZACIÓN INTERACTIVA 3D</span>
                <h2 className="mpp-section-title">Sistema de Proceso Geomagmático MAGMA</h2>
                <p className="mpp-section-desc">
                  Explore en tiempo real la arquitectura 3D del pozo profundo, intercambiadores de calor, turbogenerador MGT y corte geológico.
                </p>
              </div>
              <SistemaMagma height="750px" lang={lang} />
            </div>

            {/* Impact section */}
            <div className="container section">
              <div className="mpp-section-header">
                <span className="mpp-section-subtitle">{t('impact_subtitle')}</span>
                <h2 className="mpp-section-title">{t('impact_title')}</h2>
                <p className="mpp-section-desc">{t('impact_desc')}</p>
              </div>

              <div className="grid mpp-grid-3">
                {/* Card 1 */}
                <div className="mpp-card mpp-card--magma">
                  <div className="mpp-card__icon-container mpp-card__icon-container--magma">
                    <Zap size={24} />
                  </div>
                  <h3 className="mpp-card__title">{t('impact_card1_title')}</h3>
                  <p className="mpp-card__text">
                    {t('impact_card1_text')}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="mpp-card mpp-card--forest">
                  <div className="mpp-card__icon-container mpp-card__icon-container--forest">
                    <Leaf size={24} />
                  </div>
                  <h3 className="mpp-card__title">{t('impact_card2_title')}</h3>
                  <p className="mpp-card__text">
                    {t('impact_card2_text')}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="mpp-card mpp-card--electric">
                  <div className="mpp-card__icon-container mpp-card__icon-container--electric">
                    <Sun size={24} />
                  </div>
                  <h3 className="mpp-card__title">{t('impact_card3_title')}</h3>
                  <p className="mpp-card__text">
                    {t('impact_card3_text')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB: LA COMPAÑIA */}
        {activeTab === 'compania' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('company_subtitle')}</span>
              <h2 className="mpp-section-title">{t('company_title')}</h2>
              <p className="mpp-section-desc">{t('company_desc')}</p>
            </div>

            <div className="grid mpp-grid-2 mpp-compania-intro">
              <div className="mpp-compania-intro__text">
                <h3>{t('company_intro_title')}</h3>
                <p>
                  {t('company_intro_p1')}
                </p>
                <p className="mt-4">
                  {t('company_intro_p2')}
                </p>
                 <img src={getAssetUrl('/geomagmatic-energy.png')} alt="Proceso de transferencia Geomagmática" className="mpp-compania-img mt-4" loading="lazy" decoding="async" width="600" height="400" />
              </div>
              <div className="mpp-compania-intro__detail card-gradient-glow">
                <h3>{t('company_science_title')}</h3>
                <p>
                  {t('company_science_text')}
                </p>

                <div className="mpp-quote-box">
                  <strong>{t('company_quote_title')}</strong>
                  <p>
                    {t('company_quote_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Process Slider */}
            <div className="mpp-process-container section">
              <h3 className="mpp-process-title">{t('process_title')}</h3>
              <p className="mpp-process-subtitle">{t('process_subtitle')}</p>

              <div className="mpp-process-slider">
                <div className="mpp-process-slider__card">
                  <div className="mpp-process-slider__visual">
                    {processSteps[geomagmaticStep].icon}
                    <div className="mpp-process-slider__badge">{t('process_step_badge')} {geomagmaticStep + 1} {t('process_step_of')}</div>
                  </div>
                  <div className="mpp-process-slider__content">
                    <h4 className="mpp-process-slider__step-title">{processSteps[geomagmaticStep].title}</h4>
                    <span className="mpp-process-slider__step-subtitle">{processSteps[geomagmaticStep].subtitle}</span>
                    <p className="mpp-process-slider__step-desc">{processSteps[geomagmaticStep].description}</p>
                  </div>
                </div>

                <div className="mpp-process-slider__controls">
                  <button 
                    className="mpp-slider-btn" 
                    disabled={geomagmaticStep === 0} 
                    onClick={() => setGeomagmaticStep(prev => prev - 1)}
                  >
                    <ChevronLeft size={20} /> {t('process_btn_prev')}
                  </button>
                  <div className="mpp-slider-dots">
                    {processSteps.map((_, i) => (
                      <span 
                        key={i} 
                        className={`mpp-slider-dot ${geomagmaticStep === i ? 'mpp-slider-dot--active' : ''}`}
                        onClick={() => setGeomagmaticStep(i)}
                      ></span>
                    ))}
                  </div>
                  <button 
                    className="mpp-slider-btn" 
                    disabled={geomagmaticStep === 3} 
                    onClick={() => setGeomagmaticStep(prev => prev + 1)}
                  >
                    {t('process_btn_next')} <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mision, Vision, Historia Grid */}
            <div className="grid mpp-grid-3 mpp-mvh-section">
              <div className="mpp-card">
                <div className="mpp-card-mvh-header">
                  <Award className="color-magma" size={24} />
                  <h3>Misión</h3>
                </div>
                <p>
                  Desarrollar y aplicar tecnologías innovadoras en Geomagmática y otras fuentes de energía limpia, como la solar, para generar electricidad segura, sostenible y competitiva a nivel global. Impulsamos el progreso de comunidades e industrias mediante soluciones confiables.
                </p>
              </div>

              <div className="mpp-card">
                <div className="mpp-card-mvh-header">
                  <Leaf className="color-forest" size={24} />
                  <h3>Visión</h3>
                </div>
                <p>
                  Ser líderes mundiales en innovación energética, reconocidos por transformar el calor interno de la Tierra y otras fuentes renovables en oportunidades de desarrollo, bienestar social y sostenibilidad ambiental, inspirando un modelo limpio para las próximas generaciones.
                </p>
              </div>

              <div className="mpp-card">
                <div className="mpp-card-mvh-header">
                  <Users className="color-electric" size={24} />
                  <h3>Historia</h3>
                </div>
                <p>
                  Magma Power Plant nació en 2018 gracias a la visión de un grupo de ingenieros y emprendedores apasionados por la energía sostenible. Unimos esfuerzos para crear tecnologías eficientes de circuito cerrado capaces de aprovechar el calor interno terrestre libre de emisiones.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB: TECNOLOGÍA */}
        {activeTab === 'tecnologia' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('tech_subtitle')}</span>
              <h2 className="mpp-section-title">{t('tech_title')}</h2>
              <p className="mpp-section-desc">{t('tech_desc')}</p>
            </div>

            {/* Visor 3D Interactivo del Proceso MAGMA */}
            <div className="mpp-3d-model-section mb-8 animate-fade">
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-heading, #ffffff)', margin: 0 }}>
                  Modelo y Visor 3D Interactivo — Planta MAGMA
                </h3>
                <span className="mpp-hero__tag" style={{ margin: 0 }}>Texturizado PBR v17</span>
              </div>
              <SistemaMagma height="720px" lang={lang} />
            </div>

            <div className="grid mpp-grid-2">
              <div className="mpp-tech-text-block">
                <h3>{t('tech_system_title')}</h3>
                <p>
                  Nuestro sistema de **ciclo binario** aprovecha el calor de la fuente termal mediante **intercambiadores de calor de pozo profundo**, transformándolo en electricidad o calor industrial de forma continua, limpia y eficiente.
                </p>
                <p className="mt-4">
                  {t('tech_p2')}
                </p>
                <p className="mt-4">
                  {t('tech_p3')}
                </p>
              </div>
              <div className="mpp-tech-visual-block">
                <div className="mpp-tech-img-container">
                   <img src={getAssetUrl('/orc-turbine.png')} alt="Turbogenerador ORC Magma" className="mpp-tech-main-img" loading="lazy" decoding="async" width="600" height="400" />
                </div>
              </div>
            </div>

            {/* Spec Features Grid */}
            <div className="mpp-specs-section">
              <h3 className="mpp-specs-title">Características Principales de Nuestras Plantas</h3>
              <div className="grid mpp-grid-3 mpp-specs-grid">
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">50 MW</span>
                  <h4>{t('spec_orc_title')}</h4>
                  <p>{t('spec_orc_desc')}</p>
                </div>
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">450 MW</span>
                  <h4>{t('spec_trad_title')}</h4>
                  <p>{t('spec_trad_desc')}</p>
                </div>
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">24/7</span>
                  <h4>{t('spec_ops_title')}</h4>
                  <p>{t('spec_ops_desc')}</p>
                </div>
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">70-180 °C</span>
                  <h4>{t('spec_range_title')}</h4>
                  <p>{t('spec_range_desc')}</p>
                </div>
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">0%</span>
                  <h4>{t('spec_emissions_title')}</h4>
                  <p>{t('spec_emissions_desc')}</p>
                </div>
                <div className="mpp-spec-item">
                  <span className="mpp-spec-num">100k+</span>
                  <h4>{t('spec_homes_title')}</h4>
                  <p>{t('spec_homes_desc')}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB: SERVICIOS */}
        {activeTab === 'servicios' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('services_subtitle')}</span>
              <h2 className="mpp-section-title">{t('services_title')}</h2>
              <p className="mpp-section-desc">{t('services_desc')}</p>
            </div>

            {/* Services Grid */}
            <div className="grid mpp-grid-2 mpp-services-list">
              <div className="mpp-card mpp-service-card animate-fade">
                <img src={getAssetUrl('/solar-plant.png')} alt="Plantas de Energía Solar" className="mpp-service-img" loading="lazy" decoding="async" width="500" height="300" />
                <div className="mpp-service-content">
                  <h3 className="color-magma">1. Plantas de Energía Solar</h3>
                  <p>
                    {t('service1_desc')}
                  </p>
                </div>
              </div>

              <div className="mpp-card mpp-service-card animate-fade">
                <img src={getAssetUrl('/geothermal-plant.png')} alt="Proyectos de Energía Geotermal" className="mpp-service-img" loading="lazy" decoding="async" width="500" height="300" />
                <div className="mpp-service-content">
                  <h3 className="color-forest">2. Proyectos de Energía Geotermal</h3>
                  <p>
                    {t('service2_desc')}
                  </p>
                </div>
              </div>

              <div className="mpp-card mpp-service-card animate-fade">
                <img src={getAssetUrl('/geomagmatic-energy.png')} alt="Tecnologías Geomagmáticas R&D" className="mpp-service-img" loading="lazy" decoding="async" width="500" height="300" />
                <div className="mpp-service-content">
                  <h3 className="color-electric">3. Tecnologías Geomagmáticas R&D</h3>
                  <p>
                    {t('service3_desc')}
                  </p>
                </div>
              </div>

              <div className="mpp-card mpp-service-card animate-fade">
                <img src={getAssetUrl('/piping-layout.png')} alt="Diseño 3D Piping Inteligente" className="mpp-service-img" loading="lazy" decoding="async" width="500" height="300" />
                <div className="mpp-service-content">
                  <h3 className="color-grey">4. Diseño 3D Piping Inteligente</h3>
                  <p>
                    {t('service4_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Appointment Scheduler */}
            <div className="mpp-scheduler section" id="cita-formulario">
              <div className="mpp-card mpp-scheduler__card">
                <h3 className="mpp-scheduler__title">Hable con nosotros. Agende su cita</h3>
                <p className="mpp-scheduler__subtitle">Seleccione el servicio, la fecha y la hora para su cita virtual o en oficinas.</p>

                {bookingSuccess ? (
                  <div className="mpp-booking-success animate-fade">
                    <div className="mpp-booking-success__icon">
                      <Check size={40} />
                    </div>
                    <h4>¡Cita Solicitada Exitosamente!</h4>
                    <p>
                      Hemos registrado su solicitud para el servicio de <strong>{selectedService}</strong> el día <strong>{selectedDate} de Agosto de 2026</strong> a las <strong>{selectedTime}</strong>.
                    </p>
                    <p className="text-sm">
                      Se ha enviado un correo con los detalles y el enlace de la reunión a: <strong>{bookingEmail}</strong>.
                    </p>
                    <button className="mpp-btn mpp-btn--primary mt-4" onClick={resetBooking}>
                      {t('scheduler_btn_reset')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="mpp-booking-form">
                    <div className="grid mpp-grid-2">
                      <div>
                        {/* Service select */}
                        <div className="mpp-form-group">
                          <label className="mpp-form-label">{t('scheduler_label_service')}</label>
                          <select 
                            className="mpp-form-select"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                          >
                            <option value="Energía Solar">Energía Solar</option>
                            <option value="Energía Geotérmica">Energía Geotérmica</option>
                            <option value="Tecnologías Geomagmáticas">Tecnologías Geomagmáticas</option>
                            <option value="Diseño 3D Piping">Diseño 3D Piping</option>
                          </select>
                        </div>

                        {/* Calendar */}
                        <div className="mpp-form-group">
                          <label className="mpp-form-label">{t('scheduler_label_day')}</label>
                          <div className="mpp-calendar">
                            <div className="mpp-calendar__header">
                              <span className="mpp-calendar__title">Agosto 2026</span>
                            </div>
                            <div className="mpp-calendar__grid">
                              {/* Day labels */}
                              <span className="mpp-calendar__day-label">Lun</span>
                              <span className="mpp-calendar__day-label">Mar</span>
                              <span className="mpp-calendar__day-label">Mié</span>
                              <span className="mpp-calendar__day-label">Jue</span>
                              <span className="mpp-calendar__day-label">Vie</span>
                              <span className="mpp-calendar__day-label">Sáb</span>
                              <span className="mpp-calendar__day-label">Dom</span>

                              {/* Offset cells for alignment */}
                              {calendarCells.map((day, index) => {
                                if (day === null) {
                                  return <span key={`empty-${index}`} className="mpp-calendar__day--disabled"></span>;
                                }

                                const isToday = day === 16; // Simulated current date: 16 Aug 2026
                                const isPast = day < 16;
                                const isSelected = selectedDate === day;

                                return (
                                  <button
                                    type="button"
                                    key={`day-${day}`}
                                    disabled={isPast}
                                    className={`mpp-calendar__day ${isPast ? 'mpp-calendar__day--disabled' : 'mpp-calendar__day--active'} ${isSelected ? 'mpp-calendar__day--selected' : ''} ${isToday ? 'mpp-calendar__day--today' : ''}`}
                                    onClick={() => setSelectedDate(day)}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Time slots */}
                        <div className="mpp-form-group">
                          <label className="mpp-form-label">{t('scheduler_label_hour')}</label>
                          <div className="mpp-time-grid">
                            {timeSlots.map((slot) => (
                              <button
                                type="button"
                                key={slot}
                                className={`mpp-time-slot ${selectedTime === slot ? 'mpp-time-slot--selected' : ''}`}
                                onClick={() => setSelectedTime(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="mpp-form-group">
                          <label className="mpp-form-label">{t('scheduler_label_email')}</label>
                          <input 
                            type="email" 
                            className="mpp-form-input" 
                            required 
                            placeholder="nombre@empresa.com"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                          />
                        </div>

                        {/* Notes */}
                        <div className="mpp-form-group">
                          <label className="mpp-form-label">{t('scheduler_label_notes')}</label>
                          <textarea 
                            rows="2" 
                            className="mpp-form-textarea" 
                            placeholder={t('scheduler_placeholder_notes')}
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                          ></textarea>
                        </div>

                        <button type="submit" className="mpp-btn mpp-btn--primary w-full mt-4">
                          <Calendar size={18} /> {t('scheduler_btn_submit')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB: EQUIPO */}
        {activeTab === 'equipo' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('team_subtitle')}</span>
              <h2 className="mpp-section-title">{t('team_title')}</h2>
              <p className="mpp-section-desc">{t('team_desc')}</p>
            </div>

            <div className="mpp-equipo-intro">
              <p>
                {t('team_intro_p1')}
              </p>
              <p className="mt-4">
                {t('team_intro_p2')}
              </p>
            </div>

            <div className="grid mpp-grid-4 mpp-equipo-cards">
              <div className="mpp-card">
                <h4>{t('team_card1_title')}</h4>
                <p className="text-sm">{t('team_card1_text')}</p>
              </div>
              <div className="mpp-card">
                <h4>{t('team_card2_title')}</h4>
                <p className="text-sm">{t('team_card2_text')}</p>
              </div>
              <div className="mpp-card">
                <h4>{t('team_card3_title')}</h4>
                <p className="text-sm">{t('team_card3_text')}</p>
              </div>
              <div className="mpp-card">
                <h4>{t('team_card4_title')}</h4>
                <p className="text-sm">{t('team_card4_text')}</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB: FRANQUICIAS */}
        {activeTab === 'franquicias' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('franchise_subtitle')}</span>
              <h2 className="mpp-section-title">Franquicias en {t('impact_card2_title')}</h2>
              <p className="mpp-section-desc">{t('franchise_desc')}</p>
            </div>

            <div className="mpp-franquicia-top card-gradient-glow mb-4">
              <div className="grid mpp-grid-2 gap-8">
                <div>
                  <h3>{t('franchise_intro_h3')}</h3>
                  <p className="mt-2">
                    {t('franchise_intro_p')}
                  </p>
                </div>
                <div className="mpp-franquicia-docs">
                  <h4>{t('franchise_docs_title')}</h4>
                  <div className="mpp-doc-links mt-2">
                    <a href={getAssetUrl('/certificado-franquicia.pdf')} target="_blank" rel="noopener noreferrer" className="mpp-doc-btn">
                      <FileText size={16} /> {t('franchise_doc_cert')}
                    </a>
                    <a href="https://magmapowerplant.com/wp-content/uploads/2025/08/EN-DESARROLLO.pdf" target="_blank" rel="noopener noreferrer" className="mpp-doc-btn">
                      <FileText size={16} /> {t('franchise_doc_protocol')} <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map & Details Panel Dashboard */}
            <div className="mpp-map-dashboard section">
              <div className="mpp-section-header">
                <span className="mpp-section-subtitle">{t('franchise_map_subtitle')}</span>
                <h3 className="mpp-section-title">{t('franchise_map_title')}</h3>
                <p className="mpp-section-desc">{t('franchise_map_desc')}</p>
              </div>

              <div style={{ position: 'relative', width: '100%', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', background: '#080f1c' }} className="mt-4 animate-fade">
                <iframe
                  src={getAssetUrl('/magma-jv-map.html')}
                  title="Mapa global de Joint Ventures MAGMA"
                  loading="lazy"
                  style={{ width: '100%', height: '1180px', border: '0', display: 'block' }}
                  id="magma-map-frame"
                ></iframe>
              </div>
            </div>

            {/* Technology Roadmap - 4 Phases */}
            <div className="mpp-roadmap-section section">
              <h3 className="mpp-roadmap-title">{t('franchise_roadmap_title')}</h3>
              <p className="mpp-roadmap-subtitle">{t('franchise_roadmap_subtitle')}</p>
              
              <div className="mpp-roadmap-tabs">
                <button className={`mpp-roadmap-tab ${activePhase === 1 ? 'mpp-roadmap-tab--active' : ''}`} onClick={() => setActivePhase(1)}>Fase 1</button>
                <button className={`mpp-roadmap-tab ${activePhase === 2 ? 'mpp-roadmap-tab--active' : ''}`} onClick={() => setActivePhase(2)}>Fase 2</button>
                <button className={`mpp-roadmap-tab ${activePhase === 3 ? 'mpp-roadmap-tab--active' : ''}`} onClick={() => setActivePhase(3)}>Fase 3</button>
                <button className={`mpp-roadmap-tab ${activePhase === 4 ? 'mpp-roadmap-tab--active' : ''}`} onClick={() => setActivePhase(4)}>Fase 4</button>
              </div>

              <div className="mpp-roadmap-content card-gradient-glow animate-fade">
                {activePhase === 1 && (
                  <div>
                    <h4>{t('phase1_title')}</h4>
                    <span className="mpp-roadmap-duration">{t('phase1_duration')}</span>
                    <p className="mt-2">
                      <strong>{t('phase1_goal')}</strong> {t('phase1_goal_text')}
                    </p>
                    <p className="mt-2">
                      <strong>{t('phase1_key')}</strong> {t('phase1_key_text')}
                    </p>
                  </div>
                )}
                {activePhase === 2 && (
                  <div>
                    <h4>{t('phase2_title')}</h4>
                    <span className="mpp-roadmap-duration">{t('phase2_duration')}</span>
                    <p className="mt-2">
                      <strong>{t('phase1_goal')}</strong> Crear turbogeneradores optimizados para bajas y medias entalpías, con diseños modulares compactos, alta durabilidad física y una eficiencia de conversión superior al 20% en condiciones reales de operación.
                    </p>
                    <p className="mt-2">
                      <strong>{t('phase1_key')}</strong> {t('phase2_key_text')}
                    </p>
                  </div>
                )}
                {activePhase === 3 && (
                  <div>
                    <h4>{t('phase3_title')}</h4>
                    <span className="mpp-roadmap-duration">{t('phase3_duration')}</span>
                    <p className="mt-2">
                      <strong>{t('phase1_goal')}</strong> {t('phase3_goal_text')}
                    </p>
                    <ul className="mpp-roadmap-list mt-2">
                      <li>{t('phase3_item1')}</li>
                      <li>{t('phase3_item2')}</li>
                      <li>{t('phase3_item3')}</li>
                    </ul>
                  </div>
                )}
                {activePhase === 4 && (
                  <div>
                    <h4>{t('phase4_title')}</h4>
                    <span className="mpp-roadmap-duration">{t('phase4_duration')}</span>
                    <p className="mt-2">
                      <strong>{t('phase1_goal')}</strong> {t('phase4_goal_text')}
                    </p>
                    <p className="mt-2">
                      <strong>{t('phase1_key')}</strong> {t('phase4_key_text')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB: CONTACTOS */}
        {activeTab === 'contactos' && (
          <section className="container section animate-fade">
            <div className="mpp-section-header">
              <span className="mpp-section-subtitle">{t('contact_subtitle')}</span>
              <h2 className="mpp-section-title">{t('contact_title')}</h2>
              <p className="mpp-section-desc">{t('contact_desc')}</p>
            </div>

            <div className="grid mpp-grid-2 mpp-contact-container">
              {/* Form card */}
              <div className="mpp-card mpp-contact-card">
                {contactSuccess ? (
                  <div className="mpp-booking-success animate-fade">
                    <div className="mpp-booking-success__icon">
                      <Check size={40} />
                    </div>
                    <h4>¡Mensaje Enviado con Éxito!</h4>
                    <p>
                      Agradecemos su interés en <strong>MAGMA POWER PLANT</strong>. Su mensaje ha sido dirigido al área de <strong>{contactForm.area}</strong>.
                    </p>
                    <p className="text-sm">
                      Le responderemos en su correo <strong>{contactForm.email}</strong> en las próximas 24 horas hábiles.
                    </p>
                    <button className="mpp-btn mpp-btn--primary mt-4" onClick={resetContact}>
                      {t('contact_btn_reset')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="grid mpp-grid-2 gap-4">
                      <div className="mpp-form-group">
                        <label className="mpp-form-label">
                          <User size={16} className="color-magma" />
                          {t('contact_label_first')} <span className="mpp-form-required">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="mpp-form-input" 
                          required 
                          placeholder="Juan"
                          value={contactForm.firstName}
                          onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                        />
                      </div>
                      <div className="mpp-form-group">
                        <label className="mpp-form-label">
                          <User size={16} className="color-magma" />
                          {t('contact_label_last')} <span className="mpp-form-required">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="mpp-form-input" 
                          required 
                          placeholder="Pérez"
                          value={contactForm.lastName}
                          onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="mpp-form-group">
                      <label className="mpp-form-label">
                        <Mail size={16} className="color-forest" />
                        {t('scheduler_label_email')} <span className="mpp-form-required">*</span>
                      </label>
                      <input 
                        type="email" 
                        className="mpp-form-input" 
                        required 
                        placeholder="nombre@empresa.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      />
                    </div>

                    <div className="mpp-form-group">
                      <label className="mpp-form-label">
                        <Building size={16} className="color-electric" />
                        {t('contact_label_area')} <span className="mpp-form-required">*</span>
                      </label>
                      <select 
                        className="mpp-form-select"
                        value={contactForm.area}
                        onChange={(e) => setContactForm({...contactForm, area: e.target.value})}
                      >
                        <option value="Dirección General">Dirección General</option>
                        <option value="Dirección Técnica">Dirección Técnica</option>
                        <option value="Dirección Comercial-Proyectos">Dirección Comercial-Proyectos</option>
                        <option value="Dirección Administración Financiera">Dirección Administración Financiera</option>
                      </select>
                    </div>

                    <div className="mpp-form-group">
                      <label className="mpp-form-label">
                        <MessageSquare size={16} className="color-grey" />
                        {t('contact_label_message')}
                      </label>
                      <textarea 
                        rows="4" 
                        className="mpp-form-textarea" 
                        placeholder={t('contact_placeholder_message')}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      ></textarea>
                    </div>

                    <button type="submit" className="mpp-btn mpp-btn--primary w-full mt-2">
                      <Send size={18} /> {t('contact_btn_submit')}
                    </button>
                  </form>
                )}
              </div>

              {/* Physical details card */}
              <div className="mpp-contact-info">
                <div className="mpp-contact-info__block">
                  <h3>{t('contact_info_title')}</h3>
                  <p>MAGMA POWER PLANT está registrada oficialmente como una corporación de desarrollo energético renovable.</p>
                </div>

                <div className="mpp-info-list">
                  <div className="mpp-info-item">
                    <MapPin className="color-magma" size={24} />
                    <div>
                      <h5>{t('contact_address_title')}</h5>
                      <p>6473 CONNING TOWER CIR, NAPLES, FL 34112 UN</p>
                    </div>
                  </div>

                  <div className="mpp-info-item">
                    <Mail className="color-forest" size={24} />
                    <div>
                      <h5>Correo Electrónico</h5>
                      <p><a href="mailto:mpp.info@magmapowerplant.com">mpp.info@magmapowerplant.com</a></p>
                    </div>
                  </div>

                  <div className="mpp-info-item">
                    <Phone className="color-electric" size={24} />
                    <div>
                      <h5>{t('contact_phone_title')}</h5>
                      <p><a href="tel:+12399610133">+1 (239) 961-0133</a></p>
                    </div>
                  </div>

                  <div className="mpp-info-item">
                    <Briefcase className="color-grey" size={24} />
                    <div>
                      <h5>{t('contact_reg_title')}</h5>
                      <p>Document Number: L21000169244</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mpp-footer">
        <div className="container mpp-footer__container">
          <div className="mpp-footer__left">
            <img src={theme === 'dark' ? getAssetUrl('/logo-footer-dark.png') : getAssetUrl('/logo-footer-light.png')} alt="Logo Magma" className="mpp-footer__logo" loading="lazy" decoding="async" width="180" height="60" />
            <p>{t('footer_desc')}</p>
          </div>
          <div className="mpp-footer__center">
            <h5>Secciones</h5>
            <div className="mpp-footer__links">
              <button onClick={() => navigateTo('inicio')}>{t('nav_inicio')}</button>
              <button onClick={() => navigateTo('compania')}>Compañía</button>
              <button onClick={() => navigateTo('tecnologia')}>{t('nav_tecnologia')}</button>
              <button onClick={() => navigateTo('servicios')}>{t('nav_servicios')}</button>
              <button onClick={() => navigateTo('equipo')}>{t('nav_equipo')}</button>
              <button onClick={() => navigateTo('franquicias')}>{t('nav_franquicias')}</button>
              <button onClick={() => navigateTo('contactos')}>{t('nav_contactos')}</button>
            </div>
          </div>
          <div className="mpp-footer__right">
            <h5>Contacto</h5>
            <p>Naples, Florida, Estados Unidos</p>
            <p className="text-sm">Email: mpp.info@magmapowerplant.com</p>
            <p className="text-sm">Telf: +1 (239) 961-0133</p>
          </div>
        </div>
        <div className="mpp-footer__bottom">
          <div className="container flex justify-between text-xs text-muted">
            <span>{t('footer_rights').replace('{year}', String(new Date().getFullYear()))}</span>
            <span>{t('footer_doc')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
