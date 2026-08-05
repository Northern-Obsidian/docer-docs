import { requireNativeModule } from "expo";

export interface ScannedDocument {
  name: string;
  path: string;
  uri: string;
  size: number;
  lastModified: number;
  extension: string;
}

export interface StorageDirectory {
  name: string;
  path: string;
  uri?: string;
  isRemovable?: boolean;
}

export interface DocumentScannerModuleType {
  hasStoragePermission(): Promise<boolean>;
  requestStoragePermission(): Promise<boolean>;
  scanDirectory(
    path: string,
    extensions?: string[]
  ): Promise<ScannedDocument[]>;
  getStorageDirectories(): Promise<StorageDirectory[]>;
  getCommonDocumentDirs(): Promise<StorageDirectory[]>;
}

const DocumentScannerModule =
  requireNativeModule<DocumentScannerModuleType>("DocumentScanner");

export default DocumentScannerModule;
