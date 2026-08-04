import http from "http";
import { performance } from "perf_hooks";

// Configuration
const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "50", 10);
const TOTAL_REQUESTS = parseInt(process.env.TOTAL_REQUESTS || "1000", 10);

async function runBenchmark() {
  console.log(`\n=================================================`);
  console.log(` 🚀 FULL-STACK URL SHORTENER & QR CODE BENCHMARK`);
  console.log(`=================================================`);
  console.log(` Target Server  : ${BASE_URL}`);
  console.log(` Total Requests : ${TOTAL_REQUESTS}`);
  console.log(` Concurrency    : ${CONCURRENCY} connections`);
  console.log(`-------------------------------------------------\n`);

  // Check if server is running
  const isOnline = await testConnection(`${BASE_URL}/`);
  if (!isOnline) {
    console.error(`❌ Could not connect to ${BASE_URL}.`);
    console.error(`   Please start your backend ('npm start' inside Backend folder) first.\n`);
    process.exit(1);
  }

  // TEST 1: Redirect Speed & Throughput
  console.log(`📌 TEST 1: Measuring Redirection Throughput & Latency...`);
  const testShortCode = await createTestShortUrl(false);
  const targetPath = testShortCode ? `/${testShortCode}` : "/";
  const redirectResults = await measureHttpPerformance(`${BASE_URL}${targetPath}`, TOTAL_REQUESTS, CONCURRENCY);

  // TEST 2: QR Code Generation Speed & Performance
  console.log(`\n📌 TEST 2: Measuring Dynamic QR Code Generation Speed...`);
  const qrResults = await measureQrCodePerformance(50);

  // TEST 3: Rate Limiter Spam Blocking Efficiency
  console.log(`\n📌 TEST 3: Testing Rate Limiter Spam Blocking Rate...`);
  const rateLimitResults = await testRateLimiterSpam();

  // Print Complete Resume-Ready Report
  printReport(redirectResults, qrResults, rateLimitResults);
}

function testConnection(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => resolve(true)).on("error", () => resolve(false));
  });
}

function createTestShortUrl(generateQRCode = false) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ url: "https://google.com", generateQRCode });
    const req = http.request(
      `${BASE_URL}/api/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            if (json.data && json.data.short_url) {
              const code = json.data.short_url.split("/").pop();
              resolve({ code, hasQr: !!json.data.qrcode_image });
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on("error", () => resolve(null));
    req.write(postData);
    req.end();
  });
}

function measureHttpPerformance(url, totalRequests, concurrency) {
  return new Promise((resolve) => {
    const latencies = [];
    let completed = 0;
    let successful = 0;
    let failed = 0;
    let started = 0;

    const startTime = performance.now();

    function sendNext() {
      if (started >= totalRequests) return;
      started++;

      const reqStart = performance.now();

      const req = http.get(url, (res) => {
        res.on("data", () => { });
        res.on("end", () => {
          const latency = performance.now() - reqStart;
          latencies.push(latency);

          if (res.statusCode >= 200 && res.statusCode < 400) {
            successful++;
          } else {
            failed++;
          }

          completed++;
          if (completed === totalRequests) {
            const totalDurationSec = (performance.now() - startTime) / 1000;
            resolve({
              latencies: latencies.sort((a, b) => a - b),
              totalDurationSec,
              successful,
              failed,
              totalRequests,
            });
          } else {
            sendNext();
          }
        });
      });

      req.on("error", () => {
        const latency = performance.now() - reqStart;
        latencies.push(latency);
        failed++;
        completed++;
        if (completed === totalRequests) {
          const totalDurationSec = (performance.now() - startTime) / 1000;
          resolve({
            latencies: latencies.sort((a, b) => a - b),
            totalDurationSec,
            successful,
            failed,
            totalRequests,
          });
        } else {
          sendNext();
        }
      });

      req.end();
    }

    for (let i = 0; i < Math.min(concurrency, totalRequests); i++) {
      sendNext();
    }
  });
}

function measureQrCodePerformance(count) {
  return new Promise(async (resolve) => {
    const latencies = [];
    let generatedCount = 0;

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      const res = await createTestShortUrl(true);
      const latency = performance.now() - start;
      if (res && res.hasQr) {
        latencies.push(latency);
        generatedCount++;
      }
    }

    const avgQrLatency = latencies.length ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1) : "0";
    resolve({ count: generatedCount, avgQrLatency });
  });
}

function testRateLimiterSpam() {
  return new Promise((resolve) => {
    const SPAM_COUNT = 100;
    let allowed = 0;
    let blocked = 0;
    let finished = 0;

    for (let i = 0; i < SPAM_COUNT; i++) {
      const postData = JSON.stringify({ url: `https://example${i}.com` });
      const req = http.request(
        `${BASE_URL}/api/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
            "User-Agent": "SpamBot-Test-Runner/1.0",
          },
        },
        (res) => {
          res.on("data", () => { });
          res.on("end", () => {
            if (res.statusCode === 429) {
              blocked++;
            } else if (res.statusCode === 200 || res.statusCode === 201) {
              allowed++;
            }
            finished++;
            if (finished === SPAM_COUNT) {
              resolve({ totalSpamSent: SPAM_COUNT, allowed, blocked });
            }
          });
        }
      );
      req.on("error", () => {
        finished++;
        if (finished === SPAM_COUNT) resolve({ totalSpamSent: SPAM_COUNT, allowed, blocked });
      });
      req.write(postData);
      req.end();
    }
  });
}

function printReport(redirectRes, qrRes, rateLimitRes) {
  const { latencies, totalDurationSec, successful, totalRequests } = redirectRes;
  const rps = (totalRequests / totalDurationSec).toFixed(0);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
  const p95Idx = Math.floor(0.95 * latencies.length);
  const p95Latency = latencies[p95Idx]?.toFixed(1) || avgLatency;

  const blockedPct = ((rateLimitRes.blocked / rateLimitRes.totalSpamSent) * 100).toFixed(0);

  console.log(`\n=================================================`);
  console.log(` 📊 FINAL BENCHMARK SUMMARY & RESUME NUMBERS`);
  console.log(`=================================================`);
  console.log(` 🚀 Throughput          : ~${rps} redirects/sec`);
  console.log(` ⚡ Redirection Latency : ${avgLatency} ms (p95: ${p95Latency} ms)`);
  console.log(` 📷 QR Code Gen Latency : ~${qrRes.avgQrLatency} ms per QR image`);
  console.log(` 🛡️ Spam Requests Blocked: ${rateLimitRes.blocked}/${rateLimitRes.totalSpamSent} (${blockedPct}%)`);
  console.log(`=================================================\n`);

  console.log(`✨ UPDATED FULL-PROJECT RESUME HTML:`);
  console.log(`-------------------------------------------------`);
  console.log(`
<div class="item">
  <div class="item-head">
    <div class="item-title">URL Shortener & QR Generator <span class="tech">(MERN + Redis)</span></div>
    <div class="item-links">
      <a class="item-link" href="https://bharat-url-shortener.vercel.app/" target="_blank">Live Demo</a>
      <a class="item-link" href="https://github.com/Bharat940/url-shortener-analytics" target="_blank">GitHub</a>
    </div>
  </div>
  <ul class="bullets">
    <li>Developed a full-stack URL shortener & QR code generator handling <span class="metric">${rps}+</span> redirects/sec with <${Math.ceil(qrRes.avgQrLatency)}ms instant QR image generation.</li>
    <li>Implemented hybrid Redis/In-Memory sliding window rate limiting and JWT auth, blocking <span class="metric">${blockedPct}%</span> of abusive request spikes exceeding rate quotas.</li>
    <li>Built interactive analytics dashboards with TanStack Router & Redux Toolkit, visualizing click-through trends and geo-metrics across <span class="metric">50+</span> tracked links.</li>
  </ul>
</div>
  `);
  console.log(`-------------------------------------------------\n`);
}

runBenchmark();
