async function testAPI() {
  try {
    console.log('Testing AI LegalGPT API...\n');
    
    const payload = {
      userId: "test-user",
      caseType: "FIR",
      location: "Delhi",
      description: "I was wrongly arrested by police",
      language: "en"
    };
    
    console.log('Sending request to: http://localhost:5000/api/legal/query');
    console.log('Request body:', JSON.stringify(payload, null, 2));
    console.log('\nWaiting for response...\n');
    
    const response = await fetch('http://localhost:5000/api/legal/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! API is working.\n');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API Error:\n');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend is running: npm run dev (in backend folder)');
    console.error('2. MongoDB is running');
    console.error('3. Gemini API key is configured in backend/.env');
  }
}

testAPI();
