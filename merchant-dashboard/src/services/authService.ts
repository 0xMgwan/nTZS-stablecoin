// This is a mock authentication service for demo purposes
// In a real application, this would connect to your backend API

interface LoginResponse {
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      organization: string;
    }
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login for demo
        if (email === 'merchant@nedapay.com' && password === 'password') {
          resolve({
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJtZXJjaGFudEBuZWRhcGF5LmNvbSIsIm5hbWUiOiJNZXJjaGFudCIsInJvbGUiOiJNZXJjaGFudCIsIm9yZ2FuaXphdGlvbiI6Ik5FREEgUGF5IiwiZXhwIjoxNzE3MjUyNDkxfQ.mock-token-signature',
              user: {
                id: '1',
                name: 'Merchant',
                email: 'merchant@nedapay.com',
                role: 'Merchant',
                organization: 'NEDA Pay'
              }
            }
          });
        } else if (email === 'bank@bot.go.tz' && password === 'password') {
          resolve({
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzQ1Njc4OTAxIiwiZW1haWwiOiJiYW5rQGJvdC5nby50eiIsIm5hbWUiOiJCYW5rIG9mIFRhbnphbmlhIiwicm9sZSI6IkJhbmtpbmcgUGFydG5lciIsIm9yZ2FuaXphdGlvbiI6IkJhbmsgb2YgVGFuemFuaWEiLCJleHAiOjE3MTcyNTI0OTF9.mock-token-signature',
              user: {
                id: '2',
                name: 'Bank of Tanzania',
                email: 'bank@bot.go.tz',
                role: 'Banking Partner',
                organization: 'Bank of Tanzania'
              }
            }
          });
        } else {
          reject({ response: { data: { message: 'Invalid credentials' } } });
        }
      }, 1000);
    });
  }
};
