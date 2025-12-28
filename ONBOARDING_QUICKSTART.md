# Client Onboarding System - Quick Start Guide

## 🚀 Getting Started

### Access the Intake Form
Visit: `http://localhost:3000/onboarding/intake`

### Test Flow
1. Fill out Step 1: Business Information
2. Progress to Step 2: Goals & Challenges
3. Continue through all 5 steps
4. Submit the form
5. View confirmation page with next steps

## 📋 Sample Test Data

### Step 1: Business Information
- **Company Name:** Test Adventure Co
- **Industry:** Adventure & Outdoor Recreation
- **Company Size:** 6-10 employees
- **Revenue Range:** $500k - $1M
- **Years in Business:** 3
- **Website:** https://testadventure.com

### Step 2: Goals & Challenges
- **Business Goals:** (Select 3-5)
  - ✅ Increase online visibility
  - ✅ Generate more leads
  - ✅ Automate business processes
  - ✅ Enhance customer experience
  - ✅ Build brand awareness

- **Primary Challenge:**
  "We struggle with managing customer bookings and coordinating multiple tour guides. Our current system is manual and error-prone. We need automation to scale our operations and improve customer experience."

- **Timeline:** Short-term (1-3 months)

### Step 3: Current Situation
- **Current Tools:** (Select all that apply)
  - ✅ Email Marketing
  - ✅ Booking & Scheduling
  - ✅ Social Media Management
  - ✅ Website Builder

- **Team Size:** 8
- **Budget Range:** $10,000 - $25,000
- **Additional Context:**
  "We're looking for an integrated solution that can handle bookings, payments, and customer communications in one platform."

### Step 4: Service Preferences
- **Services Interested:**
  - ✅ AI Automation & Integration
  - ✅ Web Design & Development
  - ✅ CRM Implementation
  - ✅ Marketing & SEO

- **Priority Level:** High - Important
- **Specific Needs:**
  "We need integration with our existing payment processor (Stripe) and automated email confirmations for bookings."

### Step 5: Contact Preferences
- **Contact Name:** John Smith
- **Email:** john.smith@testadventure.com
- **Phone:** (555) 123-4567
- **Best Time to Call:** Morning (8am-12pm)
- **Timezone:** Pacific (PT)
- **Communication Preference:** Email
- **Additional Notes:**
  "I'm available for calls on Tuesday and Thursday mornings. Looking forward to discussing how we can work together!"

## ✨ Features to Test

### 1. Auto-Save Functionality
- Fill out Step 1
- Refresh the page
- Form should restore your data
- Data persists for 24 hours

### 2. Form Validation
- Try to proceed without filling required fields
- Should see error messages
- Cannot advance until fields are complete

### 3. Multi-Select Limits
- Business Goals: Max 5 selections
- Try selecting more - should be disabled

### 4. Character Limits
- Primary Challenge: 1000 characters max
- Counter shows remaining characters

### 5. Progress Tracking
- Progress bar updates as you advance
- Step indicators show completed steps
- Can click previous steps to go back

### 6. Animations
- Smooth transitions between steps
- Progress bar animates
- Icons and buttons have hover effects

### 7. Mobile Responsive
- Test on different screen sizes
- Forms adapt to mobile layout
- Touch-friendly interface

## 🧪 Testing Scenarios

### Happy Path
1. Complete all steps with valid data
2. Submit form
3. Redirect to confirmation page
4. See success message and submission ID

### Error Handling
1. Leave required fields empty
2. Try to proceed
3. See validation errors
4. Fill in missing data
5. Continue successfully

### Session Recovery
1. Fill out Steps 1-3
2. Close browser
3. Reopen within 24 hours
4. Navigate to `/onboarding/intake`
5. Data should be restored

### Navigation
1. Complete Step 1
2. Go to Step 2
3. Click back to Step 1
4. Verify data is preserved
5. Navigate forward again

## 📊 Expected API Response

When form is submitted successfully:

```json
{
  "success": true,
  "message": "Onboarding data submitted successfully",
  "submissionId": "ONB-1735286400000-ABCD1234",
  "data": {
    "companyName": "Test Adventure Co",
    "contactName": "John Smith",
    "contactEmail": "john.smith@testadventure.com",
    "servicesInterested": [
      "AI Automation & Integration",
      "Web Design & Development",
      "CRM Implementation",
      "Marketing & SEO"
    ],
    "priorityLevel": "High - Important",
    "timeline": "Short-term (1-3 months)"
  }
}
```

## 🔍 Checking Submitted Data

### In Browser Console
```javascript
// Check localStorage for saved progress
JSON.parse(localStorage.getItem('onboarding-progress'))

// Check timestamp
localStorage.getItem('onboarding-timestamp')
```

### In API Route (Development)
Check the console where your Next.js dev server is running. You should see:

```
Onboarding data received: {
  companyName: 'Test Adventure Co',
  contactEmail: 'john.smith@testadventure.com',
  services: [...],
  priority: 'High - Important'
}
```

## 🎨 UI Components to Test

### Progress Bar
- Fills as you progress
- Shows percentage completion
- Smooth animation

### Step Indicators
- Numbered circles for each step
- Active step highlighted in orange
- Completed steps show checkmark
- Can click previous steps

### Form Fields
- Text inputs with focus states
- Radio buttons with orange selection
- Checkboxes with orange selection
- Textareas with character counters

### Buttons
- Back button (disabled on Step 1)
- Next button (orange gradient)
- Submit button on final step
- Loading state during submission

### Confirmation Page
- Success animation
- Timeline of next steps
- Call-to-action cards
- Additional resources

## 🐛 Troubleshooting

### Data Not Saving
1. Check browser localStorage is enabled
2. Clear localStorage: `localStorage.clear()`
3. Try again

### Form Won't Submit
1. Check all required fields are filled
2. Open browser console for errors
3. Verify API endpoint is running

### Validation Errors
1. Ensure fields match required formats
2. Email must be valid format
3. Phone must be at least 10 characters
4. Check character limits

### Animations Not Working
1. Ensure Framer Motion is installed
2. Check browser supports animations
3. Disable reduced motion in OS settings

## 📱 Mobile Testing

### iOS Safari
- Test on iPhone 12+
- Verify touch targets are large enough
- Check input focus behavior
- Test keyboard navigation

### Android Chrome
- Test on modern Android device
- Verify form fields work correctly
- Check button interactions
- Test back button behavior

## ⚡ Performance Checks

### Load Time
- Initial page load < 2 seconds
- Step transitions < 300ms
- Form submission < 2 seconds

### Bundle Size
- Check with Next.js build output
- Verify code splitting
- Check lazy loading

## 🎯 Accessibility Testing

### Keyboard Navigation
- Tab through all form fields
- Enter to submit
- Escape to clear focus

### Screen Reader
- Test with NVDA/JAWS/VoiceOver
- Verify labels are read correctly
- Check ARIA attributes

### Color Contrast
- Orange (#ff6a1a) on white passes WCAG AA
- Error messages in red are readable
- Focus indicators are visible

## 📈 Analytics Events to Track

In production, you might want to track:
- Form started
- Each step completed
- Form abandoned (which step)
- Form submitted
- Time to complete
- Error rate per field

## 🚀 Next Steps After Testing

1. **Database Integration**
   - Set up PostgreSQL/MongoDB
   - Create submissions table
   - Save form data

2. **Email Notifications**
   - Configure email service (SendGrid/Resend)
   - Send confirmation emails
   - Notify team of new submissions

3. **CRM Integration**
   - Connect to HubSpot/Salesforce
   - Auto-create leads
   - Sync contact information

4. **Admin Dashboard**
   - View all submissions
   - Filter and search
   - Export data

5. **Calendar Integration**
   - Auto-schedule discovery calls
   - Send calendar invites
   - Sync with team calendars

---

**Happy Testing! 🎉**

For questions or issues, refer to `ONBOARDING_SYSTEM.md` for detailed documentation.
