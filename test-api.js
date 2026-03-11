const fetch = require('node-fetch');

async function testApi() {
    try {
        const res = await fetch('http://localhost:5000/api/public/projects?featured=true');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
