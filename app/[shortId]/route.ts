import { dbConnect } from '@/lib/db';
import { Url } from '@/lib/models/Url';
import {UAParser} from 'ua-parser-js';
import axios from 'axios';

export async function GET(req, { params }) {
  await dbConnect();
  const { shortId } = params;
  const urlDoc = await Url.findOne({ shortId });

  if (!urlDoc) return new Response('Not found', { status: 404 });

  // Get IP and referrer information
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('host');
  const referrer = req.headers.get('referer') || 'Direct';

  // Use UAParser to parse user agent
  const parser = new UAParser();
  const ua = parser.setUA(req.headers.get('user-agent') || '');
  const device = `${ua.getOS().name} - ${ua.getBrowser().name}`;

  let location = 'Unknown';
  try {
    // Get geolocation info based on IP
    const geo = await axios.get(`http://ip-api.com/json/${ip}`);
    location = geo.data.country;
  } catch (err) {
    console.error("Geo lookup failed:", err);
  }

  // Track click details
  urlDoc.clicks.push({
    timestamp: new Date(),
    ip,
    location,
    device,
    referrer,
  });
  await urlDoc.save();

  return Response.redirect(urlDoc.originalUrl);
}
