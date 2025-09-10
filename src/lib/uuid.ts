/**
 * Utility functions for UUID validation and handling
 */

/**
 * Validates if a string is a valid UUID (v4 format)
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Filters an array of objects to only include those with valid UUID ids
 */
export function filterValidUUIDs<T extends { id: string }>(items: T[]): T[] {
  return items.filter(item => isValidUUID(item.id));
}