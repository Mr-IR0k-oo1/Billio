import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const demoSteps = [
    {
      title: "1. Describe your work in one sentence",
      input: "Designed and implemented a responsive e-commerce landing page with React and Node.js backend.",
      output: undefined,
      placeholder: "e.g., 'Built a landing page for client X'"
    },
    {
      title: "2. AI generates professional line items",
      input: undefined,
      output: [
        "Frontend Development - React component architecture",
        "Backend Integration - RESTful API endpoints",
        "Database Setup - MongoDB schema design", 
        "Responsive Design - Mobile-first approach",
        "Testing & QA - Cross-browser compatibility"
      ] as const,
      placeholder: undefined
    },
    {
      title: "3. Customize and send in one click",
      input: undefined,
      output: "Invoice ready! Professional PDF generated and sent to client.",
      placeholder: undefined
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(1);
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setInputText('');
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="glow-effect" style={{ top: '40%', right: '20%', opacity: 0.1 }} />
      <div className="home-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="home-h2">See Billio in action</h2>
          <p className="home-subtitle">
            Try our AI-powered invoicing right now. No signup required.
          </p>
        </div>

        <motion.div 
          className="max-w-4xl mx-auto glass-panel p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {demoSteps.map((_, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`h-2 w-16 rounded-full transition-all duration-500 ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                />
                {index < demoSteps.length - 1 && (
                  <div className={`w-8 h-0.5 transition-all duration-500 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              {currentStepData.title}
            </h3>

            {/* Step 1: Input */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={currentStepData.placeholder}
                    className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                  {inputText && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="text-blue-400 animate-pulse" size={20} />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!inputText.trim() || isGenerating}
                  className="btn-cta mx-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: AI Output */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="glass-panel p-6 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="text-green-500" size={20} />
                    <span className="text-green-400 font-medium">AI Generated</span>
                  </div>
                  <ul className="space-y-3">
                    {Array.isArray(currentStepData.output) && currentStepData.output.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={handleNext}
                  className="btn-secondary mx-auto flex items-center gap-2"
                >
                  Continue to send <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 3: Final */}
            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="text-green-500" size={40} />
                </div>
                <p className="text-xl text-gray-300">{currentStepData.output}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="btn-cta flex items-center justify-center gap-2">
                    Try it for real <ArrowRight size={20} />
                  </Link>
                  <button
                    onClick={handleReset}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    Try demo again
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};