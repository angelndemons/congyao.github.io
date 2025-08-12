'use client';

import { useState, useEffect } from 'react';

export default function Home() {
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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cong Yao</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Biotech Attorney Specializing in IP, Agreements, and AI</p>
            </div>
            <nav className="flex gap-6">
              <a 
                href="#ask-cong" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Ask Cong!
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome, I&apos;m Cong Yao
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Experienced IP and transactional attorney with deep understanding of biotech business, specializing in agreements, litigation, and strategic legal counsel for biotech companies.
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About Me</h3>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              I&apos;m an experienced IP and transactional attorney with deep expertise in biotechnology and pharmaceutical law. 
              My practice spans intellectual property litigation, complex transactional agreements, and strategic business counsel. 
              I understand the unique challenges biotech companies face and help them navigate legal complexities 
              while advancing their business objectives.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              With extensive experience in patent litigation, licensing agreements, and corporate transactions, 
              I provide practical legal solutions that align with business goals. Connect with me on 
              <a href="https://www.linkedin.com/in/congyao/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">LinkedIn</a>
              to learn more about my background and experience.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Legal Expertise</h3>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">IP & Patent Law</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Loss-Of-Exclusivity Analysis and Strategies</li>
                  <li>Patent Law</li>
                  <li>Global Portfolio Design and Execution</li>
                  <li>Strategic IP Planning</li>
                  <li>Patent Prosecution</li>
                  <li>BPCIA</li>
                  <li>Hatch-Waxman</li>
                  <li>IP Litigation</li>
                  <li>Trademark Law</li>
                  <li>Trade Secret Law</li>
                  <li>Copyright Law</li>
                </ul>
              </div>
              
                           <div>
               <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Transactional Law</h4>
               <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                 <li>CDA/NDA</li>
                 <li>MTA</li>
                 <li>Clinical Trial Agreements</li>
                 <li>Collaboration Agreements</li>
                 <li>Patent Licenses</li>
                 <li>M&A Agreements</li>
                 <li>Joint Ventures</li>
               </ul>
             </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Due Diligence</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Legal Due Diligence</li>
                  <li>IP Due Diligence</li>
                  <li>Exhaustive DD Analysis of Target</li>
                  <li>Responding to DD Inquiries</li>
                  <li>Cross-Border IP Issues</li>
                </ul>
              </div>
              
                           <div>
               <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Corporate</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Corporate Governance</li>
                  <li>Board Counsel</li>
                  <li>SEC Compliance</li>
                  <li>Employment Law</li>
                  <li>Risk Management</li>
                  <li>Regulatory Compliance</li>
                  <li>Biotech Business</li>
                  <li>Strategic Counsel</li>
                </ul>
              </div>
            </div>
          </div>
        </section>



        {/* Ask Cong Section */}
        <section id="ask-cong" className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Ask Cong!</h3>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
                      <div className="text-center mb-8">
            <p className="text-slate-700 dark:text-slate-300 text-lg">
              Ask me anything on your mind, legal or otherwise (not giving legal advice :)
            </p>
          </div>
          
          {/* Daily Limit Message */}
          {limitReached && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
              <p className="text-orange-800 dark:text-orange-200 text-center text-lg font-medium">
                ☕ Oops! My inbox is flooded and taking a coffee break! Come back tomorrow when I&apos;m fresh and caffeinated.
              </p>
            </div>
          )}
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
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
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
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
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="wechatId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  WeChat ID <span className="text-slate-500 text-xs">(optional)</span>
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
                  placeholder="Your WeChat ID (optional)"
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
                  Question
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
                  placeholder="What&apos;s on your mind? Ask away!"
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
                {limitReached ? 'Daily Limit Reached' : (isSubmitting ? 'Sending...' : 'Ask Cong!')}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center">Thank you! I&apos;ll get back to you soon!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 dark:text-red-400 text-sm text-center">Oops! Something went wrong. Please try again.</p>
              )}

              
              {/* Legal Disclaimer */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  <strong>Important:</strong> Contacting me through this form does not create an attorney-client relationship. 
                  Do not submit confidential or privileged information. By submitting this form, you consent to the processing 
                  of your information for the purpose of responding to your inquiry and providing legal services.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300">
              © {new Date().getFullYear()} Cong Yao. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}