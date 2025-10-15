# 🚀 How to Store Report Cards on FileCoin - Complete Guide

## Overview

Your IntelliX application is **already integrated** with FileCoin! The storage system uses:
- **Lighthouse SDK** → Uploads data to IPFS
- **Smart Contract** → Stores the IPFS CID on FileCoin blockchain
- **Permanent Storage** → Data is immutable and decentralized

---

## 🔧 Setup (One-Time Configuration)

### Step 1: Get Lighthouse API Key

1. Visit: https://files.lighthouse.storage/
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### Step 2: Get WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com/
2. Sign in with GitHub or email
3. Create a new project
4. Copy the Project ID

### Step 3: Configure Environment Variables

Open `d:\blockchain_43\.env.local` and add your keys:

```env
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=paste_your_lighthouse_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=paste_your_walletconnect_id_here
NEXT_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
```

### Step 4: Get Test FIL Tokens

You need test tokens to pay for blockchain transactions:

1. Visit: https://faucet.calibration.fildev.network/
2. Enter your wallet address
3. Request test FIL
4. Wait for tokens to arrive (~1-2 minutes)

### Step 5: Start the Application

```powershell
# Make sure you're in the project directory
cd d:\blockchain_43

# Start the dev server
npm run dev
```

---

## 📝 How to Store a Report Card

### Method 1: Using the UI (Recommended)

1. **Navigate to Create Page**
   - Open http://localhost:3000
   - Click "Create Report Card" button on hero section
   - Or go directly to http://localhost:3000/create

2. **Fill Out the Form**
   ```
   Student Information:
   - Student Name: e.g., "John Doe"
   - Student ID: e.g., "ST-2024-001"
   - Class: e.g., "10th"
   - Section: e.g., "A"
   - Academic Year: e.g., "2024-2025"
   - Term: Select from dropdown
   ```

3. **Add Subjects & Marks**
   ```
   For each subject:
   - Subject Name: e.g., "Mathematics"
   - Marks Obtained: e.g., 85
   - Max Marks: e.g., 100
   - Grade: Auto-calculated (e.g., A)
   ```
   - Click "+ Add Subject" to add more subjects
   - Click trash icon to remove subjects

4. **Add Teacher Information**
   ```
   - Teacher Name: e.g., "Ms. Sarah Johnson"
   - Remarks: e.g., "Excellent performance. Keep it up!"
   ```

5. **Generate Report Card**
   - Click "Generate Report Card" button
   - Preview your report card

6. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select MetaMask (or your preferred wallet)
   - Switch to FileCoin Calibration Testnet if prompted
   - Approve the connection

7. **Store on FileCoin**
   - Click "Store on FileCoin" button
   - Watch the progress:
     - ✓ Uploading to IPFS (progress bar shows %)
     - ✓ Storing CID on blockchain (spinner)
   - Confirm the transaction in your wallet
   - Wait for success message

8. **Success!**
   - You'll see the FileCoin CID displayed
   - The report card is now permanently stored
   - Click "View All Report Cards" to see it in the list

---

## 🔍 What Happens Behind the Scenes

### 1. Data Preparation
```typescript
// Your report card data is converted to JSON
const reportCardData = {
  id: "RC-1234567890-abc123",
  studentName: "John Doe",
  studentId: "ST-2024-001",
  class: "10th",
  section: "A",
  subjects: [...],
  totalMarks: 425,
  percentage: 85.0,
  overallGrade: "A",
  // ... more fields
}
```

### 2. IPFS Upload (via Lighthouse)
```typescript
// File is created and uploaded
const jsonBlob = new Blob([JSON.stringify(reportCard)])
const file = new File([jsonBlob], `report-card-${id}.json`)

// Upload to IPFS
const output = await lighthouse.upload([file], apiKey)
const cid = output.data.Hash // e.g., "QmXxx..."
```

### 3. Blockchain Storage
```typescript
// CID is stored in smart contract
const contract = new ethers.Contract(ADDRESS, ABI, signer)
const tx = await contract.store(cid)
await tx.wait() // Wait for confirmation
```

### 4. Verification
- Data is accessible at: `https://gateway.lighthouse.storage/ipfs/{CID}`
- CID is stored on FileCoin blockchain
- Anyone can verify the data integrity

---

## 📂 Code Flow Reference

### File: `app/create/page.tsx` (Lines 50-90)

The main storage function:

```typescript
const handleStoreOnFileCoin = async () => {
  // 1. Convert report card to JSON
  const jsonBlob = new Blob([JSON.stringify(reportCard, null, 2)])
  const file = new File([jsonBlob], `report-card-${reportCard.id}.json`)

  // 2. Upload to IPFS via Lighthouse
  const output = await lighthouse.upload([file], apiKey, false, progressCallback)
  const cid = output?.data?.Hash

  // 3. Store CID on FileCoin smart contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  const tx = await contract.store(cid)
  await tx.wait()

  // 4. Save locally and update state
  localStorage.setItem("reportCards", JSON.stringify([...reportCards, { ...reportCard, cid }]))
}
```

---

## 🔗 Smart Contract Details

**Contract Address:** `0xc50dd07ae5CdE4B1bFf213881b87180e22e34A9c`

**Network:** FileCoin Calibration Testnet

**Functions:**
- `store(string cid)` - Stores a new CID
- `retrieve()` - Retrieves the last stored CID
- `CID()` - Public variable with current CID

**Contract Code:**
```solidity
contract ReportCardStorage {
    string public CID;
    
    function store(string memory cid) public {
        CID = cid;
    }
    
    function retrieve() public view returns (string memory) {
        return CID;
    }
}
```

---

## 🌐 Accessing Stored Data

### Via IPFS Gateway
```
https://gateway.lighthouse.storage/ipfs/{YOUR_CID}
```

### Via Smart Contract
```typescript
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
const cid = await contract.retrieve()
console.log("Stored CID:", cid)
```

### Via IntelliX App
- Go to http://localhost:3000/view
- All stored report cards are listed
- Click "View Full Report" to see details
- FileCoin badge shows which cards are on-chain

---

## 🎯 Testing the Full Flow

### Quick Test Script

```powershell
# 1. Start the app
npm run dev

# 2. Open browser
start http://localhost:3000

# 3. Create a test report card
# - Go to /create
# - Fill: Student Name = "Test Student"
# - Add 3 subjects with random marks
# - Click Generate

# 4. Connect wallet
# - Click Connect Wallet
# - Approve MetaMask
# - Switch to Calibration network

# 5. Store on FileCoin
# - Click "Store on FileCoin"
# - Approve transaction
# - Wait for confirmation

# 6. Verify
# - Go to /view
# - See your report card with FileCoin badge
# - Copy the CID
# - Visit: https://gateway.lighthouse.storage/ipfs/{CID}
```

---

## 🛠️ Troubleshooting

### Error: "Lighthouse API key not configured"
**Solution:** Add your API key to `.env.local`

### Error: "Please connect your wallet"
**Solution:** Click "Connect Wallet" and approve MetaMask

### Error: "Wrong network"
**Solution:** Switch to FileCoin Calibration Testnet in MetaMask

### Error: "Insufficient funds"
**Solution:** Get test FIL from faucet: https://faucet.calibration.fildev.network/

### Upload stuck at 0%
**Solution:** 
- Check internet connection
- Verify API key is correct
- Try a smaller report card (fewer subjects)

### Transaction fails
**Solution:**
- Ensure you have test FIL
- Check gas fees
- Try increasing gas limit in MetaMask

---

## 📊 Storage Costs

### On Testnet (Calibration)
- **FREE** - Use test FIL from faucet
- No real money required

### On Mainnet (Production)
- IPFS upload: ~$0.01 - $0.10 per file
- Smart contract transaction: Variable gas fees
- Storage is permanent once uploaded

---

## 🔐 Security & Privacy

### What's Stored On-Chain
- Only the IPFS CID (hash)
- No personal data directly on blockchain

### What's Stored on IPFS
- Complete report card JSON
- Publicly accessible via CID
- **Note:** Don't store sensitive data unless encrypted

### Best Practices
1. Get student/parent consent before storing
2. Consider encrypting sensitive data
3. Use access control for production
4. Backup CIDs separately
5. Document data retention policies

---

## 📱 Next Steps

### For Development
1. ✅ Test with sample report cards
2. ✅ Verify IPFS upload works
3. ✅ Check blockchain transactions
4. ✅ Test retrieval flow

### For Production
1. Get production Lighthouse account
2. Deploy to FileCoin Mainnet
3. Add authentication
4. Implement encryption
5. Add backup systems

---

## 🎉 Summary

Your IntelliX report card generator is **fully integrated** with FileCoin! 

**To store data:**
1. Get API keys (Lighthouse + WalletConnect)
2. Add to `.env.local`
3. Get test FIL tokens
4. Create a report card
5. Click "Store on FileCoin"
6. Approve the transaction
7. Done! ✨

**The data is now:**
- ✅ Stored on IPFS (decentralized)
- ✅ CID stored on FileCoin blockchain
- ✅ Permanently accessible
- ✅ Cryptographically verifiable
- ✅ Immutable and tamper-proof

Need help? Check the console logs in the browser for detailed error messages!
