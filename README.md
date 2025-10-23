# Capacitor Native Market Plugin

 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

Capacitor community plugin for native market for Play Store/App Store.

## Maintainers

| Maintainer      | GitHub                              | Social                                                | Sponsoring Company |
| --------------- | ----------------------------------- | ----------------------------------------------------- | ------------------ |
| Martin Donadieu | [riderx](https://github.com/riderx) | [@martindonadieu](https://twitter.com/martindonadieu) |                    |

Maintenance Status: Actively Maintained

## Installation

To use npm

```bash
npm install @capgo/native-market
```

To use yarn

```bash
yarn add @capgo/native-market
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
import { NativeMarket } from '@capgo/native-market';

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
