# How I Built a Lightweight Twitch & Kick Chrome Extension Without Slowing Down the Browser

*Cet article est optimisé pour être publié sur Dev.to ou Hashnode.*

---

As a developer and an avid Twitch viewer, I constantly found myself missing out on Channel Points and Drops because I was working in another tab. There are several extensions out there, but many inject heavy JavaScript into the Twitch page, modify the DOM extensively for chat emotes (like BTTV), or drain memory. 

I wanted something purely focused on **automating the viewer experience** across both Twitch and Kick, without the bloat. 

That’s how **StreamPulse — Twitch & Kick Chrome Extension** was born. 

Here’s a deep dive into how I built it to be lightweight, efficient, and private.

## The Problem with Heavy Injections
Most Twitch extensions inject large bundles into the browser to manipulate the DOM, intercept WebSockets, or modify video elements. While necessary for adding custom emotes, this approach is overkill if you just want to claim rewards or get notifications. It leads to:
- Higher memory footprint
- Slower page load times (LCP/INP degradation)
- Constant breakages when Twitch updates its UI

## The Solution: A Targeted Approach

For **StreamPulse**, I opted for a combination of Manifest V3 background Service Workers and hyper-targeted MutationObservers.

### 1. Auto-Claiming Channel Points (The Smart Way)
Instead of polling the DOM every second with `setInterval` (which wastes CPU cycles), StreamPulse uses a debounced `MutationObserver` that only watches the specific container where the "Claim Bonus" chest appears. 

```javascript
// A simplified version of our observer
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      const claimButton = document.querySelector('.claimable-bonus-reward-icon');
      if (claimButton) {
        claimButton.click();
        console.log('[StreamPulse] Points claimed!');
      }
    }
  }
});

// Observing only the specific chat node, not the whole body
observer.observe(document.querySelector('.chat-room'), { childList: true, subtree: true });
```
This ensures the script idles at 0% CPU until the exact moment a point chest spawns.

### 2. Multi-Platform Live Notifications (Twitch & Kick)
With Manifest V3, background pages are replaced by Service Workers, meaning they go to sleep when inactive. To handle real-time notifications for both Twitch and Kick without keeping the worker awake 24/7, we use the `chrome.alarms` API to schedule periodic lightweight fetch requests to the public APIs.

Since we don't require users to log in, we only send the list of followed usernames stored locally in `chrome.storage.local`.

### 3. Fixing Twitch Error #2000 & #3000
Nothing is more annoying than leaving a stream on in the background, only to come back to a `#2000` network error. StreamPulse detects the error overlay and forces a graceful reload of the video player without refreshing the entire tab.

## Privacy by Design
One of my core principles was to build a tool that didn't need an account or external servers. 
- No tracking pixels.
- No remote analytics.
- Your followed list and settings never leave your browser.

## Conclusion
Building a Chrome extension in 2026 using Manifest V3 requires rethinking how background processes and DOM manipulation work. By prioritizing performance and leveraging native browser APIs efficiently, **StreamPulse** manages to automate the Twitch and Kick viewing experience while keeping a minimal memory footprint.

You can check out the extension for yourself on the [Chrome Web Store](https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh).

If you’re building extensions and have questions about migrating to Manifest V3 or optimizing DOM observers, drop a comment below! 

---
*Tags: #javascript #chromeextension #twitch #webdev*
