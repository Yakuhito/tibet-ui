import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'What is TibetSwap?',
    answer: 'TibetSwap is an <a href="https://www.coindesk.com/learn/what-is-an-automated-market-maker/" target="_blank" rel="noopener noreferrer">Automated Market Maker (AMM)</a> running on the <a href="https://www.chia.net/" target="_blank" rel="noopener noreferrer">Chia blockchain</a>.',
  },
  {
    question: 'Why should I trust you with my money?',
    answer: 'You shouldn\'t. First, you only send offers to the server, meaning that the transaction only goes through if you received what you asked for. Second, TibetSwap puzzles were designed to be immutable, with no \'admin keys\' - once the router is launched, the creators of the app have the same permissions over the app as any regular user.',
  },
  {
    question: 'Is the code open-source?',
    answer: 'Of course! The smart contracts (puzzles), CLI, and API can be found in <a href="https://github.com/yakuhito/tibet" target="_blank" rel="noopener noreferrer">this repository</a>, and the source of this website can be found <a href="https://github.com/Yakuhito/tibetswap-v1-ui" target="_blank" rel="noopener noreferrer">here</a>.',
  },
  {
    question: 'Are there any risks associated with providing liquidity?',
    answer: 'Yes, there are. The first risk is contract (puzzle) security. Despite thorough testing, there is always a possibility of undiscovered vulnerabilities in the contracts (puzzles) behind TibetSwap. The second major risk is impermanent loss. An introductory article about the topic can be found <a href="https://academy.binance.com/en/articles/impermanent-loss-explained" target="_blank" rel="noopener noreferrer">here</a>. It is essential for liquidity providers to understand and carefully consider these risks before participating in any AMM.',
  },
  {
    question: 'What are the fees associated with using TibetSwap?',
    answer: 'Aside for the associated blockchain fees, 0.7% of every trade is distributed to liquidity providers for the pool that is involved in the transaction.',
  },
  {
    question: 'Do you provide an API?',
    answer: 'While you are strongly encouraged to run your own instance of our API, there is nothing stopping you from accessing ours. Just prepend "api." to the domain you used to access this page (e.g., "api.v1-testnet10.tibetswap.io"). An up-to-date list of endpoints, possible parameters, and responses can be found at <a href="https://api.v1-testnet10.tibetswap.io/docs" target="_blank" rel="noopener noreferrer">/docs</a>.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <h1 className="text-5xl font-bold py-12 w-full">FAQ</h1>
      <div className="mb-4 w-full">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleAnswer(index)}
              className={`text-left font-semibold text-lg px-4 py-4 bg-brandDark/10 rounded-xl focus:outline-none w-full ${activeIndex === index ? 'rounded-b-none' : ''}`}
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <div
                className="px-4 py-2 pb-6 bg-brandDark/10 text-left rounded-b-xl faq-answer w-full"
                dangerouslySetInnerHTML={{ __html: faq.answer }} 
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
