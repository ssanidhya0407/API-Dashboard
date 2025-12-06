package com.assignment.tracking

import java.time.Instant

data class ApiLog(
    val serviceName: String,
    val endpoint: String,
    val method: String,
    val requestSize: Long,
    val responseSize: Long,
    val statusCode: Int,
    val timestamp: Instant,
    val latencyMs: Long,
    val tags: Map<String, String> = emptyMap() // For things like "rate-limit-hit"
)
