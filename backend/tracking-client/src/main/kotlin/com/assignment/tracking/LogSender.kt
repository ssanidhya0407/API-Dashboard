package com.assignment.tracking

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.scheduling.annotation.Async
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

interface LogSender {
    fun sendLog(log: ApiLog)
}

@Service
class RestLogSender(
    @Value("\${monitoring.collector.url:http://localhost:8080}") private val collectorUrl: String
) : LogSender {
    
    private val restClient = RestClient.create(collectorUrl)
    private val logger = LoggerFactory.getLogger(RestLogSender::class.java)

    @Async
    override fun sendLog(log: ApiLog) {
        try {
            restClient.post()
                .uri("/logs")
                .body(log)
                .retrieve()
                .toBodilessEntity()
        } catch (e: Exception) {
            logger.error("Failed to send log to collector: ${e.message}")
        }
    }
}
