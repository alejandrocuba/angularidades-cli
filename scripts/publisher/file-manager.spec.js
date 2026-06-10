import { describe, test, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getEpisodeData, getLocalTranscripts, saveCaptions } from './file-manager.js';

describe('file-manager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getEpisodeData', () => {
    test('should load correct metadata, titles, descriptions, and tags when files exist', async () => {
      const mockEpisodeDir = '/mock/episode/0089';

      vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
        if (p.endsWith('metadata.json')) return true;
        if (p.endsWith('youtube_title_es.txt')) return true;
        if (p.endsWith('youtube_title_en.txt')) return true;
        if (p.endsWith('youtube_description_es.md')) return true;
        if (p.endsWith('youtube_description_en.md')) return true;
        if (p.endsWith('youtube_tags.txt')) return true;
        return false;
      });

      vi.spyOn(fs, 'readFileSync').mockImplementation((p) => {
        if (p.endsWith('metadata.json')) {
          return JSON.stringify({ videoId: 'wIaThYaieUA', recordingDate: '2026-06-10' });
        }
        if (p.endsWith('youtube_title_es.txt')) return 'Spanish Title';
        if (p.endsWith('youtube_title_en.txt')) return 'English Title';
        if (p.endsWith('youtube_description_es.md')) return 'Spanish Desc';
        if (p.endsWith('youtube_description_en.md')) return 'English Desc';
        if (p.endsWith('youtube_tags.txt')) return 'tag1, tag2, tag3';
        return '';
      });

      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      const logDoctor = vi.fn();

      const result = await getEpisodeData(mockEpisodeDir, logDoctor, false);

      expect(result.metadata.recordingDate).toBe('2026-06-10');
      expect(result.videoId).toBe('wIaThYaieUA');
      expect(result.titleEs).toBe('Spanish Title');
      expect(result.titleEn).toBe('English Title');
      expect(result.descriptionEs).toBe('Spanish Desc');
      expect(result.descriptionEn).toBe('English Desc');
      expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    test('should extract video ID from full YouTube URL in metadata', async () => {
      const mockEpisodeDir = '/mock/episode/0089';

      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation((p) => {
        if (p.endsWith('metadata.json')) {
          return JSON.stringify({ videoId: 'https://www.youtube.com/watch?v=wIaThYaieUA' });
        }
        return '';
      });
      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      const result = await getEpisodeData(mockEpisodeDir, () => {}, false);
      expect(result.videoId).toBe('wIaThYaieUA');
    });
  });

  describe('getLocalTranscripts', () => {
    test('should return list of transcripts indicating if they exist', () => {
      const mockEpisodeDir = '/mock/episode/0089';

      vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
        if (p.endsWith('youtube_captions_es.sbv')) return true;
        if (p.endsWith('youtube_captions_en.sbv')) return false;
        return false;
      });

      const transcripts = getLocalTranscripts(mockEpisodeDir);

      expect(transcripts).toHaveLength(2);
      expect(transcripts[0].code).toBe('es');
      expect(transcripts[0].exists).toBe(true);
      expect(transcripts[1].code).toBe('en');
      expect(transcripts[1].exists).toBe(false);
    });
  });

  describe('saveCaptions', () => {
    test('should write captions data to youtube_captions.sbv in the 1_recording directory', () => {
      const mockEpisodeDir = '/mock/episode/0089';
      const mockData = '0:00:00.000,0:00:05.000\nHello World';

      const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);

      saveCaptions(mockEpisodeDir, mockData);

      expect(mkdirSpy).toHaveBeenCalledWith(path.join(mockEpisodeDir, '1_recording'), {
        recursive: true
      });
      expect(writeSpy).toHaveBeenCalledWith(
        path.join(mockEpisodeDir, '1_recording', 'youtube_captions.sbv'),
        mockData
      );
    });
  });
});
