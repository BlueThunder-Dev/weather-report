import { describe, it, expect } from 'vitest';
import { formatWeatherDate } from './date/dateUtils';
import { normalizeLocation } from './normalizer/normalizeLocation';
import { MinLength } from './validators/MinLength';
import { Pattern } from './validators/Pattern';
import { Required} from './validators/Required';


describe('Utility Functions & Validators', () => {
  describe('formatWeatherDate', () => {
    it('should return "N/A" if timestamp is missing', () => {
      expect(formatWeatherDate(null)).toBe('N/A');
      expect(formatWeatherDate(undefined)).toBe('N/A');
    });

    it('should format timestamp correctly to en-GB format', () => {
      const ts = 1706774400;
      const result = formatWeatherDate(ts);
      expect(result).toMatch(/\d{2}-\d{2}-\d{4} \d{2}:\d{2} (am|pm)/i);
    });
  });

  describe('normalizeLocation', () => {
    it('should return an empty array for invalid input', () => {
      expect(normalizeLocation(null)).toEqual([]);
      expect(normalizeLocation({})).toEqual([]);
    });

    it('should correctly map raw data with state', () => {
      const raw = [{ name: 'Milan', state: 'Lombardy', country: 'IT', lat: 45.4, lon: 9.1 }];
      const normalized = normalizeLocation(raw);
      expect(normalized[0]).toEqual({
        displayLabel: 'Milan, Lombardy, IT',
        city: 'Milan',
        country: 'IT',
        coords: { lat: 45.4, lon: 9.1 }
      });
    });

    it('should correctly map raw data without state', () => {
      const raw = [{ name: 'Rome', country: 'IT', lat: 41.9, lon: 12.4 }];
      const normalized = normalizeLocation(raw);
      expect(normalized[0].displayLabel).toBe('Rome, IT');
    });
  });


  describe('Validators', () => {
    it('Required: should fail on empty string or null', () => {
      const validator = new Required('Field is required');
      expect(validator.execute('')).toBe(false);
      expect(validator.execute('  ')).toBe(false);
      expect(validator.execute('Rome')).toBe(true);
      expect(validator.getMessage()).toBe('Field is required');
    });

    it('MinLength: should validate correctly based on length', () => {
      const validator = new MinLength(3, 'Too short');
      expect(validator.execute('No')).toBe(false);
      expect(validator.execute('Yes')).toBe(true);
    });

    it('Pattern: should validate using regex', () => {
      const validator = new Pattern(/^[0-9]+$/, 'Numbers only');
      expect(validator.execute('ABC')).toBe(false);
      expect(validator.execute('123')).toBe(true);
    });
  });
});