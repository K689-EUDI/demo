<?php

namespace App\Http\Controllers;

use CBOR\Decoder;
use CBOR\StringStream;
use CBOR\Tag;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    /**
     * Initialize a verification transaction with the EUDI verifier.
     */
    public function init(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'string', 'in:pid,mdl,age,pid_mdl'],
        ]);

        try {
            $dcqlQuery = $this->buildDcqlQuery($request->string('type'));

            $verifierUrl = config('services.eudi_verifier.url');

            $response = Http::timeout(15)
                ->connectTimeout(5)
                ->post("{$verifierUrl}/ui/presentations/v2", $dcqlQuery);

            $response->throw();

            return response()->json($response->json());
        } catch (RequestException $exception) {
            $error = $exception->response?->json('error')
                ?? $exception->response?->json('message')
                ?? 'Failed to initialize verification transaction.';

            return response()->json([
                'message' => 'The verifier rejected the verification request.',
                'error' => $error,
            ], 502);
        }
    }

    /**
     * Check the status of a verification transaction.
     */
    public function status(string $transactionId): JsonResponse
    {
        try {
            $verifierUrl = config('services.eudi_verifier.url');

            $response = Http::timeout(10)
                ->connectTimeout(5)
                ->get("{$verifierUrl}/ui/presentations/{$transactionId}");

            if (in_array($response->status(), [400, 404], true)) {
                return response()->json(['status' => 'pending']);
            }

            $response->throw();

            logger()->info('Verification status response', [
                'transactionId' => $transactionId,
                'response' => $response->json(),
            ]);

            $data = $response->json();

            if (isset($data['vp_token']) && is_array($data['vp_token'])) {
                $data['verified_claims'] = $this->decodeCborVpToken($data['vp_token']);
            }

            return response()->json($data);
        } catch (RequestException $exception) {
            $error = $exception->response?->json('error')
                ?? $exception->response?->json('message')
                ?? 'Failed to fetch verification status.';

            return response()->json([
                'message' => 'The verifier rejected the verification status request.',
                'error' => $error,
            ], 502);
        }
    }

    /**
     * Build a DCQL query based on the verification type.
     *
     * @return array<string, mixed>
     */
    private function buildDcqlQuery(string $type): array
    {
        $nonce = Str::uuid()->toString();

        $credentials = match ($type) {
            'pid' => $this->pidQuery('query_0'),
            'mdl' => $this->mdlQuery('query_0'),
            'age' => $this->ageQuery('query_0'),
            'pid_mdl' => [
                ...$this->pidQuery('query_0'),
                ...$this->mdlQuery('query_1'),
            ],
        };

        return [
            'nonce' => $nonce,
            'request_uri_method' => 'get',
            'dcql_query' => [
                'credentials' => $credentials,
            ],
            'profile' => 'openid4vp',
        ];
    }

    /**
     * PID query for hotel booking — requests identity document data.
     *
     * @return list<array<string, mixed>>
     */
    private function pidQuery(string $queryId): array
    {
        return [
            [
                'id' => $queryId,
                'format' => 'mso_mdoc',
                'meta' => [
                    'doctype_value' => 'eu.europa.ec.eudi.pid.1',
                ],
                'claims' => [
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'family_name'], 'intent_to_retain' => false],
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'given_name'], 'intent_to_retain' => false],
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'birth_date'], 'intent_to_retain' => false],
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'nationality'], 'intent_to_retain' => false],
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'document_number'], 'intent_to_retain' => false],
                    ['path' => ['eu.europa.ec.eudi.pid.1', 'resident_address'], 'intent_to_retain' => false],
                ],
            ],
        ];
    }

    /**
     * MDL query for car rental — requests driving licence data.
     *
     * @return list<array<string, mixed>>
     */
    private function mdlQuery(string $queryId): array
    {
        return [
            [
                'id' => $queryId,
                'format' => 'mso_mdoc',
                'meta' => [
                    'doctype_value' => 'org.iso.18013.5.1.mDL',
                ],
                'claims' => [
                    ['path' => ['org.iso.18013.5.1', 'family_name'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'given_name'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'birth_date'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'driving_privileges'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'document_number'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'expiry_date'], 'intent_to_retain' => false],
                    ['path' => ['org.iso.18013.5.1', 'issue_date'], 'intent_to_retain' => false],
                ],
            ],
        ];
    }

    /**
     * Age verification query for shop — requests only age_over_18.
     *
     * @return list<array<string, mixed>>
     */
    private function ageQuery(string $queryId): array
    {
        return [
            [
                'id' => $queryId,
                'format' => 'mso_mdoc',
                'meta' => [
                    'doctype_value' => 'org.iso.18013.5.1.mDL',
                ],
                'claims' => [
                    ['path' => ['org.iso.18013.5.1', 'age_over_18'], 'intent_to_retain' => false],
                ],
            ],
        ];
    }

    /**
     * Decode a vp_token containing base64url-encoded CBOR ISO 18013-5 mdoc documents.
     * Returns a map of queryId → [elementIdentifier => elementValue] extracted from each document.
     *
     * @param  array<string, mixed>  $vpToken
     * @return array<string, array<string, mixed>>
     */
    private function decodeCborVpToken(array $vpToken): array
    {
        $decoder = Decoder::create();
        $claims = [];

        foreach ($vpToken as $queryId => $documents) {
            if (! is_array($documents)) {
                continue;
            }

            foreach ($documents as $encodedDoc) {
                if (! is_string($encodedDoc)) {
                    continue;
                }

                $bytes = base64_decode(strtr($encodedDoc, '-_', '+/'), true);

                if ($bytes === false) {
                    continue;
                }

                try {
                    $deviceResponse = $decoder->decode(StringStream::create($bytes))->normalize();
                } catch (\Throwable) {
                    continue;
                }

                if (! is_array($deviceResponse) || ! isset($deviceResponse['documents'])) {
                    continue;
                }

                foreach ($deviceResponse['documents'] as $doc) {
                    if (! is_array($doc) || ! isset($doc['issuerSigned']['nameSpaces'])) {
                        continue;
                    }

                    foreach ($doc['issuerSigned']['nameSpaces'] as $items) {
                        if (! is_array($items)) {
                            continue;
                        }

                        foreach ($items as $item) {
                            // IssuerSignedItems are tag-24 wrapped CBOR byte strings — not Normalizable
                            if ($item instanceof Tag) {
                                $innerBytes = $item->getValue()->normalize();

                                try {
                                    $item = $decoder->decode(StringStream::create($innerBytes))->normalize();
                                } catch (\Throwable) {
                                    continue;
                                }
                            }

                            if (is_array($item) && isset($item['elementIdentifier'], $item['elementValue'])) {
                                $claims[(string) $queryId][$item['elementIdentifier']] = $item['elementValue'];
                            }
                        }
                    }
                }
            }
        }

        return $claims;
    }
}
