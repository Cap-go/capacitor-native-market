import XCTest
import Capacitor
@testable import NativeMarketPlugin

final class MockURLOpener: NativeMarketURLOpening {
    var canOpen = false
    var openResult = false
    var openCalled = false

    func canOpenURL(_ url: URL) -> Bool {
        return canOpen
    }

    func open(_ url: URL, options: [UIApplication.OpenExternalURLOptionsKey: Any], completionHandler completion: ((Bool) -> Void)?) {
        openCalled = true
        completion?(openResult)
    }
}

final class NativeMarketPluginTests: XCTestCase {
    func testApiResultDecoding() throws {
        let payload = """
        {
            "resultCount": 1,
            "results": [
                { "trackId": 42 }
            ]
        }
        """.data(using: .utf8)!

        let decoded = try JSONDecoder().decode(APIResult.self, from: payload)

        XCTAssertEqual(decoded.resultCount, 1)
        XCTAssertEqual(decoded.apps.first?.trackId, 42)
    }

    private func makeSearchCall(
        onSuccess: @escaping () -> Void,
        onError: @escaping (String?) -> Void
    ) throws -> CAPPluginCall {
        return try XCTUnwrap(CAPPluginCall(
            callbackId: "test",
            methodName: "search",
            options: ["terms": "fitness apps"],
            success: { _, _ in
                onSuccess()
            },
            error: { error in
                onError(error?.message)
            }
        ))
    }

    func testSearchRejectsWhenAppStoreURLCannotBeOpened() throws {
        let plugin = NativeMarket()
        let opener = MockURLOpener()
        opener.canOpen = false
        plugin.urlOpener = opener

        var capturedMessage: String?
        let call = try makeSearchCall(
            onSuccess: {
                XCTFail("search must reject when the App Store URL cannot be opened")
            },
            onError: { message in
                capturedMessage = message
            }
        )

        plugin.search(call)

        XCTAssertFalse(opener.openCalled)
        XCTAssertEqual(capturedMessage, "Cannot open App Store URL")
    }

    func testSearchRejectsWhenOpenCompletesWithFailure() throws {
        let plugin = NativeMarket()
        let opener = MockURLOpener()
        opener.canOpen = true
        opener.openResult = false
        plugin.urlOpener = opener

        var capturedMessage: String?
        let call = try makeSearchCall(
            onSuccess: {
                XCTFail("search must reject when open completes with failure")
            },
            onError: { message in
                capturedMessage = message
            }
        )

        plugin.search(call)

        XCTAssertTrue(opener.openCalled)
        XCTAssertEqual(capturedMessage, "Failed to open App Store URL")
    }
}
