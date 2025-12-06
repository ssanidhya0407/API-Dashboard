package com.assignment.collector.service

import com.assignment.collector.repository.logs.LogRepository
import com.assignment.collector.repository.metadata.ApiIssue
import com.assignment.collector.repository.metadata.IssueType
import com.assignment.collector.repository.metadata.MetadataRepository
import com.assignment.tracking.ApiLog
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class CollectorService(
    private val logRepository: LogRepository,
    private val metadataRepository: MetadataRepository,
    @org.springframework.beans.factory.annotation.Qualifier("primaryMongoTemplate") private val logsTemplate: org.springframework.data.mongodb.core.MongoTemplate
) {

    fun getDashboardStats(): com.assignment.collector.dto.DashboardStats {
        val totalRequests = logRepository.count()
        
        // Avg Latency
        val agg = org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(
            org.springframework.data.mongodb.core.aggregation.Aggregation.group().avg("latencyMs").`as`("avgLatency")
        )
        val results = logsTemplate.aggregate(agg, "apiLog", Map::class.java)
        val avgLatency = if (results.mappedResults.isNotEmpty()) {
             (results.mappedResults[0]["avgLatency"] as? Number)?.toDouble() ?: 0.0
        } else 0.0

        val activeServices = logsTemplate.findDistinct("serviceName", ApiLog::class.java, String::class.java).size.toLong()
        val activeAlerts = metadataRepository.findAll().filter { it.status == com.assignment.collector.repository.metadata.IssueStatus.OPEN }.size.toLong()

        // Real History Calculation
        val recentLogsOptions = org.springframework.data.domain.PageRequest.of(0, 500, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "timestamp"))
        val recentLogs = logRepository.findAll(recentLogsOptions).content.reversed()

        val formatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm").withZone(java.time.ZoneId.systemDefault())

        val historyMap = recentLogs.groupBy { formatter.format(it.timestamp) }
        
        val requestHistory = historyMap.map { (time, logs) ->
            com.assignment.collector.dto.TimeSeriesData(time, logs.size)
        }

        val latencyHistory = historyMap.map { (time, logs) ->
             com.assignment.collector.dto.TimeSeriesData(time, logs.map { it.latencyMs }.average().toInt())
        }
        
        // Top Slow Endpoints
        val topSlowEndpoints = recentLogs
            .groupBy { "${it.method} ${it.endpoint}" }
            .map { (key, logs) -> 
                val parts = key.split(" ")
                com.assignment.collector.dto.EndpointStats(parts[0], parts[1], logs.map { it.latencyMs }.average().toInt())
            }
            .sortedByDescending { it.avgLatency }
            .take(3)

        // System Status (Discovery)
        val services = logsTemplate.findDistinct("serviceName", ApiLog::class.java, String::class.java)
        val systemStatus = services.map { name ->
             com.assignment.collector.dto.ServiceHealth(name, "Operational")
        }

        return com.assignment.collector.dto.DashboardStats(
            totalRequests = totalRequests,
            avgLatency = (avgLatency * 100).toInt() / 100.0,
            activeServices = activeServices,
            activeAlerts = activeAlerts,
            requestHistory = requestHistory,
            latencyHistory = latencyHistory,
            topSlowEndpoints = topSlowEndpoints,
            systemStatus = systemStatus
        )
    }

    fun getIssues(): List<ApiIssue> {
        return metadataRepository.findAll()
    }

    fun getLogs(): List<ApiLog> {
        return logRepository.findAll()
    }


    fun ingestLog(log: ApiLog) {
        logRepository.save(log)
        checkForIssues(log)
    }

    private fun checkForIssues(log: ApiLog) {
        val issues = mutableListOf<IssueType>()

        if (log.latencyMs > 500) {
            issues.add(IssueType.SLOW)
        }
        if (log.statusCode >= 500) {
            issues.add(IssueType.BROKEN)
        }
        if (log.tags.containsKey("event") && log.tags["event"] == "rate-limit-hit") {
            issues.add(IssueType.RATE_LIMIT)
        }

        issues.forEach { type ->
            updateMetadata(log, type)
        }
    }

    @Synchronized 
    fun updateMetadata(log: ApiLog, type: IssueType) {
        val existing = metadataRepository.findByEndpointAndServiceNameAndType(log.endpoint, log.serviceName, type)

        if (existing != null) {
            val updated = existing.copy(
                lastSeen = log.timestamp,
                count = existing.count + 1
            )
            try {
                metadataRepository.save(updated)
            } catch (e: Exception) {
            }
        } else {
            val newIssue = ApiIssue(
                endpoint = log.endpoint,
                serviceName = log.serviceName,
                type = type,
                firstSeen = log.timestamp,
                lastSeen = log.timestamp
            )
            try {
                metadataRepository.save(newIssue)
            } catch (e: Exception) {
            }
        }
    }

    fun resolveIssue(id: String) {
        val issue = metadataRepository.findById(id).orElseThrow { RuntimeException("Issue not found") }
        val resolved = issue.copy(
            status = com.assignment.collector.repository.metadata.IssueStatus.RESOLVED,
            lastSeen = Instant.now()
        )
        metadataRepository.save(resolved)
    }
}
