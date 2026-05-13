export type VerificationType = 'pid' | 'mdl' | 'age' | 'pid_mdl';

export interface InitializedTransaction {
    client_id: string;
    request_uri: string;
    request_uri_method: string;
    transaction_id: string;
}

export interface VerificationAttribute {
    key: string;
    value: string;
}

const verificationLabels: Record<string, string> = {
    birth_date: 'Birth Date',
    nationality: 'Nationality',
    resident_address: 'Address',
    document_number: 'Document Number',
    issue_date: 'Licence Issued',
    expiry_date: 'Licence Expires',
    driving_privileges: 'Driving Privileges',
};

export async function initVerification(
    type: VerificationType,
): Promise<InitializedTransaction> {
    const response = await fetch('/api/verification/init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCSRFToken(),
            Accept: 'application/json',
        },
        body: JSON.stringify({ type }),
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);

        throw new Error(
            payload?.error ??
                payload?.message ??
                `Verification init failed: ${response.statusText}`,
        );
    }

    return response.json();
}

export async function pollVerificationStatus(
    transactionId: string,
): Promise<Record<string, unknown>> {
    const response = await fetch(
        `/api/verification/${encodeURIComponent(transactionId)}/status`,
        {
            headers: {
                Accept: 'application/json',
            },
        },
    );

    if (!response.ok) {
        const payload = await response.json().catch(() => null);

        throw new Error(
            payload?.error ??
                payload?.message ??
                `Status check failed: ${response.statusText}`,
        );
    }

    return response.json();
}

export function buildWalletUri(transaction: InitializedTransaction): string {
    return `openid4vp://?client_id=${encodeURIComponent(transaction.client_id)}&request_uri=${encodeURIComponent(transaction.request_uri)}`;
}

function getCSRFToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');

    return meta?.getAttribute('content') ?? '';
}

export function isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function extractVerificationAttributes(
    payload: Record<string, unknown>,
): VerificationAttribute[] {
    const verifiedClaims = payload.verified_claims;

    if (!isRecord(verifiedClaims)) {
        return [];
    }

    // Merge claims from all query results into a single flat map
    const flatClaims: Record<string, unknown> = {};

    for (const queryClaims of Object.values(verifiedClaims)) {
        if (isRecord(queryClaims)) {
            Object.assign(flatClaims, queryClaims);
        }
    }

    const givenName = stringifyVerificationValue(flatClaims.given_name);
    const familyName = stringifyVerificationValue(flatClaims.family_name);
    const fullName = [givenName, familyName].filter(Boolean).join(' ');

    const attributes: VerificationAttribute[] = [];

    if (fullName) {
        attributes.push({
            key: 'Full Name',
            value: fullName,
        });
    }

    for (const attributeKey of [
        'birth_date',
        'nationality',
        'resident_address',
        'document_number',
        'issue_date',
        'expiry_date',
    ]) {
        const value = stringifyVerificationValue(flatClaims[attributeKey]);

        if (value) {
            attributes.push({
                key: verificationLabels[attributeKey],
                value,
            });
        }
    }

    const drivingPrivileges = stringifyDrivingPrivileges(
        flatClaims.driving_privileges,
    );

    if (drivingPrivileges) {
        attributes.push({
            key: verificationLabels.driving_privileges,
            value: drivingPrivileges,
        });
    }

    return attributes;
}

function stringifyVerificationValue(value: unknown): string {
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => stringifyVerificationValue(item))
            .filter(Boolean)
            .join(', ');
    }

    return '';
}

function stringifyDrivingPrivileges(value: unknown): string {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (!isRecord(item)) {
                    return stringifyVerificationValue(item);
                }

                const category = stringifyVerificationValue(
                    item.vehicle_category_code,
                );
                const issued = stringifyVerificationValue(item.issue_date);
                const expires = stringifyVerificationValue(item.expiry_date);
                const pieces = [category];

                if (issued) {
                    pieces.push(`issued ${issued}`);
                }

                if (expires) {
                    pieces.push(`expires ${expires}`);
                }

                return pieces.filter(Boolean).join(' · ');
            })
            .filter(Boolean)
            .join(', ');
    }

    return stringifyVerificationValue(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}
