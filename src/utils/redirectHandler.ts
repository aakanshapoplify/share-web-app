export function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }
  
    if (/android/i.test(userAgent)) {
      return "Android";
    }
  
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return "iOS";
    }
  
    return "unknown";
  }
  
  export function redirectToAppOrStore(event:any) {
    event.preventDefault();
  
    const os = getMobileOperatingSystem();
    const appURL = (event.target as HTMLAnchorElement).href;
  
    window.location.assign(appURL);
    const now = Date.now();
  
    setTimeout(() => {
      if (Date.now() - now < 5000) {
        if (os === "Android") {
          window.location.href =
            "https://play.google.com/store/apps/details?id=com.thecliq.app";
        } else if (os === "iOS") {
          window.location.href =
            "https://apps.apple.com/gb/app/cliq-connect-meet-people/id6451363528";
        } else {
          window.location.href = "https://thecliq.app/";
        }
      }
    }, 3000);
  }
  
  export function downloadApp(event: any) {
    event.preventDefault();
    const os = getMobileOperatingSystem();
  
    if (os === "Android") {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.thecliq.app";
    } else if (os === "iOS") {
      window.location.href =
        "https://apps.apple.com/gb/app/cliq-connect-meet-people/id6451363528";
    } else {
      window.location.href = "https://thecliq.app/";
    }
  }
  