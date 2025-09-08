"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'es';

const translations = {
    en: {
        "CryptoFraud Buster": "CryptoFraud Buster",
        "Unmask crypto scams with AI. Upload an ad, screenshot, or video, and provide a URL to get an instant fraud analysis. Stay safe in the crypto world.": "Unmask crypto scams with AI. Upload an ad, screenshot, or video, and provide a URL to get an instant fraud analysis. Stay safe in the crypto world.",
        "Start New Analysis": "Start New Analysis",
        "Provide a URL, and/or upload an image/video of a crypto broker or ad. Our AI will analyze them for signs of fraud.": "Provide a URL, and/or upload an image/video of a crypto broker or ad. Our AI will analyze them for signs of fraud.",
        "Analyze for Fraud": "Analyze for Fraud",
        "Common Crypto Scams": "Common Crypto Scams",
        "High-Yield Promises": "Guaranteed High-Yield Promises",
        "High-Yield Promises Content": "Scammers often lure victims with promises of high returns or guaranteed profits with little to no risk. In the volatile crypto market, any such promise is a major red flag. Be wary of platforms offering overly generous welcome bonuses or benefits that seem too good to be true.",
        "High Returns Tag": "High Returns",
        "Guaranteed Profits Tag": "Guaranteed Profits",
        "Welcome Bonuses Tag": "Welcome Bonuses",
        "Pump and Dump Schemes": "Pump and Dump Schemes",
        "Pump and Dump Content": "In a 'pump and dump,' scammers artificially inflate the price of a low-value coin through false and misleading positive statements ('pumping'). Once the price is high, they sell their holdings ('dumping'), causing the price to plummet and leaving other investors with worthless assets. Be careful with coins with sudden, unexplained price spikes and aggressive online promotion.",
        "Price Manipulation Tag": "Price Manipulation",
        "Social Media Hype Tag": "Social Media Hype",
        "Low-Cap Coins Tag": "Low-Cap Coins",
        "Phishing Scams": "Phishing Scams",
        "Phishing Scams Content": "Phishing scams often involve fake emails, websites, or social media messages that appear to be from a legitimate company. Their goal is to trick you into giving up your private keys, passwords, or other personal information. Always double-check the URL and be wary of unsolicited messages asking for sensitive data.",
        "Fake Websites Tag": "Fake Websites",
        "Private Keys Tag": "Private Keys",
        "Impersonation Tag": "Impersonation",
        "Pressure to Act Fast": "Pressure to Act Fast",
        "Pressure to Act Fast Content": "Scammers create a false sense of urgency, pressuring you to invest quickly or you'll miss out on a once-in-a-lifetime opportunity. They might use tactics like countdown timers for 'exclusive offers' or claim that only a few spots are left. Legitimate investment opportunities do not require rushed decisions.",
        "False Urgency Tag": "False Urgency",
        "Pressure Tactics Tag": "Pressure Tactics",
        "Limited-Time Offers Tag": "Limited-Time Offers",
        "Already Scammed? Get Help": "Already Scammed? Get Help",
        "Describe your situation below. Our AI will provide recommendations on what to do next.": "Describe your situation below. Our AI will provide recommendations on what to do next.",
        "Explain what happened...": "Explain what happened...",
        "Get Recommendations": "Get Recommendations",
        "Fraud Analysis Report": "Fraud Analysis Report",
        "High Fraud Risk": "High Fraud Risk",
        "Potential Risk Detected": "Potential Risk Detected",
        "Low Fraud Risk": "Low Fraud Risk",
        "AI Analysis Details:": "AI Analysis Details:",
        "Report incorrect analysis": "Report incorrect analysis",
        "Report Sent": "Report Sent",
        "Thank you for your feedback. We will review the analysis.": "Thank you for your feedback. We will review the analysis.",
        "Add to Hall of Scammers": "Add to Hall of Scammers",
        "Added to Hall of Scammers": "Added to Hall of Scammers",
        "The URL has been added to our public database of scam sites.": "The URL has been added to our public database of scam sites.",
        "Error": "Error",
        "Failed to add URL to Hall of Scammers.": "Failed to add URL to Hall of Scammers.",
        "URL already reported.": "URL already reported.",
        "Hall of Scammers": "Hall of Scammers",
        "A community-reported list of fraudulent websites. URLs are added here when they get a high fraud score from our AI.": "A community-reported list of fraudulent websites. URLs are added here when they get a high fraud score from our AI.",
        "Loading reported scams...": "Loading reported scams...",
        "No scams reported yet. Be the first!": "No scams reported yet. Be the first!",
        "Reported": "Reported"
    },
    es: {
        "CryptoFraud Buster": "CryptoFraud Buster",
        "Unmask crypto scams with AI. Upload an ad, screenshot, or video, and provide a URL to get an instant fraud analysis. Stay safe in the crypto world.": "Desenmascara estafas de criptomonedas con IA. Sube un anuncio, captura de pantalla o video, y proporciona una URL para obtener un análisis de fraude instantáneo. Mantente seguro en el mundo cripto.",
        "Start New Analysis": "Iniciar Nuevo Análisis",
        "Provide a URL, and/or upload an image/video of a crypto broker or ad. Our AI will analyze them for signs of fraud.": "Proporciona una URL y/o sube una imagen/video de un bróker o anuncio de criptomonedas. Nuestra IA los analizará en busca de señales de fraude.",
        "Analyze for Fraud": "Analizar en busca de Fraude",
        "Common Crypto Scams": "Estafas de Criptomonedas Comunes",
        "High-Yield Promises": "Promesas de Altos Rendimientos Garantizados",
        "High-Yield Promises Content": "Los estafadores a menudo atraen a las víctimas con promesas de altos rendimientos o ganancias garantizadas con poco o ningún riesgo. En el volátil mercado de las criptomonedas, cualquier promesa de este tipo es una señal de alerta importante. Desconfía de plataformas que ofrecen bonos de bienvenida excesivamente generosos o beneficios que parecen demasiado buenos para ser verdad.",
        "High Returns Tag": "Altos Rendimientos",
        "Guaranteed Profits Tag": "Ganancias Garantizadas",
        "Welcome Bonuses Tag": "Bonos de Bienvenida",
        "Pump and Dump Schemes": "Esquemas de Pump and Dump",
        "Pump and Dump Content": "En un 'pump and dump,' los estafadores inflan artificialmente el precio de una moneda de bajo valor a través de declaraciones positivas falsas y engañosas ('pumping'). Una vez que el precio es alto, venden sus holdings ('dumping'), lo que provoca que el precio se desplome y deja a otros inversores con activos sin valor. Ten cuidado con las monedas con picos de precios repentinos e inexplicables y promoción agresiva en línea.",
        "Price Manipulation Tag": "Manipulación de Precios",
        "Social Media Hype Tag": "Hype en Redes Sociales",
        "Low-Cap Coins Tag": "Monedas de Baja Capitalización",
        "Phishing Scams": "Estafas de Phishing",
        "Phishing Scams Content": "Las estafas de phishing a menudo involucran correos electrónicos, sitios web o mensajes de redes sociales falsos que parecen ser de una empresa legítima. Su objetivo es engañarte para que entregues tus claves privadas, contraseñas u otra información personal. Siempre verifica dos veces la URL y desconfía de los mensajes no solicitados que piden datos confidenciales.",
        "Fake Websites Tag": "Sitios Web Falsos",
        "Private Keys Tag": "Claves Privadas",
        "Impersonation Tag": "Suplantación de Identidad",
        "Pressure to Act Fast": "Presión para Actuar Rápido",
        "Pressure to Act Fast Content": "Los estafadores crean un falso sentido de urgencia, presionándote para que inviertas rápidamente o te perderás una oportunidad única. Pueden usar tácticas como temporizadores de cuenta regresiva para 'ofertas exclusivas' o afirmar que solo quedan unos pocos lugares. Las oportunidades de inversión legítimas no requieren decisiones apresuradas.",
        "False Urgency Tag": "Falsa Urgencia",
        "Pressure Tactics Tag": "Tácticas de Presión",
        "Limited-Time Offers Tag": "Ofertas por Tiempo Limitado",
        "Already Scammed? Get Help": "¿Ya te estafaron? Obtén Ayuda",
        "Describe your situation below. Our AI will provide recommendations on what to do next.": "Describe tu situación a continuación. Nuestra IA te proporcionará recomendaciones sobre qué hacer.",
        "Explain what happened...": "Explica lo que sucedió...",
        "Get Recommendations": "Obtener Recomendaciones",
        "Fraud Analysis Report": "Informe de Análisis de Fraude",
        "High Fraud Risk": "Alto Riesgo de Fraude",
        "Potential Risk Detected": "Riesgo Potencial Detectado",
        "Low Fraud Risk": "Bajo Riesgo de Fraude",
        "AI Analysis Details:": "Detalles del Análisis de IA:",
        "Report incorrect analysis": "Reportar análisis incorrecto",
        "Report Sent": "Reporte Enviado",
        "Thank you for your feedback. We will review the analysis.": "Gracias por tus comentarios. Revisaremos el análisis.",
        "Add to Hall of Scammers": "Añadir al Salón de Estafadores",
        "Added to Hall of Scammers": "Añadido al Salón de Estafadores",
        "The URL has been added to our public database of scam sites.": "La URL ha sido añadida a nuestra base de datos pública de sitios de estafa.",
        "Error": "Error",
        "Failed to add URL to Hall of Scammers.": "No se pudo añadir la URL al Salón de Estafadores.",
        "URL already reported.": "La URL ya ha sido reportada.",
        "Hall of Scammers": "Salón de Estafadores",
        "A community-reported list of fraudulent websites. URLs are added here when they get a high fraud score from our AI.": "Una lista de sitios web fraudulentos reportados por la comunidad. Las URLs se añaden aquí cuando obtienen una puntuación de fraude alta de nuestra IA.",
        "Loading reported scams...": "Cargando estafas reportadas...",
        "No scams reported yet. Be the first!": "Aún no se han reportado estafas. ¡Sé el primero!",
        "Reported": "Reportado"
    }
};


interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
