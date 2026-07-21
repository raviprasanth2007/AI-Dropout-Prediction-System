const { Client } = require('pg');

async function test(port) {
    const client = new Client({ connectionString: `postgresql://postgres.xnfnwajdnbiboudrwoxe:aidropoutsystemforcollege@aws-0-ap-northeast-2.pooler.supabase.com:${port}/postgres` });
    try {
        await client.connect();
        console.log(`Connected to port ${port}!`);
        await client.end();
    } catch (e) {
        console.error(`Port ${port} Error:`, e.message);
    }
}

test(5432).then(() => test(6543));
