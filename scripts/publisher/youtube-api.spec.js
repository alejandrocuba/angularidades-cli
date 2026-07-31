import { describe, test, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { downloadExistingCaptions } from './youtube-api.js';

describe('youtube-api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('downloadExistingCaptions', () => {
    test('should download captions when isDoctor is true and no local files exist', async () => {
      const episodeDir = '/mock/episode/0083';

      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      const mockYoutube = {
        captions: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: [
                {
                  id: 'caption-track-1',
                  snippet: { language: 'es', trackKind: 'ASR', name: '' }
                }
              ]
            }
          }),
          download: vi.fn().mockResolvedValue({
            data: '0:00:00.000,0:00:05.000\nHola mundo'
          })
        }
      };

      await downloadExistingCaptions(mockYoutube, 'J3CApzKtcCU', episodeDir, true, false);

      expect(mockYoutube.captions.list).toHaveBeenCalledWith({
        part: 'snippet',
        videoId: 'J3CApzKtcCU'
      });
      expect(mockYoutube.captions.download).toHaveBeenCalledWith({
        id: 'caption-track-1',
        tfmt: 'sbv'
      });
      expect(writeSpy).toHaveBeenCalledWith(
        path.join(episodeDir, '1_recording', 'youtube_captions.sbv'),
        '0:00:00.000,0:00:05.000\nHola mundo'
      );
    });

    test('should not download captions when isDryRun is true', async () => {
      const episodeDir = '/mock/episode/0083';

      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      const mockYoutube = {
        captions: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: [
                {
                  id: 'caption-track-1',
                  snippet: { language: 'es', trackKind: 'ASR', name: '' }
                }
              ]
            }
          }),
          download: vi.fn()
        }
      };

      await downloadExistingCaptions(mockYoutube, 'J3CApzKtcCU', episodeDir, true, true);

      expect(mockYoutube.captions.download).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });
});
