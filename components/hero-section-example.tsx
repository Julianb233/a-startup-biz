'use client'

import HeroSection from './hero-section'

/**
 * Example usage of the HeroSection component for A Startup Biz
 *
 * This demonstrates how to integrate the hero section with:
 * - YouTube video embeds
 * - Vimeo video embeds
 * - Custom click handlers
 */

export default function HeroSectionExample() {
  // Example YouTube URL (replace with your actual video ID)
  const youtubeVideoUrl = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1'

  // Example Vimeo URL (replace with your actual video ID)
  // const vimeoVideoUrl = 'https://player.vimeo.com/video/YOUR_VIDEO_ID?autoplay=1'

  const handleGetStarted = () => {
    console.log('Get Started clicked')
    // Add your navigation logic here
    // Example: router.push('/get-started')
    // Or scroll to a form section
    // Or open a modal
  }

  const handleWatchVideo = () => {
    console.log('Watch Video clicked')
    // Additional tracking or analytics
    // Example: trackEvent('video_play', { location: 'hero' })
  }

  return (
    <HeroSection
      videoUrl={youtubeVideoUrl}
      onGetStartedClick={handleGetStarted}
      onWatchVideoClick={handleWatchVideo}
    />
  )
}

/**
 * Props Interface:
 *
 * videoUrl?: string - Optional YouTube or Vimeo embed URL
 *   - YouTube format: https://www.youtube.com/embed/VIDEO_ID?autoplay=1
 *   - Vimeo format: https://player.vimeo.com/video/VIDEO_ID?autoplay=1
 *
 * onGetStartedClick?: () => void - Optional callback for "Get Started" button
 * onWatchVideoClick?: () => void - Optional callback for "Watch Video" button
 *
 * Usage without video (shows placeholder only):
 * <HeroSection
 *   onGetStartedClick={handleGetStarted}
 * />
 *
 * Usage with YouTube:
 * <HeroSection
 *   videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
 *   onGetStartedClick={handleGetStarted}
 *   onWatchVideoClick={handleWatchVideo}
 * />
 *
 * Usage with Vimeo:
 * <HeroSection
 *   videoUrl="https://player.vimeo.com/video/76979871?autoplay=1"
 *   onGetStartedClick={handleGetStarted}
 *   onWatchVideoClick={handleWatchVideo}
 * />
 */
