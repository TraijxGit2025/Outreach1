import { Investor } from './types';

export const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    firm: 'Sequoia Capital',
    focus: 'B2B SaaS, AI Infrastructure, Enterprise',
    aum: '$85B',
    pastDeals: ['Stripe', 'Zoom', 'Snowflake'],
    website: 'sequoiacap.com',
    status: 'New'
  },
  {
    id: '2',
    name: 'Marc Andreessen',
    firm: 'a16z',
    focus: 'Crypto, Consumer Social, American Dynamism',
    aum: '$35B',
    pastDeals: ['Facebook', 'Coinbase', 'Airbnb'],
    website: 'a16z.com',
    status: 'New'
  },
  {
    id: '3',
    name: 'Bill Gurley',
    firm: 'Benchmark',
    focus: 'Marketplaces, Consumer Internet',
    aum: '$9B',
    pastDeals: ['Uber', 'Zillow', 'Nextdoor'],
    website: 'benchmark.com',
    status: 'New'
  },
  {
    id: '4',
    name: 'Rebecca Lynn',
    firm: 'Canvas Ventures',
    focus: 'Fintech, Digital Health, Insurtech',
    aum: '$1.5B',
    pastDeals: ['LendingClub', 'Check', 'Doximity'],
    website: 'canvas.vc',
    status: 'New'
  },
  {
    id: '5',
    name: 'Fred Wilson',
    firm: 'Union Square Ventures',
    focus: 'Web3, Climate, Networks',
    aum: '$4B',
    pastDeals: ['Twitter', 'Coinbase', 'Etsy'],
    website: 'usv.com',
    status: 'New'
  },
  {
    id: '6',
    name: 'Garry Tan',
    firm: 'Y Combinator',
    focus: 'Early Stage, Seed, Agnostic',
    aum: '$1B+',
    pastDeals: ['Coinbase', 'Instacart'],
    website: 'ycombinator.com',
    status: 'New'
  }
];

export const INITIAL_PITCH_TEXT = `
Company: NexusAI
Mission: Democratizing hedge-fund grade algorithmic trading for retail investors.
Product: A mobile app that connects to brokerage accounts (Robinhood, Schwab) and allows users to subscribe to AI-managed trading strategies.
Traction: $500k ARR, 20% MoM growth, 5,000 MAU.
Team: Ex-Goldman Sachs quant traders and Google DeepMind engineers.
Ask: Raising $2M Seed round to acquire regulatory licenses and scale marketing.
Unique Advantage: Proprietary reinforcement learning model that adapts to volatility 10x faster than competitors.
`;
