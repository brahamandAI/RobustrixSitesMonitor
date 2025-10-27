import type { NextApiRequest, NextApiResponse } from 'next';

const SITES = {
  server1: [
    'https://brahamand.ai',
    'https://subvivah.com',
    'https://foodfly.co',
    'https://customerzone.in',
    'https://tutorbuddy.co'
  ],
  server2: [
    'https://chitbox.co',
    'https://connectflow.co.in',
    'https://amenties.rozgarhub.co',
    'https://orbitx.zone'
  ]
};

async function checkSite(url: string): Promise<{ url: string; status: 'up' | 'down'; statusCode?: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);
    
    return {
      url,
      status: response.ok ? 'up' : 'down',
      statusCode: response.status
    };
  } catch (error) {
    return {
      url,
      status: 'down'
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allSites = [...SITES.server1, ...SITES.server2];
    const checks = await Promise.all(allSites.map(checkSite));
    
    const result = {
      server1: SITES.server1.map(site => 
        checks.find(check => check.url === site) || { url: site, status: 'down' }
      ),
      server2: SITES.server2.map(site => 
        checks.find(check => check.url === site) || { url: site, status: 'down' }
      ),
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check site statuses' });
  }
}
