
import axios from 'axios';

async function testBackend() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', response.data);
  } catch (error) {
    console.log('❌ Backend is not running:', error.message);
    console.log('💡 Make sure to run: cd backend && npm run dev');
  }
}

testBackend();
