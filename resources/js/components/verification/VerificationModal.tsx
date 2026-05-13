import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    buildWalletUri,
    initVerification,
    isMobileDevice,
    pollVerificationStatus,
} from '@/lib/verification';
import type {
    InitializedTransaction,
    VerificationType,
} from '@/lib/verification';

type VerificationState =
    | 'idle'
    | 'loading'
    | 'ready'
    | 'polling'
    | 'success'
    | 'error';

interface VerificationModalProps {
    open: boolean;
    type: VerificationType;
    title: string;
    description: string;
    onVerified: (data: Record<string, unknown>) => void;
    onClose: () => void;
}

export default function VerificationModal({
    open,
    type,
    title,
    description,
    onVerified,
    onClose,
}: VerificationModalProps) {
    const [state, setState] = useState<VerificationState>('idle');
    const [transaction, setTransaction] =
        useState<InitializedTransaction | null>(null);
    const [error, setError] = useState<string>('');
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(true);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    const startVerification = useCallback(async () => {
        setState('loading');
        setError('');

        try {
            const result = await initVerification(type);

            if (!mountedRef.current) {
                return;
            }

            setTransaction(result);
            setState('ready');

            // Start polling
            setState('polling');
            pollingRef.current = setInterval(async () => {
                try {
                    const status = await pollVerificationStatus(
                        result.transaction_id,
                    );

                    if (!mountedRef.current) {
                        return;
                    }

                    if (
                        status &&
                        !('status' in status && status.status === 'pending')
                    ) {
                        stopPolling();
                        setState('success');
                        onVerified(status);
                    }
                } catch (err) {
                    if (!mountedRef.current) {
                        return;
                    }

                    stopPolling();
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to check verification status',
                    );
                    setState('error');
                }
            }, 2500);
        } catch (err) {
            if (!mountedRef.current) {
                return;
            }

            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to initialize verification',
            );
            setState('error');
        }
    }, [type, onVerified, stopPolling]);

    useEffect(() => {
        mountedRef.current = true;

        if (open) {
            startVerification();
        }

        return () => {
            mountedRef.current = false;
            stopPolling();
        };
    }, [open, startVerification, stopPolling]);

    const handleClose = () => {
        stopPolling();
        setState('idle');
        setTransaction(null);
        onClose();
    };

    if (!open) {
        return null;
    }

    const walletUri = transaction ? buildWalletUri(transaction) : '';
    const mobile = isMobileDevice();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center">
                    {state === 'loading' && (
                        <div className="flex flex-col items-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                            <p className="mt-4 text-sm text-gray-500">
                                Initializing verification...
                            </p>
                        </div>
                    )}

                    {(state === 'ready' || state === 'polling') &&
                        transaction && (
                            <div className="flex flex-col items-center">
                                {/* EU Digital Identity badge */}
                                <div className="mb-4 flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                                    <svg
                                        className="h-5 w-5 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-blue-700">
                                        EU Digital Identity Wallet
                                    </span>
                                </div>

                                {!mobile && (
                                    <>
                                        <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                                            <QRCodeSVG
                                                value={walletUri}
                                                size={220}
                                                level="M"
                                            />
                                        </div>
                                        <p className="mt-3 text-center text-sm text-gray-500">
                                            Scan with your EU Digital Identity
                                            Wallet
                                        </p>
                                    </>
                                )}

                                {mobile && (
                                    <a
                                        href={walletUri}
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                            />
                                        </svg>
                                        Open EU Wallet
                                    </a>
                                )}

                                {state === 'polling' && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                                        <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400" />
                                        Waiting for wallet response...
                                    </div>
                                )}
                            </div>
                        )}

                    {state === 'success' && (
                        <div className="flex flex-col items-center py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </div>
                            <p className="mt-4 text-lg font-semibold text-green-700">
                                Verification Complete
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Your identity has been verified successfully.
                            </p>
                        </div>
                    )}

                    {state === 'error' && (
                        <div className="flex flex-col items-center py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-8 w-8 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <p className="mt-4 text-lg font-semibold text-red-700">
                                Verification Failed
                            </p>
                            <p className="mt-1 text-center text-sm text-gray-500">
                                {error}
                            </p>
                            <button
                                onClick={startVerification}
                                className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="text-center text-xs text-gray-400">
                        Powered by IdentID
                    </p>
                </div>
            </div>
        </div>
    );
}
