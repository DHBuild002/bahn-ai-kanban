// Waitlist service without direct Firebase client usage
export interface WaitlistEntry {
  email: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'notified';
}

export const addToWaitlist = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('📧 Attempting to add email to waitlist:', email.toLowerCase());
    
    // Call Netlify function instead of direct Firebase
    const response = await fetch('/.netlify/functions/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });

    let result;
    try {
      result = await response.json();
      console.log('📊 Full response:', result);
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError);
      console.error('❌ Raw response text:', await response.text().catch(() => 'Could not read response text'));
      return {
        success: false,
        message: "Server response error. Please try again later."
      };
    }

    if (!response.ok) {
      console.warn('⚠️ Waitlist function error:', response.status, result?.message || 'Unknown error');
      return {
        success: false,
        message: result?.message || "Unable to join waitlist right now. Please try again later."
      };
    }

    console.log('✅ Email successfully added to waitlist!');
    return {
      success: true,
      message: result?.message || "Successfully added to waitlist!"
    };
  } catch (error) {
    console.error("❌ Waitlist function error:", error);
    console.error("❌ Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return {
      success: false,
      message: "Network error. Please check your internet connection and try again."
    };
  }
};