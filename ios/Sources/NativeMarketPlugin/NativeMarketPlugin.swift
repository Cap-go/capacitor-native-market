import Foundation
import UIKit
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

protocol NativeMarketURLOpening {
    func canOpenURL(_ url: URL) -> Bool
    func open(_ url: URL, options: [UIApplication.OpenExternalURLOptionsKey: Any], completionHandler completion: ((Bool) -> Void)?)
}

extension UIApplication: NativeMarketURLOpening {}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(NativeMarket)
public class NativeMarket: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "8.0.61"
    public let identifier = "NativeMarketPlugin"
    public let jsName = "NativeMarket"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "openStoreListing", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openDevPage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openCollection", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openEditorChoicePage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "search", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]
    var urlOpener: NativeMarketURLOpening = UIApplication.shared

    func openStoreURL(_ url: URL, call: CAPPluginCall) {
        if urlOpener.canOpenURL(url) {
            urlOpener.open(url, options: [:]) { success in
                if success {
                    call.resolve()
                } else {
                    call.reject("Failed to open App Store URL")
                }
            }
        } else {
            call.reject("Cannot open App Store URL")
        }
    }

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
                self.openStoreURL(appUrl, call: call)
            }
        } catch {
            print("Error: \(error.localizedDescription)")
            call.reject("Error: \(error.localizedDescription)")
        }
    }

    @objc func openDevPage(_ call: CAPPluginCall) {
        call.unimplemented("openDevPage is not implemented on iOS.")
    }

    @objc func openCollection(_ call: CAPPluginCall) {
        call.unimplemented("openCollection is not implemented on iOS.")
    }

    @objc func openEditorChoicePage(_ call: CAPPluginCall) {
        call.unimplemented("openEditorChoicePage is not implemented on iOS.")
    }

    @objc func search(_ call: CAPPluginCall) {
        guard let terms = call.getString("terms") else {
            call.reject("terms is missing")
            return
        }

        var components = URLComponents()
        components.scheme = "itms-apps"
        components.host = "itunes.apple.com"
        components.path = "/search"
        components.queryItems = [URLQueryItem(name: "term", value: terms)]
        guard let appUrl = components.url else {
            call.reject("Invalid search URL")
            return
        }

        openStoreURL(appUrl, call: call)
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }

}
