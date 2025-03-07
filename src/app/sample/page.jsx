import React from 'react';

async function getDataas() {
    // Simulating a data fetch (API call or database query)
    const data = { message: "Hello from server component!", timestamp: new Date().toISOString() };
    return   <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default async function Page() {
    const data = await getDataas();

    return (
        <div>
            <h1>Server Component Examples</h1>
            <p>Data fetched from server:</p>
            {getDataas()}
        </div>
    );
}
