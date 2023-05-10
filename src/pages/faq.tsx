import { useState } from 'react';

const faqs = [
  {
    question: 'What is TibetSwap?',
    answer: 'TibetSwap is an <a href="https://www.coindesk.com/learn/what-is-an-automated-market-maker/" target="_blank" rel="noopener noreferrer">Automated Market Maker (AMM)</a> running on the <a href="https://www.chia.net/" target="_blank" rel="noopener noreferrer">Chia blockchain</a>. It uses funds provided by some users (liquidity providers) to allow anyone to trade XCH and tokens at what it considers to be a fair price. For each swap, a 0.7% fee is taken and distributed to liquidity providers as an incentive to keep their money in the protocol.',
  },
  {
    question: 'Why should I trust you with my money?',
    answer: 'You shouldn\'t. As a trader, you only interact with TibetSwap via offers - the transaction will simply not go through if you are not given what you asked for. TibetSwap puzzles were designed to be immutable, with no \'admin keys\' - once the protocol is deployed, the creators of the app have the same permissions over the app as any regular user. Liquidity providers are strongly encouraged to do their own research, keeping in mind the risks associated with having funds locked in the protocol: security and impermanent loss.',
  },
  {
    question: 'What are the fees associated with using TibetSwap?',
    answer: 'Aside for the associated blockchain fees, 0.7% of every trade is distributed to liquidity providers for the pool that is involved in the transaction. There is alo a developer fee, which is completely optional and you can set it to any value you want - your donations keep the ecosystem running!',
  },
  {
    question: 'What is liquidity used for, exactly?',
    answer: 'TibetSwap is, at its core, just a program running on the Chia blockchain. It uses liquidity - funds provided by users known as liquidity providers - to trade at a price it deems fair based on its reserves. More liquidity reflects as better prices for larger trade volumes.',
  },
  {
    question: 'How are fees distributed to liquidity providers?',
    answer: 'When you deposit liquidity to a pair, you receive liquidity tokens. These CATs represent your \'share\' of the pair - if you have 100 liquidity tokens and there are 1000 in existence, for example, you own 10% of the pair. When you withdraw liqudity, you burn the CATs to get your share back. Since swap fees accumulate in the pair with each swap, your share will also contain that value (minus impermanent loss). So, in short, the fees are included in the amount you withdraw when you remove your liqudiiy.',
  },
  {
    question: 'Are there any risks associated with providing liquidity?',
    answer: 'Yes, there are. The first risk is contract (puzzle) security. Despite thorough testing, there is always a possibility of undiscovered vulnerabilities in the contracts (puzzles) behind TibetSwap. The second major risk is impermanent loss. An introductory article about the topic can be found <a href="https://academy.binance.com/en/articles/impermanent-loss-explained" target="_blank" rel="noopener noreferrer">here</a>. It is essential for liquidity providers to understand and carefully consider these risks before participating in any AMM.',
  },
  {
    question: 'Is the code open-source?',
    answer: 'Of course! How else would liquidity providers trust us with their money? The smart contracts (puzzles), CLI, and API can be found in <a href="https://github.com/yakuhito/tibet" target="_blank" rel="noopener noreferrer">this repository</a>. For any questions about the code, just reach out to us!',
  },
  {
    question: 'Do you provide an API?',
    answer: 'While you are strongly encouraged to run your own instance of our API, there is nothing stopping you from accessing ours. You can find it <a href="https://api.v1-testnet10.tibetswap.io/docs" target="_blank" rel="noopener noreferrer">here</a>.',
  },
  {
    question: 'How can I make my token tradeable on TibetSwap?',
    answer: 'Currently, you need to use the <a href="https://github.com/Yakuhito/tibet/" target="_blank" rel="noopener noreferrer">TibetSwap CLI</a> to deploy a pair for your token. However, we are happy to help! Once you have an initial price in mind and some initial liquidity for the pair (50% token, 50% XCH), just message <a href="https://twitter.com/yakuh1t0" target="_blank" rel="noopener noreferrer">yakuhito</a> and he\'ll deploy the pair for you :)',
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="max-w-[28rem] mx-auto">
      <h1 className="text-5xl font-bold pb-12">FAQ</h1>
      <div className="mb-4 max-w-[28rem]">
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
                className="px-4 py-2 pb-6 bg-brandDark/10 text-left rounded-b-xl w-full"
                dangerouslySetInnerHTML={{ __html: faq.answer }} 
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default FAQ;
