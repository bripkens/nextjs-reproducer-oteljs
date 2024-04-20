"use client";

import {useEffect} from "react";

import {getWebAutoInstrumentations} from "@opentelemetry/auto-instrumentations-web";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {browserDetector} from "@opentelemetry/opentelemetry-browser-detector";
import {detectResourcesSync, Resource} from "@opentelemetry/resources";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";
import {WebTracerProvider} from "@opentelemetry/sdk-trace-web";
import {SEMRESATTRS_SERVICE_NAME} from "@opentelemetry/semantic-conventions";

export default function InstrumentationWeb() {
    useEffect(initInstrumentationWeb, []);

    return null;
}

function initInstrumentationWeb() {
    const provider = new WebTracerProvider({
        resource: detectResourcesSync({detectors: [browserDetector]})
                .merge(new Resource({
                    [SEMRESATTRS_SERVICE_NAME]: window.location.hostname,
                })),
    });

    provider.addSpanProcessor(
            new BatchSpanProcessor(new OTLPTraceExporter({
                url: "/",
                headers: {},
                concurrencyLimit: 10
            }), {
                maxQueueSize: 100,
                maxExportBatchSize: 10,
                scheduledDelayMillis: 500,
                exportTimeoutMillis: 30000,
            })
    );

    registerInstrumentations({
        instrumentations: [
            getWebAutoInstrumentations({
                "@opentelemetry/instrumentation-xml-http-request": {
                    clearTimingResources: true,
                },
            }),
        ],
    });
}