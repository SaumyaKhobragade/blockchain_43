"use client"
import { useState } from "react"
import Link from "next/link"
import { ReportCardForm } from "@/components/ReportCardForm"
import { ReportCardDisplay } from "@/components/ReportCardDisplay"
import { WalletConnect } from "@/components/walletConnect"
import { ReportCard } from "@/types/reportCard"
import { useAccount, useChainId } from "wagmi"
import { ethers } from "ethers"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract"
import { useEthersSigner } from "@/hooks/useEthers"
import lighthouse from "@lighthouse-web3/sdk"
import styles from "./create.module.css"

export default function CreateReportCard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const signer = useEthersSigner()

  const [reportCard, setReportCard] = useState<ReportCard | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [storageStatus, setStorageStatus] = useState<"idle" | "uploading" | "storing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileCoinCid, setFileCoinCid] = useState<string | null>(null)

  const handleFormSubmit = async (data: ReportCard) => {
  // The ReportCardForm attaches the selected File to the onSubmit handler as (onSubmit as any).lastPhoto
  setReportCard(data)
    setStorageStatus("idle")
    setFileCoinCid(null)
  }

  const handleStoreOnFileCoin = async () => {
    if (!reportCard || !isConnected || !signer) {
      setErrorMessage("Please connect your wallet first")
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY
    if (!apiKey) {
      setErrorMessage("Lighthouse API key not configured")
      return
    }

    try {
      setIsSubmitting(true)
      setStorageStatus("uploading")
      setErrorMessage(null)
      setUploadProgress(0)

      // Prepare upload list: include JSON and optional photo (if present).
  // We expect the ReportCardForm to have attached the last selected photo file to the onSubmit handler (handleFormSubmit) as lastPhoto
  const photoFile: File | undefined = (handleFormSubmit as any).lastPhoto || undefined

      // Create JSON blob that includes a reference to the photo filename if provided
      const jsonPayload: any = { ...reportCard }
      if (photoFile) {
        jsonPayload.photoName = photoFile.name
      }

      const jsonBlob = new Blob([JSON.stringify(jsonPayload, null, 2)], {
        type: "application/json",
      })
      const jsonFile = new File([jsonBlob], `report-card-${reportCard.id}.json`, {
        type: "application/json",
      })

      const filesToUpload: File[] = [jsonFile]
      if (photoFile) filesToUpload.push(photoFile)

      // Upload to Lighthouse/IPFS
      const progressCallback = (progressData: any) => {
        try {
          const pct = ((progressData?.uploaded / progressData?.total) * 100) || 0
          setUploadProgress(Math.min(pct, 100))
        } catch {}
      }

      // Upload both files as a directory so both are pinned and we can reference them by filename
      const output = await lighthouse.upload(filesToUpload, apiKey, 1, progressCallback)
      const cid = output?.data?.Hash

      if (!cid) throw new Error("Upload failed: no CID returned")

      setUploadProgress(100)
      setStorageStatus("storing")

      // Store CID on FileCoin smart contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI as ethers.InterfaceAbi,
        signer
      )

      const tx = await contract.store(cid)
      await tx.wait()

      setFileCoinCid(cid)
  // If a photo was uploaded as part of the directory, determine photoCid (it will be the same root CID when uploading a directory; the file path will be `/${photoFile.name}` under that CID). We'll store photoName and photoCid for convenient display.
  const photoName = (ReportCardForm as any).lastPhoto ? (ReportCardForm as any).lastPhoto.name : undefined
  const photoCid = photoName ? cid : undefined

  setReportCard({ ...reportCard, cid, photoName, photoCid })
      setStorageStatus("success")

      // Save to localStorage as well
      const stored = localStorage.getItem("reportCards")
      const reportCards = stored ? JSON.parse(stored) : []
  reportCards.push({ ...reportCard, cid, photoName, photoCid })
      localStorage.setItem("reportCards", JSON.stringify(reportCards))

    } catch (e) {
      // Provide better diagnostics for auth failures from Lighthouse
      console.error("Lighthouse upload/store error:", e)
      const err = e as unknown as { reason?: string; shortMessage?: string; message?: string }
      let reason = err?.reason || err?.shortMessage || err?.message || "Storage failed"

      // Common API key/auth errors may return strings like 'Unauthorized' or 'Forbidden'
      if (typeof reason === 'string' && /unauthorized|forbidden|401|403/i.test(reason)) {
        reason = "Authentication failed when uploading to Lighthouse. Check NEXT_PUBLIC_LIGHTHOUSE_API_KEY in .env.local and ensure it is valid."
      }

      setErrorMessage(reason)
      setStorageStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (!reportCard) return
    window.print()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Home
          </Link>
          <h1 className={styles.title}>Create Report Card</h1>
          <div className={styles.walletSection}>
            <WalletConnect />
          </div>
        </div>
      </div>

      <div className={styles.main}>
        {!reportCard ? (
          <div className={styles.formSection}>
            <ReportCardForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <h2>Preview & Store on FileCoin</h2>
              <button
                onClick={() => setReportCard(null)}
                className={styles.editBtn}
              >
                <i className="fa-solid fa-edit"></i>
                Edit Details
              </button>
            </div>

            <ReportCardDisplay reportCard={reportCard} onDownload={handleDownload} />

            {storageStatus !== "success" && (
              <div className={styles.storageSection}>
                <h3>Store on FileCoin Network</h3>
                <p className={styles.storageDesc}>
                  Permanently store this report card on the decentralized FileCoin network. 
                  This ensures data integrity and immutability.
                </p>

                {!isConnected ? (
                  <div className={styles.connectPrompt}>
                    <p>Please connect your wallet to store on FileCoin</p>
                    <WalletConnect />
                  </div>
                ) : (
                  <>
                    {storageStatus === "uploading" && (
                      <div className={styles.progress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          Uploading to IPFS: {uploadProgress.toFixed(0)}%
                        </span>
                      </div>
                    )}

                    {storageStatus === "storing" && (
                      <div className={styles.progress}>
                        <div className={styles.spinner}></div>
                        <span className={styles.progressText}>
                          Storing CID on FileCoin contract...
                        </span>
                      </div>
                    )}

                    {errorMessage && (
                      <div className={styles.error}>
                        <i className="fa-solid fa-exclamation-circle"></i>
                        {errorMessage}
                      </div>
                    )}

                    <button
                      onClick={handleStoreOnFileCoin}
                      disabled={isSubmitting || storageStatus === "uploading" || storageStatus === "storing"}
                      className={styles.storeBtn}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-upload"></i>
                          Store on FileCoin
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {storageStatus === "success" && fileCoinCid && (
              <div className={styles.successSection}>
                <div className={styles.successIcon}>
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <h3>Successfully Stored on FileCoin!</h3>
                <p>Your report card has been permanently stored on the decentralized network.</p>
                <div className={styles.cidDisplay}>
                  <span className={styles.cidLabel}>FileCoin CID:</span>
                  <code className={styles.cidValue}>{fileCoinCid}</code>
                </div>
                <div className={styles.successActions}>
                  <Link href="/view" className={styles.viewAllBtn}>
                    <i className="fa-solid fa-list"></i>
                    View All Report Cards
                  </Link>
                  <button onClick={() => setReportCard(null)} className={styles.createNewBtn}>
                    <i className="fa-solid fa-plus"></i>
                    Create Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
