import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL, fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const YOUTUBE_URL = 'https://www.youtube.com/@angularidades/videos';
const README_PATH = path.join(__dirname, '../../README.md');
const MAX_EPISODES = 12; // Number of episode thumbnails to display in README.md

// Helper to make HTTPS GET requests
function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            Cookie: 'SOCS=JD8' // Bypasses YouTube/Google consent wall redirects globally
          }
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetch(res.headers.location).then(resolve).catch(reject);
          }

          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve(data));
        }
      )
      .on('error', reject);
  });
}

// Recursively find all objects that contain a videoId string of exactly 11 chars
// This is robust against YouTube using gridVideoRenderer, videoRenderer, compactVideoRenderer, etc.
function findVideoObjects(obj, results = []) {
  if (!obj || typeof obj !== 'object') return results;

  if (typeof obj.videoId === 'string' && obj.videoId.length === 11) {
    results.push(obj);
  }

  for (const key of Object.keys(obj)) {
    try {
      findVideoObjects(obj[key], results);
    } catch {
      // Ignore circular reference or other access errors if any
    }
  }
  return results;
}

// Fetch and parse YouTube Videos
async function getYouTubeVideos() {
  try {
    console.log('Fetching YouTube videos from:', YOUTUBE_URL);
    const html = await fetch(YOUTUBE_URL);
    console.log('YouTube page fetched successfully. HTML length:', html.length);

    // Check if consent redirect happened
    const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
    const extractedUrls = html.match(urlRegex) || [];
    const hasConsentHostUrl = extractedUrls.some((candidate) => {
      try {
        return new URL(candidate).hostname === 'consent.youtube.com';
      } catch {
        return false;
      }
    });

    if (
      hasConsentHostUrl ||
      html.includes('before_you_redirect') ||
      html.includes('consent-bump')
    ) {
      console.log('Warning: YouTube consent wall/redirect detected in HTML!');
    }

    // Robust balanced-braces script extractor for ytInitialData
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script\s*[^>]*>/gi;
    let scriptMatch;
    let ytInitialDataStr = null;

    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
      const content = scriptMatch[1];
      if (content.includes('ytInitialData')) {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          ytInitialDataStr = content.substring(start, end + 1);
          console.log('Found ytInitialData script block. JSON length:', ytInitialDataStr.length);
          break;
        }
      }
    }

    if (!ytInitialDataStr) {
      throw new Error('Could not find ytInitialData script block in YouTube HTML response');
    }

    const json = JSON.parse(ytInitialDataStr);
    const renderers = findVideoObjects(json);
    console.log(`Found ${renderers.length} video-like objects in ytInitialData JSON`);

    const videos = [];
    for (const renderer of renderers) {
      const videoId = renderer.videoId;
      const title =
        renderer.title?.runs?.[0]?.text || renderer.title?.simpleText || 'Angularidades Episode';
      if (videoId && !videos.some((v) => v.id === videoId)) {
        videos.push({
          id: videoId,
          title: title,
          url: `https://www.youtube.com/watch?v=${videoId}`
        });
      }
      if (videos.length >= MAX_EPISODES) break;
    }

    console.log(`Parsed ${videos.length} videos from renderers`);
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.stack || error.message);
    return [];
  }
}

// Main execution
async function main() {
  const videos = await getYouTubeVideos();

  if (videos.length === 0) {
    console.log('No new content fetched. Skipping README update.');
    return;
  }

  let readmeContent = fs.readFileSync(README_PATH, 'utf8');

  // Update YouTube Section
  const youtubeStartTag = '<!-- YOUTUBE:START -->';
  const youtubeEndTag = '<!-- YOUTUBE:END -->';
  const youtubeStartIndex = readmeContent.indexOf(youtubeStartTag);
  const youtubeEndIndex = readmeContent.indexOf(youtubeEndTag);

  if (youtubeStartIndex !== -1 && youtubeEndIndex !== -1) {
    const youtubeHTML = videos
      .map((video, index) => {
        const spacing = index < videos.length - 1 ? '&nbsp;&nbsp;' : '';
        return `<a href="${video.url}" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="${video.title.replace(/"/g, '&quot;')}"></a>${spacing}`;
      })
      .join('\n');

    readmeContent =
      readmeContent.substring(0, youtubeStartIndex + youtubeStartTag.length) +
      '\n' +
      youtubeHTML +
      '\n' +
      readmeContent.substring(youtubeEndIndex);

    fs.writeFileSync(README_PATH, readmeContent, 'utf8');
    console.log(`README.md updated successfully with ${videos.length} videos!`);
  } else {
    console.error('Could not find YouTube placeholder comments in README.md');
  }
}

main();
