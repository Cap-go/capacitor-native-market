import XCTest
@testable import NativeMarketPlugin

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
}
