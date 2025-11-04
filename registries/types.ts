export interface ContextChipEntry {
  /** Unique identifier for the chip */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of what this chip provides */
  description: string;
  /** Path to the markdown file from project root */
  path: string;
  /** Tags for categorization and search */
  tags?: string[];
  /** Category for organization */
  category?: string;
  /** Version of the chip (for tracking updates) */
  version?: string;
}

export type ContextChipRegistry = Record<string, ContextChipEntry>;
