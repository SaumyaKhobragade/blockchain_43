# 📖 IntelliX FileCoin Storage - Summary

## TL;DR - How to Store Data

**3-Step Process:**
1. **Get API Key** → https://files.lighthouse.storage/ (free, 2 min)
2. **Add to `.env.local`** → Save your Lighthouse API key
3. **Use the UI** → Create report card → Click "Store on FileCoin" ✨

---

## 🎯 What You Need

### Required (Get These First):
1. **Lighthouse API Key**
   - Website: https://files.lighthouse.storage/
   - Cost: FREE
   - Time: 2 minutes to sign up

2. **WalletConnect Project ID**
   - Website: https://cloud.walletconnect.com/
   - Cost: FREE
   - Time: 2 minutes

3. **Test FIL Tokens**
   - Faucet: https://faucet.calibration.fildev.network/
   - Cost: FREE (testnet)
   - Time: 1-2 minutes to receive

### Already Installed in Your Project:
- ✅ Lighthouse SDK (`@lighthouse-web3/sdk`)
- ✅ Ethers.js (`ethers`)
- ✅ Wagmi (`wagmi`)
- ✅ RainbowKit (`@rainbow-me/rainbowkit`)
- ✅ Smart contract integration

---

## 🔄 The Storage Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CREATES REPORT CARD                  │
│  (Fill form → Student info, Subjects, Marks, Teacher)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CLICK "STORE ON FILECOIN" BUTTON                │
│                   (Connect wallet first)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   1. CONVERT TO JSON                         │
│  Report card data → JSON blob → File object                 │
│  Example: report-card-123456.json                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              2. UPLOAD TO IPFS (via Lighthouse)              │
│  ┌───────────────────────────────────────────────┐          │
│  │  lighthouse.upload(file, apiKey)              │          │
│  │  → Progress: 0% ... 50% ... 100%              │          │
│  │  → Returns: CID (Content ID)                   │          │
│  │  → Example: QmXxXxXxXxXxXxXxXxXxXxXxXxX...     │          │
│  └───────────────────────────────────────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         3. STORE CID ON FILECOIN BLOCKCHAIN                  │
│  ┌───────────────────────────────────────────────┐          │
│  │  contract.store(cid)                           │          │
│  │  → MetaMask popup (approve transaction)        │          │
│  │  → Transaction submitted                       │          │
│  │  → Waiting for confirmation...                 │          │
│  │  → ✓ Confirmed!                                │          │
│  └───────────────────────────────────────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  4. SAVE LOCALLY (BACKUP)                    │
│  localStorage.setItem('reportCards', [...cards, newCard])   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      ✨ SUCCESS! ✨                          │
│  ┌───────────────────────────────────────────────┐          │
│  │  ✓ Data on IPFS (permanent)                   │          │
│  │  ✓ CID on blockchain (immutable)              │          │
│  │  ✓ Accessible forever                          │          │
│  │  ✓ Can be retrieved by anyone with CID        │          │
│  └───────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Where is Data Stored?

### 1. **IPFS (via Lighthouse)**
- **What:** Complete report card JSON file
- **Where:** Distributed across IPFS network
- **URL:** `https://gateway.lighthouse.storage/ipfs/{CID}`
- **Access:** Public (anyone with CID can read)
- **Permanent:** Yes (as long as pinned)

### 2. **FileCoin Blockchain**
- **What:** Just the CID (hash reference)
- **Where:** Smart contract at `0xc50dd...e34A9c`
- **Network:** FileCoin Calibration Testnet
- **Access:** Public (on-chain)
- **Permanent:** Yes (blockchain is immutable)

### 3. **Browser LocalStorage**
- **What:** Full report card data + CID
- **Where:** User's browser
- **Access:** Private (only this browser)
- **Permanent:** Until browser cache cleared

---

## 💻 Code Reference

### The Main Storage Function (`app/create/page.tsx`)

```typescript
const handleStoreOnFileCoin = async () => {
  // Step 1: Prepare data
  const jsonBlob = new Blob([JSON.stringify(reportCard, null, 2)], {
    type: "application/json",
  })
  const file = new File([jsonBlob], `report-card-${reportCard.id}.json`, {
    type: "application/json",
  })

  // Step 2: Upload to IPFS via Lighthouse
  const progressCallback = (progressData: any) => {
    const pct = ((progressData?.uploaded / progressData?.total) * 100) || 0
    setUploadProgress(Math.min(pct, 100))
  }

  const output = await lighthouse.upload([file], apiKey, false, progressCallback)
  const cid = output?.data?.Hash // This is your IPFS CID!

  // Step 3: Store CID on FileCoin blockchain
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  )
  
  const tx = await contract.store(cid) // Submit transaction
  await tx.wait() // Wait for confirmation

  // Step 4: Update local state
  setFileCoinCid(cid)
  setReportCard({ ...reportCard, cid })
  
  // Step 5: Save to localStorage (backup)
  const stored = localStorage.getItem("reportCards")
  const reportCards = stored ? JSON.parse(stored) : []
  reportCards.push({ ...reportCard, cid })
  localStorage.setItem("reportCards", JSON.stringify(reportCards))
}
```

---

## 🎮 Try It Now!

### Option 1: Create Test Report Card

```powershell
# Start the app
npm run dev

# Then:
# 1. Go to http://localhost:3000
# 2. Click "Create Report Card"
# 3. Fill in:
#    - Name: "Test Student"
#    - ID: "TEST-001"
#    - Class: "10th"
#    - Add 3 subjects with marks
# 4. Click "Generate Report Card"
# 5. Click "Connect Wallet" (MetaMask)
# 6. Click "Store on FileCoin"
# 7. Approve transaction
# 8. Wait for success!
```

### Option 2: Test Existing Storage Page

```powershell
# The original demo is still available!
# Go to: http://localhost:3000/store

# This page lets you:
# - Upload any file to IPFS
# - Store its CID on FileCoin
# - Retrieve and view stored files
```

---

## 📊 What Gets Stored (Example)

### On IPFS (Full JSON):
```json
{
  "id": "RC-1729012345-abc123",
  "studentName": "John Doe",
  "studentId": "ST-2024-001",
  "class": "10th",
  "section": "A",
  "academicYear": "2024-2025",
  "term": "First Term",
  "subjects": [
    {
      "name": "Mathematics",
      "marks": 85,
      "maxMarks": 100,
      "grade": "A"
    },
    {
      "name": "Science",
      "marks": 92,
      "maxMarks": 100,
      "grade": "A+"
    },
    {
      "name": "English",
      "marks": 78,
      "maxMarks": 100,
      "grade": "B+"
    }
  ],
  "totalMarks": 255,
  "maxTotalMarks": 300,
  "percentage": 85.0,
  "overallGrade": "A",
  "remarks": "Excellent performance throughout the term!",
  "teacherName": "Ms. Sarah Johnson",
  "dateIssued": "2025-10-15T12:34:56.789Z",
  "cid": "QmXxXxXxXxXxXxXxXxXxXxXxX..." // Added after storage
}
```

### On Blockchain (Just the CID):
```solidity
contract.CID = "QmXxXxXxXxXxXxXxXxXxXxXxX..."
```

---

## 🔍 How to Retrieve Data

### Method 1: Via IntelliX App
```
Visit: http://localhost:3000/view
→ Browse all report cards
→ Click "View Full Report"
```

### Method 2: Via IPFS Gateway
```
Visit: https://gateway.lighthouse.storage/ipfs/{YOUR_CID}
→ See raw JSON data
```

### Method 3: Via Smart Contract
```typescript
const contract = new ethers.Contract(ADDRESS, ABI, provider)
const cid = await contract.retrieve()
console.log("Stored CID:", cid)
```

### Method 4: Via Code
```typescript
// Get from localStorage
const cards = JSON.parse(localStorage.getItem('reportCards'))
console.log(cards)
```

---

## 💡 Key Points

1. **Data is Permanent** 
   - Once on IPFS, it's there forever (as long as pinned)
   - Blockchain CID storage is immutable

2. **Data is Public**
   - Anyone with CID can access the data
   - Don't store sensitive info without encryption

3. **Cost on Testnet**
   - FREE with test tokens
   - Get tokens from faucet

4. **Cost on Mainnet**
   - Small fee for IPFS upload (~$0.01-$0.10)
   - Gas fees for blockchain transaction

5. **Already Implemented**
   - Everything is ready to use!
   - Just need API keys + test tokens

---

## 📚 Documentation Files

1. **`FILECOIN_STORAGE_GUIDE.md`** → Complete technical guide
2. **`QUICKSTART_CHECKLIST.md`** → Step-by-step checklist
3. **`REPORT_CARD_README.md`** → Full project documentation
4. **`SETUP_GUIDE.md`** → Setup instructions
5. **This file** → Quick summary & reference

---

## 🎉 You're Ready!

Your IntelliX application has **full FileCoin storage integration**. 

**To start storing:**
1. Get Lighthouse API key → Add to `.env.local`
2. Get test FIL → Connect wallet
3. Create report card → Store on FileCoin
4. Done! ✨

**Questions?** Check the detailed guides or review the code in:
- `app/create/page.tsx` (main storage logic)
- `lib/contract.ts` (smart contract config)
- `app/store/page.tsx` (original demo)

**Happy storing! 🚀**
