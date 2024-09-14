import React, { useState } from 'react';

const FaqDiscussionTab = () => {
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const faqs = [
    {
      question: 'What is BlockseBlock?',
      answer:
        'This is the explanation for what BlockseBlock is. It can be a detailed answer or a simple description.',
    },
    {
      question: 'What is BlockseBlock?',
      answer:
        'This is the explanation for what BlockseBlock is. It can be a detailed answer or a simple description.',
    },
    {
      question: 'What is BlockseBlock?',
      answer:
        'This is the explanation for what BlockseBlock is. It can be a detailed answer or a simple description.',
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="max-w-full mx-auto p-6  rounded-lg">
      {/* FAQ Section */}
      <div className="mb-6">
        <h2 className="text-xl text-white mb-4">Frequently Asked Questions</h2>
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 border-b-2 bg-[#222222]  rounded-2xl`}
            >
              <div
                className={`flex justify-between items-center p-2 cursor-pointer text-white ${
                  activeFaqIndex === index ? 'border-b  ' : ''
                }`} // Add border-b when active
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span>{activeFaqIndex === index ? '-' : '+'}</span>
              </div>
              {activeFaqIndex === index && (
                <div className="px-4 pb-4 text-gray-400">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Section */}
      <div className="mt-6">
        <h2 className="text-xl text-white mb-4">Discussion</h2>
        <p className="text-gray-400">{comments.length} Comments</p>
        
        <div className="w-full flex  mt-2 p-3 bg-[#222222]  rounded-2xl border-b-2 outline-none">
         
        <textarea 
          rows="4"
          placeholder="Start The Discussion..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-[800px] h-[30px] bg-[#222222]'
        />
         <div className='justify-center items-center'>
        <button
          className=" bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]  w-[100px]  p-[1.5px] h-[35px] mx-2 rounded-3xl"
          onClick={handleCommentSubmit}
        >
          <div className='bg-[#222222] rounded-3xl w-full h-full '>
          Comment
          </div>
        </button>
        </div>
        </div>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            NO Comments. Be the first one to start the discussion.
          </p>
        ) : (
          <div className="mt-6">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800 text-gray-400 rounded-lg mb-2"
              >
                {comment}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqDiscussionTab;
