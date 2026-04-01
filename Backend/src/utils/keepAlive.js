/**
 * Self-ping keep-alive for free hosting (Render, Railway, etc.)
 * Pings the server's own health endpoint every 14 minutes
 * to prevent the instance from sleeping due to inactivity.
 */

const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

const startKeepAlive = (serverUrl) => {
    if (!serverUrl) {
        console.log("[keep-alive] No SERVER_URL set, skipping self-ping");
        return;
    }

    const pingUrl = `${serverUrl}/api/health`;

    setInterval(async () => {
        try {
            const res = await fetch(pingUrl);
            const data = await res.json();
            console.log(`[keep-alive] Ping OK → ${data.status} (${new Date().toLocaleTimeString()})`);
        } catch (err) {
            console.error(`[keep-alive] Ping failed:`, err.message);
        }
    }, INTERVAL_MS);

    console.log(`[keep-alive] Self-ping started → ${pingUrl} every 14 min`);
};

export default startKeepAlive;
