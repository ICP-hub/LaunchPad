import { useState } from 'react';

const FAQSection = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item bg-[#FFFFFF12] border-2 border-[#FFFFFFCC] px-20 py-1 rounded-3xl mb-8 w-[100%]">
      <div
        className="faq-question flex justify-between items-center cursor-pointer"
        onClick={toggleFAQ}
      >
        <span className="text-lg font-medium">{question}</span>
        <button className="faq-toggle text-2xl">
          {isOpen ? '-' : '+'}
        </button>
      </div>
      <div
        className={`faq-answer overflow-hidden transition-[max-height] duration-500 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}
      >
        <p className={`mt-3 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out`}>
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQsDiscussion = () => {
  const faqs = [
    {
      question: 'What is BlockseBlock?',
      answer: 'BlockseBlock is a sample text used here as a placeholder. The actual content would go here.',
    },
    {
      question: 'How does BlockseBlock work?',
      answer: 'It works as a placeholder to give an idea of how real content will look.',
    },
    {
      question: 'Why use BlockseBlock?',
      answer: 'It helps designers and developers visualize the layout with text.',
    },
  ];

  return (
    <div className="mt-10">
      {faqs.map((faq, index) => (
        <FAQSection key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQsDiscussion;
