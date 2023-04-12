import { useState } from 'react';
import Layout from '../components/Layout';

const faqs = [
  {
    question: 'What is TibetSwap?',
    answer: 'TibetSwap is an <a href="https://www.coindesk.com/learn/what-is-an-automated-market-maker/" target="_blank" rel="noopener noreferrer">Automated Market Maker (AMM)</a> running on the <a href="https://www.chia.net/" target="_blank" rel="noopener noreferrer">Chia blockchain</a>.',
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
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">FAQ</h1>
      <div>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleAnswer(index)}
              className="text-left font-semibold w-full text-lg px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <div
                className="px-4 py-2 bg-gray-100 text-left rounded-b-md faq-answer"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default FAQ;
