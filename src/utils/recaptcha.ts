// Utility function to load the reCAPTCHA script
let recaptchaScriptLoaded = false;
let recaptchaPromise: Promise<boolean> | null = null;

export function loadRecaptchaScript(siteKey: string): Promise<boolean> {
  if (recaptchaPromise) return recaptchaPromise;
  
  recaptchaPromise = new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (recaptchaScriptLoaded || typeof window === 'undefined') {
      resolve(true);
      return;
    }

    // Check if script is already in the DOM
    if (document.querySelector('script#google-recaptcha')) {
      recaptchaScriptLoaded = true;
      resolve(true);
      return;
    }

    // Create and add the script
    const script = document.createElement('script');
    script.id = 'google-recaptcha';
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      recaptchaScriptLoaded = true;
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
  
  return recaptchaPromise;
}

// Execute reCAPTCHA and get a token
export async function executeRecaptcha(siteKey: string, action: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    console.log('Window is undefined (likely server-side rendering)');
    return null;
  }
  
  try {
    const loaded = await loadRecaptchaScript(siteKey);
    if (!loaded) {
      console.warn('Failed to load reCAPTCHA script');
      return null;
    }
    
    // Wait for grecaptcha to be fully loaded
    if (!window.grecaptcha || !window.grecaptcha.execute) {
      return new Promise((resolve) => {
        let attempts = 0;
        const checkRecaptcha = () => {
          attempts++;
          if (window.grecaptcha && window.grecaptcha.execute) {
            window.grecaptcha.ready(() => {
              try {
                window.grecaptcha.execute(siteKey, { action })
                  .then(resolve)
                  .catch(() => resolve(null));
              } catch (err) {
                console.error('Error during reCAPTCHA execution:', err);
                resolve(null);
              }
            });
          } else if (attempts < 10) {
            setTimeout(checkRecaptcha, 500);
          } else {
            console.warn('reCAPTCHA failed to initialize after multiple attempts');
            resolve(null);
          }
        };
        checkRecaptcha();
      });
    }
    
    // Use ready() to ensure grecaptcha is fully initialized
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (error) {
          console.error('Error executing reCAPTCHA:', error);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error in reCAPTCHA execution:', error);
    return null;
  }
}

// Add type definitions for global window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
} 