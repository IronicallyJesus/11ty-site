// src/_data/certifications.js
// Fetches live certification status from Credly, enriched with manual metadata.
// Falls back to manual data if API is unreachable.

const https = require('https');

const CREDLY_USER_ID = '4879ae97-561a-4660-8e53-1d20b72f8c37';
const BADGES_URL = `https://www.credly.com/users/${CREDLY_USER_ID}/badges?page=1&page_size=48`;

// Skip non-certification badges (courses, trainings, etc.)
const EXCLUDE_PATTERNS = [
];

// Manual enrichment keyed by badge template ID (last segment of image_url or name match)
const MANUAL_DATA = {
  'JNCIA-DevOps': {
    category: 'Automation',
    tags: ['DevOps', 'Python', 'API', 'Juniper'],
    display_name: 'JNCIA - DevOps',
  },
  'JNCIS-SP': {
    category: 'Service Provider',
    tags: ['MPLS', 'BGP', 'Layer 2', 'Juniper'],
    display_name: 'JNCIS - Service Provider',
  },
  'JNCIS-ENT': {
    category: 'Enterprise',
    tags: ['Routing', 'Switching', 'OSPF', 'Juniper'],
    display_name: 'JNCIS - Enterprise',
  },
  'JNCIA-Junos': {
    category: 'Foundation',
    tags: ['Routing', 'Networking', 'Junos OS'],
    display_name: 'JNCIA - Junos',
  },
  'CCNA': {
    category: 'Foundation',
    tags: ['Routing', 'Switching', 'OSPF', 'Cisco'],
    display_name: 'CCNA',
  }
};

function fetchCredlyBadges() {
  return new Promise((resolve, reject) => {
    https.get(
      BADGES_URL,
      { headers: { Accept: 'application/json' } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse failed: ${e.message}`));
          }
        });
      }
    ).on('error', reject);
  });
}

function matchManual(name) {
  for (const [key, val] of Object.entries(MANUAL_DATA)) {
    if (name.includes(key)) return val;
  }
  return null;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function certStatus(expiresAtDate, state) {
  if (state === 'revoked' || state === 'expired') return 'expired';
  if (!expiresAtDate) return 'active'; // no expiry
  const expires = new Date(expiresAtDate);
  const now = new Date();
  const monthsLeft = (expires - now) / (1000 * 60 * 60 * 24 * 30);
  if (monthsLeft < 0) return 'expired';
  if (monthsLeft < 6) return 'expiring_soon';
  return 'active';
}

function statusLabel(status) {
  switch (status) {
    case 'expired':
      return 'Expired';
    case 'expiring_soon':
      return 'Expiring';
    default:
      return 'Active';
  }
}

function statusDotClass(status) {
  switch (status) {
    case 'expired':
      return 'offline';
    case 'expiring_soon':
      return 'warning';
    default:
      return 'online';
  }
}

module.exports = async function () {
  try {
    const response = await fetchCredlyBadges();

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Unexpected API response structure');
    }

    const enriched = response.data
      .filter((badge) => {
        const name = (badge.badge_template || {}).name || '';
        return !EXCLUDE_PATTERNS.some(p => name.includes(p));
      })
      .map((badge) => {
        const bt = badge.badge_template || {};
        const name = bt.name || 'Unknown';
        const issuer = (bt.issuer || {}).summary || 'Unknown';
        const manual = matchManual(name) || {};
        const status = certStatus(badge.expires_at_date, badge.state);
        const isExpired = badge.expires_at_date && new Date(badge.expires_at_date) < new Date();

        return {
          name: manual.display_name || name,
          full_name: name,
          issuer: issuer.replace(/^issued by /, ''),
          earned: formatDate(badge.issued_at_date),
          expires: badge.expires_at_date ? formatDate(badge.expires_at_date) : null,
          status: status,
          status_label: statusLabel(status),
          status_dot: statusDotClass(status),
          category: manual.category || '',
          tags: manual.tags || [],
          verification_url: `https://www.credly.com/badges/${badge.id}`,
          image_url: badge.image_url || '',
          is_expired: isExpired,
          is_permanent: !badge.expires_at_date,
        };
      });

    // Sort: active first, then expiring soon, then expired
    const order = { active: 0, expiring_soon: 1, expired: 2 };
    enriched.sort((a, b) => order[a.status] - order[b.status]);

    console.log(`[certifications] Fetched ${enriched.length} badges from Credly`);
    return enriched;
  } catch (err) {
    console.warn(`[certifications] Credly API failed: ${err.message}. Falling back to static data.`);

    // Fallback: return the old static data
    const fallback = require('./certifications.json');
    return fallback.map((cert) => ({
      ...cert,
      status: 'active',
      status_label: 'Active',
      status_dot: 'online',
      is_expired: false,
      is_permanent: false,
      full_name: cert.name,
      image_url: '',
    }));
  }
};
