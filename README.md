# Mythical Beings Card Game Wallet v2

> A decentralized wallet and game interface for the Mythical Beings NFT trading card game, built on **Ardor** blockchain with cross-chain capabilities.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Chakra UI](https://img.shields.io/badge/chakra--ui-2.4.6-teal.svg)](https://chakra-ui.com/)
[![Ardor](https://img.shields.io/badge/blockchain-Ardor-purple.svg)](https://ardorplatform.org/)

## 🎮 About

Mythical Beings is a digital trading card game featuring legendary creatures from global mythology. This wallet application provides a comprehensive interface for managing your NFT collection, trading cards, playing battles, and interacting with the decentralized ecosystem. Build on Ardor.

### 🌟 Key Features

- **🎴 NFT Card Management**: View, organize, and manage your Mythical Beings card collection
- **🏛️ Marketplace**: Buy, sell, and trade cards with other players
- **⚔️ Battlegrounds**: Strategic card battles across different territories
- **🧪 Potions & Items**: Craft and use potions to enhance your creatures in battle
- **🌉 Cross-Chain Bridge**: Transfer assets between Ardor and Polygon networks
- **💎 Multi-Currency Support**: Handle wETH, GEM, MANA, and GIFTZ tokens
- **🏆 Bounty System**: Participate in jackpot events and earn rewards
- **📊 Real-time Trading**: Live order book and market data
- **🔐 Secure Wallet**: Non-custodial wallet with PIN protection

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tarasca-DAO/card-game-wallet-v2.git
   cd card-game-wallet-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Apply patches**
   ```bash
   npm run postinstall
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🎯 Core Gameplay

### Card Collection
- Collect mythical creatures from different continents and rarities
- Each card represents a unique NFT on the Ardor blockchain
- Cards have different attributes: rarity, continent, element, and power

### Battlegrounds
- Deploy your cards to conquer territories
- Use potions to enhance your creatures' abilities
- Strategic battles with real-time results
- Earn rewards and climb leaderboards

### Trading & Marketplace
- Create ask/bid orders for cards and items
- Real-time market data and order matching
- Trade currencies and special items
- Cross-chain asset transfers

### Potions & Items (Elyxir System)
- Single-use items that grant +1 power bonuses
- Three types: Medium, Continent, and Power potions
- Obtained through bounty rewards and pack openings
- Usable in Battlegrounds for strategic advantages

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Chakra UI 2.4.6** - Modular and accessible component library
- **Redux Toolkit** - State management with modern Redux patterns
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing

### Blockchain Integration
- **Ardor Platform** - Primary blockchain for NFTs and transactions
- **Polygon Network** - Cross-chain compatibility
- **Asset Management** - Direct interaction with Ardor APIs
- **Wallet Integration** - Secure key management and transaction signing

### Key Dependencies
```json
{
  "ardorjs": "^0.2.1",
  "axios": "^1.2.2",
  "crypto-browserify": "^3.12.0",
  "react-qr-code": "^2.0.11",
  "react-pdf": "^6.2.2"
}
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Cards/          # Card-related components
│   ├── Items/          # Potion and item components
│   ├── Modals/         # Modal dialogs
│   ├── Navigation/     # Navigation components
│   └── Pages/          # Page components
│       ├── BattlegroundsPage/    # Battle interface
│       ├── MarketPage/           # Trading marketplace
│       ├── InventoryPage/        # Collection management
│       ├── BountyPage/          # Jackpot system
│       └── Bridge/              # Cross-chain bridge
├── services/           # API and blockchain services
│   ├── Ardor/         # Ardor blockchain integration
│   ├── Battlegrounds/ # Battle mechanics
│   └── Bounty/        # Bounty system
├── utils/             # Utility functions
├── data/              # Constants and static data
├── redux/             # Redux store and reducers
└── themes/            # UI themes and styling
```

### Build Configuration
The project uses `react-app-rewired` for custom webpack configuration to handle blockchain-specific polyfills.

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with breakpoint-based layouts
- Touch-friendly interactions for mobile devices
- Optimized performance across all screen sizes

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### User Experience
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback
- Dark/light theme support

## 🔐 Security Features

- **Non-custodial wallet** - Users maintain control of their private keys
- **PIN protection** - Additional security layer for transactions
- **Secure storage** - Encrypted local storage for sensitive data
- **Transaction validation** - Client-side validation before blockchain submission

## 🌐 Cross-Chain Bridge

The bridge system allows seamless asset transfers between networks:

### Supported Assets
- **ERC-20 Tokens**: wETH, GEM, MANA
- **ERC-1155 NFTs**: Cards, Potions, GIFTZ packs
- **Native Assets**: Ardor-native tokens

### Bridge Process
1. Select asset and destination network
2. Initiate transfer with PIN confirmation
3. Wait for blockchain confirmation
4. Assets appear in destination wallet

## 📊 Trading System

### Order Types
- **Ask Orders** - Sell orders with specified price
- **Bid Orders** - Buy orders with specified price
- **Market Orders** - Instant execution at current market price

### Market Features
- Real-time order book updates
- Historical price data
- Trading volume statistics
- Market depth visualization

## 🏆 Bounty System

### Participation
- Burn cards to earn bounty tickets
- Different rarities provide different multipliers
- Jackpot accumulates from all participants

### Rewards
- wETH prizes from accumulated bounty
- Special card rewards
- Bonus potions and items

## 🧪 Potions & Items (Elyxir)

### Potion Types
- **Medium Potions** - Enhance creatures by element type
- **Continent Potions** - Boost creatures from specific continents
- **Power Potions** - Universal power enhancement

### Usage
- Equip before battle for strategic advantage
- Single-use items consumed after battle
- Stackable effects for multiple potions

## 🔄 Development Scripts

```bash
# Development
npm start              # Start development server
npm test               # Run test suite
npm run build          # Build for production

# Maintenance
npm run postinstall    # Apply patches
npm run eject          # Eject from Create React App (irreversible)
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [mythicalbeings.io](https://mythicalbeings.io)
- **Game Guide**: [How to Play Battlegrounds](https://mythicalbeings.io/how-to-play-battlegrounds.html)
- **Ardor Platform**: [ardorplatform.org](https://ardorplatform.org)
- **Community**: [Discord](https://discord.gg/mythicalbeings)

## 🙏 Acknowledgments

- Ardor Platform for blockchain infrastructure
- Chakra UI team for the component library
- React community for the frontend framework
- All contributors and community members

---

**Built with ❤️ by the Mythical Beings team**
