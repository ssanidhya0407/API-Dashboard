package com.assignment.collector.dto

data class DashboardStats(
    val totalRequests: Long,
    val avgLatency: Double,
    val activeServices: Long,
    val activeAlerts: Long,
    val requestHistory: List<TimeSeriesData>,
    val latencyHistory: List<TimeSeriesData>,
    val topSlowEndpoints: List<EndpointStats>,
    val systemStatus: List<ServiceHealth>
)

data class TimeSeriesData(
    val time: String,
    val value: Number
)

data class EndpointStats(
    val method: String,
    val endpoint: String,
    val avgLatency: Int
)

data class ServiceHealth(
    val name: String,
    val status: String // "Operational", "Degraded", "Down"
)
