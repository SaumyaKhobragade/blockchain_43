# Report Card Generator on FileCoin

A decentralized academic report card management system that leverages FileCoin/IPFS for permanent, immutable storage of student records.

## Features

✨ **Beautiful UI Design**
- Modern gradient-based hero section
- Responsive card layouts
- Smooth animations and transitions
- Professional report card templates

🎓 **Report Card Management**
- Create detailed academic report cards
- Multiple subjects with individual grades
- Automatic grade calculation (A+ to F)
- Teacher remarks and signatures
- Student information tracking

🔗 **FileCoin Integration**
- Store report cards permanently on IPFS
- On-chain CID storage via smart contracts
- Immutable academic records
- Decentralized data integrity

📊 **Smart Features**
- Real-time grade calculations
- Dynamic subject addition/removal
- Search and filter functionality
- PDF download capability
- Local storage backup

## Tech Stack

- **Frontend**: Next.js 15.3, React 18, TypeScript
- **Styling**: CSS Modules, Tailwind CSS
- **Blockchain**: FileCoin Calibration Testnet
- **Web3**: Wagmi, RainbowKit, Ethers.js
- **Storage**: Lighthouse SDK (IPFS), Smart Contracts
- **Icons**: Font Awesome 6

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- MetaMask or compatible Web3 wallet
- Lighthouse API key (get from [https://files.lighthouse.storage/](https://files.lighthouse.storage/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/blockchain_43.git
cd blockchain_43
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
blockchain_43/
├── app/
│   ├── create/          # Create report card page
│   ├── view/            # View all report cards page
│   ├── store/           # FileCoin storage demo page
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Home page with hero
├── components/
│   ├── Hero.tsx                  # Landing page hero
│   ├── ReportCardForm.tsx        # Form for creating report cards
│   ├── ReportCardDisplay.tsx     # Report card display component
│   ├── header.tsx                # Navigation header
│   └── walletConnect.tsx         # Wallet connection component
├── types/
│   └── reportCard.ts             # TypeScript interfaces
├── lib/
│   └── contract.ts               # Smart contract ABI & address
└── hooks/
    └── useEthers.ts              # Ethers.js hooks
```

## Usage

### Creating a Report Card

1. Navigate to **Create Report Card** page
2. Fill in student information:
   - Student Name & ID
   - Class & Section
   - Academic Year & Term
3. Add subjects and marks:
   - Subject name
   - Marks obtained
   - Maximum marks
   - Automatic grade calculation
4. Enter teacher information and remarks
5. Click **Generate Report Card**

### Storing on FileCoin

1. After creating a report card, review the preview
2. Connect your Web3 wallet (FileCoin Calibration Testnet)
3. Click **Store on FileCoin**
4. Confirm the transaction in your wallet
5. Wait for:
   - IPFS upload (progress bar shown)
   - Smart contract transaction
6. Report card CID is stored permanently on-chain

### Viewing Report Cards

1. Navigate to **View All** page
2. Browse all created report cards
3. Use search to find specific students
4. Filter by class
5. Click **View Full Report** for detailed view
6. Download as PDF using browser print

## Smart Contract

The FileCoin smart contract stores report card CIDs on-chain:

**Contract Address**: `0xc50dd07ae5CdE4B1bFf213881b87180e22e34A9c`

**Functions**:
- `store(string cid)` - Store a new CID
- `retrieve()` - Retrieve the stored CID
- `CID()` - View the current CID

## Grading System

| Percentage | Grade |
|-----------|-------|
| 90-100%   | A+    |
| 80-89%    | A     |
| 70-79%    | B+    |
| 60-69%    | B     |
| 50-59%    | C     |
| 40-49%    | D     |
| 0-39%     | F     |

## Design System

### Colors

- **Primary**: `#732fda` (Purple)
- **Secondary**: `#e546dd` (Pink)
- **Accent**: `#4946e5` (Blue)
- **Background**: `#0b0326` (Dark Purple)
- **Text**: `#e6e6f0` (Light Gray)

### Typography

- **Headings**: Lobster (Google Fonts)
- **Body**: Geist Sans
- **Display**: Funnel Display

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_LIGHTHOUSE_API_KEY` | Lighthouse API key for IPFS uploads | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_RPC_URL` | FileCoin RPC endpoint | No (defaults to Calibration) |

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- FileCoin Foundation for decentralized storage infrastructure
- Lighthouse for IPFS gateway services
- RainbowKit for wallet connection UI
- Next.js team for the amazing framework

---

**Made with ❤️ for decentralized education records**
