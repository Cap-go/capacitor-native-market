import Foundation
import Capacitor

struct APIResult: Codable {
    struct App: Codable {
        let trackId: Int

        enum CodingKeys: String, CodingKey {
            case trackId
        }
    }

    let resultCount: Int
    let apps: [App]

    enum CodingKeys: String, CodingKey {
        case resultCount
        case apps = "results"
    }
}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(NativeMarket)
public class NativeMarket: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "InAppBrowserPlugin"
    public let jsName = "InAppBrowser"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "openStoreListing", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openDevPage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openCollection", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openEditorChoicePage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "search", returnType: CAPPluginReturnPromise)
    ]
    @objc func openStoreListing(_ call: CAPPluginCall) {
        guard let appId = call.getString("appId") else {
            call.reject("appId is missing")
            return
        }
        let country = call.getString("country") ?? ""
        do {
            guard let url = URL(string: "https://itunes.apple.com/lookup?bundleId=\(appId)&country=\(country)") else {
                throw NSError(domain: "Invalid URL", code: 0, userInfo: nil)
            }
            let data = try Data(contentsOf: url)
            let decoder = JSONDecoder()
            let apiResult = try decoder.decode(APIResult.self, from: data)

            guard let firstApp = apiResult.apps.first else {
                print("No apps found for given appId")
                call.reject("No apps found for given appId")
                return
            }

            let urlStore = "itms-apps://itunes.apple.com/app/id\(firstApp.trackId)"
            guard let appUrl = URL(string: urlStore) else {
                throw NSError(domain: "Invalid Store URL", code: 0, userInfo: nil)
            }

            DispatchQueue.main.async {
                if UIApplication.shared.canOpenURL(appUrl) {
                    if #available(iOS 10.0, *) {
                        UIApplication.shared.open(appUrl, options: [:]) { (_) in
                            call.resolve()
                        }
                    } else {
                        UIApplication.shared.openURL(appUrl)
                        call.resolve()
                    }
                }
            }
        } catch {
            print("Error: \(error.localizedDescription)")
            call.reject("Error: \(error.localizedDescription)")
        }
    }

    @objc func openDevPage(_ call: CAPPluginCall) {
        call.resolve() // TODO: Implement
    }

    @objc func openCollection(_ call: CAPPluginCall) {
        call.resolve() // TODO: Implement
    }

    @objc func openEditorChoicePage(_ call: CAPPluginCall) {
        call.resolve() // TODO: Implement
    }

    @objc func search(_ call: CAPPluginCall) {
        if call.hasOption("terms") {
            let terms = call.getString("terms")

            let url = "itms-apps://itunes.apple.com/search?term=" + terms!
            let appUrl = URL(string: url)

            if UIApplication.shared.canOpenURL(appUrl!) {
                if #available(iOS 10.0, *) {
                    UIApplication.shared.open(appUrl!, options: [:]) { (_) in
                        call.resolve()
                    }
                } else {
                    UIApplication.shared.openURL(appUrl!)
                    call.resolve()
                }
            }
        } else {
            call.reject("terms is missing")
        }
    }
}
