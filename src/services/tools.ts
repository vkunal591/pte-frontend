 
 
 export const checkMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Mic permission granted");
    } catch (err) {
      alert("Microphone permission denied or unavailable");
    }
  };