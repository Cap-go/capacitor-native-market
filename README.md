# Capacitor Native Market Plugin

<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-native-market" alt="Capgo - Instant updates for Capacitor" /></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_native_market"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_native_market"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

Capacitor community plugin for native market for Play Store/App Store.

## Why Native Market?

Deep-link your users directly to your app's store listing, developer page, or search results. Essential for:

- **Prompting app reviews** - Direct users to leave ratings and reviews
- **Update notifications** - Send users to download the latest version
- **Cross-promotion** - Link to your other apps or developer page
- **Search visibility** - Open store searches for specific terms

Simple, focused plugin that handles all the platform-specific store linking logic for you.

## Maintainers

| Maintainer      | GitHub                              | Social                                                | Sponsoring Company |
| --------------- | ----------------------------------- | ----------------------------------------------------- | ------------------ |
| Martin Donadieu | [riderx](https://github.com/riderx) | [@martindonadieu](https://twitter.com/martindonadieu) |                    |

Maintenance Status: Actively Maintained

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/native-market/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Installation

You can use our AI-Assisted Setup to install the plugin. Add the Capgo skills to your AI tool using the following command:

```bash
npx skills add https://github.com/cap-go/capacitor-skills --skill capacitor-plugins
```

Then use the following prompt:

```text
Use the `capacitor-plugins` skill from `cap-go/capacitor-skills` to install the `@capgo/capacitor-native-market` plugin in my project.
```

If you prefer Manual Setup, install the plugin by running the following commands and follow the platform-specific instructions below:

To use npm

```bash
npm install @capgo/capacitor-native-market
```

To use yarn

```bash
yarn add @capgo/capacitor-native-market
```

Sync native files

```bash
npx cap sync
```

iOS Platform: No further action required.

Android Platform: No further action required.

## Configuration

No configuration required for this plugin

## Supported methods

| Name                 | Android | iOS | Web |
| :------------------- | :------ | :-- | :-- |
| openStoreListing     | ✅      | ✅  | ❌  |
| openDevPage          | ✅      | ❌  | ❌  |
| openCollection       | ✅      | ❌  | ❌  |
| openEditorChoicePage | ✅      | ❌  | ❌  |
| search               | ✅      | ✅  | ❌  |

## Usage

```typescript
import { NativeMarket } from '@capgo/capacitor-native-market';

/**
 * This method will launch link in Play/App Store.
 * @param appId - ID of your application. Eg. com.example.app
 * @param [country] - International country code if application is not published in the US App store (only for iOS). Eg. IT
 * @returns void
 */
NativeMarket.openStoreListing({
  appId: 'com.example.app',
  country: 'IT',
});

/**
 * This method will deep-link directly to an Play/App store listing page.
 * @param devId - ID of developer. Eg. com.example.app
 * @returns void
 */
NativeMarket.openDevPage({
  devId: '5700313618786177705',
});

/**
 * This method will link users to a collection or top charts.
 * @param name - name of the collection. Click [here](https://developer.android.com/distribute/marketing-tools/linking-to-google-play#OpeningCollection) for android options.
 * @returns void
 */
NativeMarket.openCollection({
  name: 'featured',
});

/**
 * This method will link users to Editor's choice page.
 * @param editorChoice - ID of your application. Eg. editorial_fitness_apps_us
 * @returns void
 */
NativeMarket.openEditorChoicePage({
  editorChoice: 'editorial_fitness_apps_us',
});

/**
 * This method will link users to custom search query.
 * @param editorChoice - terms to be searched in Play/App store.
 * @returns void
 */
NativeMarket.search({
  terms: 'capacitor',
});
```

## API

<docgen-index>

* [`openStoreListing(...)`](#openstorelisting)
* [`openDevPage(...)`](#opendevpage)
* [`openCollection(...)`](#opencollection)
* [`openEditorChoicePage(...)`](#openeditorchoicepage)
* [`search(...)`](#search)
* [`getPluginVersion()`](#getpluginversion)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Capacitor Native Market Plugin for opening app store listings and pages.

### openStoreListing(...)

```typescript
openStoreListing(options: { appId: string; country?: string; }) => Promise<void>
```

Launch app listing page in Play Store (Android) or App Store (iOS).

| Param         | Type                                              | Description                                   |
| ------------- | ------------------------------------------------- | --------------------------------------------- |
| **`options`** | <code>{ appId: string; country?: string; }</code> | - Configuration for opening the store listing |

**Since:** 1.0.0

--------------------


### openDevPage(...)

```typescript
openDevPage(options: { devId: string; }) => Promise<void>
```

Deep-link directly to a developer's page in the Play Store.
Android only.

| Param         | Type                            | Description                       |
| ------------- | ------------------------------- | --------------------------------- |
| **`options`** | <code>{ devId: string; }</code> | - Configuration with developer ID |

**Since:** 1.0.0

--------------------


### openCollection(...)

```typescript
openCollection(options: { name: string; }) => Promise<void>
```

Link users to a collection or top charts in the Play Store.
Android only.

| Param         | Type                           | Description                          |
| ------------- | ------------------------------ | ------------------------------------ |
| **`options`** | <code>{ name: string; }</code> | - Configuration with collection name |

**Since:** 1.0.0

--------------------


### openEditorChoicePage(...)

```typescript
openEditorChoicePage(options: { editorChoice: string; }) => Promise<void>
```

Link users to Editor's choice page in the Play Store.
Android only.

| Param         | Type                                   | Description                           |
| ------------- | -------------------------------------- | ------------------------------------- |
| **`options`** | <code>{ editorChoice: string; }</code> | - Configuration with editor choice ID |

**Since:** 1.0.0

--------------------


### search(...)

```typescript
search(options: { terms: string; }) => Promise<void>
```

Search the Play Store with custom search terms.
Android only.

| Param         | Type                            | Description                       |
| ------------- | ------------------------------- | --------------------------------- |
| **`options`** | <code>{ terms: string; }</code> | - Configuration with search terms |

**Since:** 1.0.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 1.0.0

--------------------

</docgen-api>

## iOS Notes

If your app is not published in the US App Store, you might not be able to find it. In this case you must specify country code for lookup search to work.
