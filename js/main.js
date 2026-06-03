let currentLang = localStorage.getItem('lang') || 'zh';

function t(key) {
  return (window.translations[currentLang] || {})[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    const val = t(key);
    if (val) el.href = val;
  });
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = t('nav.lang');
  document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'en';
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', currentLang);
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.addEventListener('click', toggleLang);
});
