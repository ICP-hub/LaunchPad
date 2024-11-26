import React, { useState } from 'react';

const FaqDiscussionTab = () => {
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const faqs = [
    {
      question: 'What is Blockchain technology?',
      answer:
        'Blockchain is a decentralized and distributed digital ledger technology that securely records data or transactions across multiple computers. It ensures transparency, immutability, and security, making it a foundation for cryptocurrencies like Bitcoin and many other applications.',
    },
    {
      question: 'What is a Token?',
      answer:
        'A token is a digital asset created on a blockchain, representing value, utility, or ownership. It can be fungible (like cryptocurrencies) or non-fungible (NFTs).',
    },
    {
      question: 'WWhat is a Fair Launch?',
      answer:
        'A fair launch is when a cryptocurrency or blockchain project is introduced publicly, allowing equal participation without private sales, pre-mining, or exclusive allocations, promoting transparency and decentralization.',
    },
    {
      question: 'What is a Hard Cap in Tokens?',
      answer:
        'A hard cap is the maximum amount of funds or tokens a blockchain project aims to raise or issue during a token sale, ensuring a fixed supply limit.',
    },
    {
      question: 'What is a Soft Cap in Tokens?',
      answer:
        'A soft cap is the minimum amount of funds a blockchain project aims to raise during a token sale to proceed with its development or operations.',
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
    <div className="max-w-full mx-2    rounded-lg">
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
      {/* <div className="mt-6">
        <h2 className="text-xl text-white mb-4">Discussion</h2>
        <p className="text-gray-400">{comments.length} Comments</p>
        
        <div className="w-full flex  flex-col ss2:flex-row  mt-2 p-3 bg-[#222222]  rounded-2xl border-b-2 outline-none">
         
        <textarea 
          rows="4"
          placeholder="Start The Discussion..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-full h-[30px] text-[14px] bg-[#222222] mb-2'
        />
         <div className='justify-center items-center'>
        <button
          className=" bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]  w-[100px]  p-[1.5px] h-[35px] mx-2 items-center justify-center rounded-xl"
          onClick={handleCommentSubmit}
        >
          <div className='bg-[#222222] rounded-xl justify-center  w-full h-full '>
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
      </div> */}
    </div>
  );
};

export default FaqDiscussionTab;
