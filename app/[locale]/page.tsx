'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wechatId: '',
    message: '',
    phone: '' // Honeypot field - hidden from users but bots might fill it
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'daily_limit'>('idle');
  const [limitReached, setLimitReached] = useState(false);

  // Check daily limit status when component loads
  useEffect(() => {
    const checkLimitStatus = async () => {
      try {
        const response = await fetch('/api/limit-status');
        if (response.ok) {
          const data = await response.json();
          setLimitReached(data.limitReached);
          if (data.limitReached) {
            setSubmitStatus('daily_limit');
          }
        }
      } catch (error) {
        console.error('Error checking limit status:', error);
      }
    };

    checkLimitStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', wechatId: '', message: '', phone: '' });
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Handle specific error types
        if (response.status === 429) {
          if (errorData.error === 'daily_limit_reached') {
            setSubmitStatus('daily_limit');
          } else {
            setSubmitStatus('error');
          }
        } else if (response.status === 400) {
          setSubmitStatus('error');
          // You could add specific error messages for validation errors
        } else {
          setSubmitStatus('error');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('header.title')}</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{t('header.subtitle')}</p>
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <nav className="flex gap-6">
                <a 
                  href="#ask-cong" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {t('navigation.askCong')}
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="mb-16">
          {t('about.title').trim() && (
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('about.title')}</h3>
          )}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {locale === 'zh'
                ? t.rich('about.content1', {
                    link: (chunks) => (
                      <a href="https://www.linkedin.com/in/congyao/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">{chunks}</a>
                    )
                  })
                : t('about.content1')}
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {locale === 'zh'
                ? t.rich('about.content2', {
                    link: (chunks) => (
                      <a href="https://www.linkedin.com/in/congyao/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">{chunks}</a>
                    )
                  })
                : (
                  <>
                    {t('about.content2')}
                    <a href="https://www.linkedin.com/in/congyao/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">{t('about.linkedin')}</a>
                    to learn more about my background and experience.
                  </>
                )}
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('expertise.title')}</h3>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t('expertise.ip.title')}</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {t.raw('expertise.ip.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t('expertise.transactional.title')}</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {t.raw('expertise.transactional.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t('expertise.litigation.title')}</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {t.raw('expertise.litigation.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t('expertise.duediligence.title')}</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {t.raw('expertise.duediligence.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Ask Cong Section */}
        <section id="ask-cong" className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('contact.title')}</h3>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            {t('contact.intro').trim() && (
              <div className="text-center mb-8">
                <p className="text-slate-700 dark:text-slate-300 text-lg">
                  {t('contact.intro')}
                </p>
              </div>
            )}
            
            {/* Daily Limit Message */}
            {limitReached && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
                <p className="text-orange-800 dark:text-orange-200 text-center text-lg font-medium">
                  {t('contact.limitMessage')}
                </p>
              </div>
            )}
              
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={limitReached}
                  className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors ${
                    limitReached 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={limitReached}
                  className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors ${
                    limitReached 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="wechatId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('contact.form.wechatId')} <span className="text-slate-500 text-xs">{t('contact.form.wechatIdOptional')}</span>
                </label>
                <input
                  type="text"
                  id="wechatId"
                  name="wechatId"
                  value={formData.wechatId}
                  onChange={handleInputChange}
                  disabled={limitReached}
                  className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors ${
                    limitReached 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder={t('contact.form.wechatPlaceholder')}
                />
              </div>
              
              {/* Honeypot field - hidden from users but bots might fill it */}
              <div className="hidden">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('contact.form.question')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  disabled={limitReached}
                  className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors resize-none ${
                    limitReached 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder={t('contact.form.questionPlaceholder')}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || limitReached}
                className={`w-full font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-lg ${
                  limitReached
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
                }`}
              >
                {limitReached ? t('contact.form.limitReached') : (isSubmitting ? t('contact.form.sending') : t('contact.form.submit'))}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center">{t('contact.success')}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{t('contact.error')}</p>
              )}
              
              {/* Legal Disclaimer */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  {t('contact.disclaimer')}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {t('footer.copyright', { year: new Date().getFullYear() }).trim() && (
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-300">
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}