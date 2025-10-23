export interface NativeMarketPlugin {
  /**
   * This method will launch link in Play/App Store.
   *
   * @param {String} appId - ID of your application. Eg. com.example.app
   * @param {String} [country] - International country code if application is not published in the US App store (only for iOS). Eg. IT
   *
   * @returns void
   *
   * @since 1.0.0
   */
  openStoreListing(options: { appId: string; country?: string }): Promise<void>;
  /**
   * This method will deep-link directly to an Play/App store listing page.
   *
   * Only in Android.
   *
   * @param {String} devId - ID of developer. Eg. com.example.app
   *
   * @returns void
   *
   * @since 1.0.0
   */
  openDevPage(options: { devId: string }): Promise<void>;
  /**
   * This method will link users to a collection or top charts.
   * Only in Android.
   *
   * @param {String} name - name of the collection. Click [here](https://developer.android.com/distribute/marketing-tools/linking-to-google-play#OpeningCollection) for android options.
   *
   * @returns void
   *
   * @since 1.0.0
   */
  openCollection(options: { name: string }): Promise<void>;
  /**
   * This method will link users to Editor's choice page.
   *
   * Only in Android.
   *
   * @param {String} editorChoice - ID of your application. Eg. editorial_fitness_apps_us
   * @returns void
   *
   * @since 1.0.0
   */
  openEditorChoicePage(options: { editorChoice: string }): Promise<void>;
  /**
   * This method will link users to custom search query.
   *
   * Only in Android.
   *
   * @param {String} editorChoice - terms to be searched in Play/App store.
   * @returns void
   *
   * @since 1.0.0
   */
  search(options: { terms: string }): Promise<void>;

  /**
   * Get the native Capacitor plugin version
   *
   * @returns {Promise<{ id: string }>} an Promise with version for this device
   * @throws An error if the something went wrong
   */
  getPluginVersion(): Promise<{ version: string }>;
}
