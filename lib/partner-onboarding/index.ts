// Partner Onboarding System - Main Exports

// Types
export * from './types'

// Services
export {
  approvePartner,
  canApprovePartner,
  getOnboardingStatus,
  updateOnboardingStep,
  getPendingPartners,
  resendWelcomeEmail,
} from './approval-service'

export {
  createMicrosite,
  getMicrositeBySlug,
  getMicrositeByPartnerId,
  updateMicrosite,
  updateMicrositeWithScrapedData,
  incrementPageViews,
  getMicrositeUrl,
  generateSlug,
  generateUniqueSlug,
  isSlugAvailable,
} from './microsite-generator'

export {
  getActiveAgreements,
  getRequiredAgreements,
  getAgreementsWithStatus,
  getAgreementById,
  acceptAgreement,
  hasSignedAllRequiredAgreements,
  getSigningProgress,
  getPartnerAcceptances,
  isAgreementSigned,
} from './agreement-service'

export {
  scrapeWebsite,
  extractLogo,
  extractImages,
  validateUrl,
} from './scraper-service'
