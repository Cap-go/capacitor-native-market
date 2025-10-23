/**
 * Capacitor Native Market Plugin for opening app store listings and pages.
 *
 * @since 1.0.0
 */
export interface NativeMarketPlugin {
  /**
   * Launch app listing page in Play Store (Android) or App Store (iOS).
   *
   * @param options - Configuration for opening the store listing
   * @returns Promise that resolves when the store is opened
   * @throws Error if opening the store fails
   * @since 1.0.0
   * @example
   * ```typescript
   * // Open app in store
   * await NativeMarket.openStoreListing({
   *   appId: 'com.example.app'
   * });
   *
   * // Open app in specific country store (iOS only)
   * await NativeMarket.openStoreListing({
   *   appId: 'com.example.app',
   *   country: 'IT'
   * });
   * ```
   */
  openStoreListing(options: { appId: string; country?: string }): Promise<void>;

  /**
   * Deep-link directly to a developer's page in the Play Store.
   * Android only.
   *
   * @param options - Configuration with developer ID
   * @returns Promise that resolves when the page is opened
   * @throws Error if opening the page fails or if called on iOS
   * @since 1.0.0
   * @example
   * ```typescript
   * await NativeMarket.openDevPage({
   *   devId: 'Google+LLC'
   * });
   * ```
   */
  openDevPage(options: { devId: string }): Promise<void>;

  /**
   * Link users to a collection or top charts in the Play Store.
   * Android only.
   *
   * @param options - Configuration with collection name
   * @returns Promise that resolves when the collection is opened
   * @throws Error if opening the collection fails or if called on iOS
   * @since 1.0.0
   * @example
   * ```typescript
   * await NativeMarket.openCollection({
   *   name: 'featured'
   * });
   * ```
   * @see https://developer.android.com/distribute/marketing-tools/linking-to-google-play#OpeningCollection
   */
  openCollection(options: { name: string }): Promise<void>;

  /**
   * Link users to Editor's choice page in the Play Store.
   * Android only.
   *
   * @param options - Configuration with editor choice ID
   * @returns Promise that resolves when the page is opened
   * @throws Error if opening the page fails or if called on iOS
   * @since 1.0.0
   * @example
   * ```typescript
   * await NativeMarket.openEditorChoicePage({
   *   editorChoice: 'editorial_fitness_apps_us'
   * });
   * ```
   */
  openEditorChoicePage(options: { editorChoice: string }): Promise<void>;

  /**
   * Search the Play Store with custom search terms.
   * Android only.
   *
   * @param options - Configuration with search terms
   * @returns Promise that resolves when the search is opened
   * @throws Error if opening search fails or if called on iOS
   * @since 1.0.0
   * @example
   * ```typescript
   * await NativeMarket.search({
   *   terms: 'fitness apps'
   * });
   * ```
   */
  search(options: { terms: string }): Promise<void>;

  /**
   * Get the native Capacitor plugin version.
   *
   * @returns Promise that resolves with the plugin version
   * @throws Error if getting the version fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { version } = await NativeMarket.getPluginVersion();
   * console.log('Plugin version:', version);
   * ```
   */
  getPluginVersion(): Promise<{ version: string }>;
}
