import React, { useEffect, useRef } from 'react';
import { Zap, ShieldCheck, RefreshCw, MapPin, Layers } from 'lucide-react';
import { translations } from './translations';

const getAssetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

export default function SistemaMagma({ height = "780px", showBenefitsCard = true, lang = "es" }) {
  const iframeRef = useRef(null);

  const t = (key) => {
    const l = translations[lang] ? lang : 'es';
    return translations[l][key] || translations['es'][key] || key;
  };

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ lang: lang }, "*");
    }
  }, [lang]);

  const handleLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ lang: lang }, "*");
    }
  };

  return (
    <div className="mpp-sistema-magma-wrapper">
      {/* 3D Model Iframe Frame - Complete screen fit with NO scrollbars */}
      <div 
        style={{ 
          width: "100%", 
          borderRadius: "14px", 
          overflow: "hidden", 
          border: "1px solid var(--color-border, #1e293b)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          background: "#101820"
        }}
      >
        <iframe
          ref={iframeRef}
          onLoad={handleLoad}
          src={getAssetUrl(`/modelos/MAGMA-visor-3D.html?lang=${lang}`)}
          title="SISTEMA MAGMA - Visor 3D Interactivo"
          style={{
            width: "100%",
            height: height,
            border: 0,
            display: "block",
            overflow: "hidden"
          }}
          scrolling="no"
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* MAGMA System Benefits Panel */}
      {showBenefitsCard && (
        <div className="mpp-card card-gradient-glow mt-6" style={{ padding: "1.75rem", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className="mpp-card__icon-container mpp-card__icon-container--magma" style={{ width: "42px", height: "42px" }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-text-heading, #ffffff)", fontWeight: 700 }}>
                {t('visor_benefits_title')}
              </h3>
              <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--color-text-muted, #94a3b8)" }}>
                {t('visor_benefits_sub')}
              </p>
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--color-text-body, #cbd5e1)", marginBottom: "1.25rem" }}>
            {t('visor_benefits_intro')}
          </p>

          <div className="grid mpp-grid-2 gap-4">
            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <Zap className="color-magma" size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "#f59e0b", fontWeight: 600 }}>{t('visor_b1_title')}</h4>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8", lineHeight: 1.45 }}>
                  {t('visor_b1_desc')}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <ShieldCheck className="color-forest" size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "#10b981", fontWeight: 600 }}>{t('visor_b2_title')}</h4>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8", lineHeight: 1.45 }}>
                  {t('visor_b2_desc')}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <RefreshCw className="color-electric" size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "#06b6d4", fontWeight: 600 }}>{t('visor_b3_title')}</h4>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8", lineHeight: 1.45 }}>
                  {t('visor_b3_desc')}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <MapPin className="color-grey" size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "#a855f7", fontWeight: 600 }}>{t('visor_b4_title')}</h4>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8", lineHeight: 1.45 }}>
                  {t('visor_b4_desc')}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)", gridColumn: "1 / -1" }}>
              <Layers className="color-magma" size={22} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "#f97316", fontWeight: 600 }}>{t('visor_b5_title')}</h4>
                <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8", lineHeight: 1.45 }}>
                  {t('visor_b5_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

