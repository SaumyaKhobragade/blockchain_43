# ✅ Quick Start Checklist - Store Data on FileCoin

## Before You Start

- [ ] Node.js is running (`npm run dev`)
- [ ] MetaMask wallet is installed
- [ ] You have an internet connection

---

## 🔑 Get Your API Keys (5 minutes)

### 1. Lighthouse API Key
- [ ] Go to https://files.lighthouse.storage/
- [ ] Sign up (free)
- [ ] Create API key
- [ ] Copy the key

### 2. WalletConnect Project ID  
- [ ] Go to https://cloud.walletconnect.com/
- [ ] Sign in
- [ ] Create new project
- [ ] Copy Project ID

### 3. Add to `.env.local`
```env
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=paste_lighthouse_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=paste_walletconnect_id_here
```

---

## 💰 Get Test Tokens (2 minutes)

- [ ] Open MetaMask
- [ ] Copy your wallet address
- [ ] Go to https://faucet.calibration.fildev.network/
- [ ] Paste address and request tokens
- [ ] Wait for tokens (~1-2 min)

---

## 🚀 Create & Store Your First Report Card

### Step 1: Start App
```powershell
cd d:\blockchain_43
npm run dev
```
- [ ] Server started successfully
- [ ] Open http://localhost:3000

### Step 2: Create Report Card
- [ ] Click "Create Report Card" on home page
- [ ] Fill in student info:
  - [ ] Student Name
  - [ ] Student ID  
  - [ ] Class
  - [ ] Section
  - [ ] Academic Year
  - [ ] Term
- [ ] Add subjects (at least 3):
  - [ ] Subject name
  - [ ] Marks
  - [ ] Max marks (auto-calculates grade)
- [ ] Add teacher name
- [ ] Add remarks
- [ ] Click "Generate Report Card"

### Step 3: Preview
- [ ] Review the generated report card
- [ ] Check all details are correct
- [ ] Ready to store? Continue below

### Step 4: Connect Wallet
- [ ] Click "Connect Wallet"
- [ ] Select MetaMask
- [ ] Approve connection
- [ ] Switch to FileCoin Calibration if prompted
- [ ] Wallet shows "Connected"

### Step 5: Store on FileCoin
- [ ] Click "Store on FileCoin" button
- [ ] Watch upload progress (0-100%)
- [ ] Approve transaction in MetaMask
- [ ] Wait for blockchain confirmation
- [ ] See "Success" message with CID

### Step 6: Verify Storage
- [ ] Copy the displayed CID
- [ ] Click "View All Report Cards"
- [ ] Find your report card in the list
- [ ] Look for "Stored on FileCoin" badge
- [ ] Test: Visit `https://gateway.lighthouse.storage/ipfs/{YOUR_CID}`

---

## ✨ You're Done!

Your report card is now:
- ✅ Stored on IPFS (decentralized storage)
- ✅ CID saved on FileCoin blockchain  
- ✅ Permanently accessible
- ✅ Cryptographically secure
- ✅ Immutable

---

## 🔍 Quick Verification

**Check in Browser Console:**
```javascript
// Open DevTools (F12) and run:
const cards = JSON.parse(localStorage.getItem('reportCards'))
console.log('Stored report cards:', cards)
console.log('Latest CID:', cards[cards.length - 1].cid)
```

**Check on IPFS:**
- Visit: `https://gateway.lighthouse.storage/ipfs/{YOUR_CID}`
- You should see your report card JSON

**Check Transaction:**
- Open MetaMask
- Go to Activity
- See "Contract Interaction" transaction
- Status should be "Confirmed"

---

## 🎯 What to Do Next

### Create More Report Cards
- [ ] Go to /create again
- [ ] Try different students
- [ ] Test different grade ranges
- [ ] Build a collection

### Explore the App
- [ ] Browse all cards at /view
- [ ] Use search to find students
- [ ] Filter by class
- [ ] Download as PDF (print)

### Share Your Work
- [ ] Share the CID with others
- [ ] They can view the data at the IPFS gateway
- [ ] Demonstrate immutable storage
- [ ] Show blockchain verification

---

## 🆘 Having Issues?

### If upload fails:
1. Check `.env.local` has correct API key
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Try again

### If wallet won't connect:
1. Check MetaMask is unlocked
2. Refresh the page
3. Clear site data in MetaMask
4. Try connecting again

### If transaction fails:
1. Check you have test FIL
2. Check you're on Calibration network
3. Increase gas limit in MetaMask
4. Try again

### Still stuck?
- Check browser console (F12) for errors
- Check terminal for server errors
- Review `FILECOIN_STORAGE_GUIDE.md` for details
- Check MetaMask network settings

---

## 📚 Documentation

- **Full Guide:** `FILECOIN_STORAGE_GUIDE.md`
- **Project README:** `REPORT_CARD_README.md`
- **Setup Instructions:** `SETUP_GUIDE.md`

---

## 🎉 Success Criteria

You'll know it worked when:
- ✅ You see a success message with CID
- ✅ Report card appears in /view with FileCoin badge
- ✅ You can open the CID at lighthouse gateway
- ✅ MetaMask shows confirmed transaction
- ✅ LocalStorage has the report card saved

**Congratulations! You're now storing academic records on FileCoin! 🚀**
