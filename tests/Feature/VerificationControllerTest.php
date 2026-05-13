<?php

use Illuminate\Support\Facades\Http;

test('verification init requires type parameter', function () {
    $this->postJson('/api/verification/init', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['type']);
});

test('verification init rejects invalid type', function () {
    $this->postJson('/api/verification/init', ['type' => 'invalid'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['type']);
});

test('verification init accepts valid types', function (string $type) {
    Http::fake([
        '*/ui/presentations/v2' => Http::response([
            'transaction_id' => 'test-txn-123',
            'client_id' => 'test-client',
            'request_uri' => 'https://verifier.example.com/request/123',
            'request_uri_method' => 'get',
        ]),
    ]);

    $this->postJson('/api/verification/init', ['type' => $type])
        ->assertSuccessful()
        ->assertJsonStructure(['transaction_id', 'client_id', 'request_uri']);

    Http::assertSent(function ($request) {
        return $request['profile'] === 'openid4vp'
            && $request['request_uri_method'] === 'get'
            && isset($request['dcql_query']['credentials']);
    });
})->with(['pid', 'mdl', 'age', 'pid_mdl']);

test('verification init sends unique credential ids for combined hotel and car verification', function () {
    Http::fake([
        '*/ui/presentations/v2' => Http::response([
            'transaction_id' => 'test-txn-123',
            'client_id' => 'test-client',
            'request_uri' => 'https://verifier.example.com/request/123',
            'request_uri_method' => 'get',
        ]),
    ]);

    $this->postJson('/api/verification/init', ['type' => 'pid_mdl'])
        ->assertSuccessful();

    Http::assertSent(function ($request) {
        $credentials = $request['dcql_query']['credentials'] ?? [];

        return count($credentials) === 2
            && $credentials[0]['id'] === 'query_0'
            && $credentials[1]['id'] === 'query_1'
            && $credentials[0]['meta']['doctype_value'] === 'eu.europa.ec.eudi.pid.1'
            && $credentials[1]['meta']['doctype_value'] === 'org.iso.18013.5.1.mDL';
    });
});

test('verification init returns structured error when verifier rejects request', function () {
    Http::fake([
        '*/ui/presentations/v2' => Http::response([
            'error' => 'VerifierRejectedRequest',
        ], 400),
    ]);

    $this->postJson('/api/verification/init', ['type' => 'pid'])
        ->assertStatus(502)
        ->assertJson([
            'message' => 'The verifier rejected the verification request.',
            'error' => 'VerifierRejectedRequest',
        ]);
});

test('verification status returns pending for unknown transaction', function () {
    Http::fake([
        '*/ui/presentations/*' => Http::response([], 404),
    ]);

    $this->getJson('/api/verification/some-txn-id/status')
        ->assertSuccessful()
        ->assertJson(['status' => 'pending']);
});

test('verification status returns pending while verifier is waiting for wallet response', function () {
    Http::fake([
        '*/ui/presentations/*' => Http::response([], 400),
    ]);

    $this->getJson('/api/verification/some-txn-id/status')
        ->assertSuccessful()
        ->assertJson(['status' => 'pending']);
});

test('verification status returns verifier response', function () {
    Http::fake([
        '*/ui/presentations/*' => Http::response(['status' => 'success', 'data' => []]),
    ]);

    $this->getJson('/api/verification/some-txn-id/status')
        ->assertSuccessful()
        ->assertJson(['status' => 'success']);
});

test('verification status returns structured error when verifier polling fails upstream', function () {
    Http::fake([
        '*/ui/presentations/*' => Http::response([
            'error' => 'VerifierStatusServiceUnavailable',
        ], 500),
    ]);

    $this->getJson('/api/verification/some-txn-id/status')
        ->assertStatus(502)
        ->assertJson([
            'message' => 'The verifier rejected the verification status request.',
            'error' => 'VerifierStatusServiceUnavailable',
        ]);
});
