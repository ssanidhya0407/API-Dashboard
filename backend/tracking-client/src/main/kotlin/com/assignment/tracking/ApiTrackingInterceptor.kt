package com.assignment.tracking

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.ModelAndView
import java.time.Instant
import org.slf4j.LoggerFactory

@Component
class ApiTrackingInterceptor(
    private val rateLimiter: RateLimiter,
    @Value("\${spring.application.name:unknown-service}") private val serviceName: String
    // In a real app we would inject a LogSender here
) : HandlerInterceptor {

    private val logger = LoggerFactory.getLogger(ApiTrackingInterceptor::class.java)

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        request.setAttribute("startTime", System.currentTimeMillis())
        
        if (rateLimiter.isRateLimited()) {
            request.setAttribute("rateLimitHit", true)
            logger.warn("Rate limit hit for service: $serviceName")
             // "The request should still continue normally" - Requirement
        }
        
        return true
    }

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        val startTime = request.getAttribute("startTime") as Long
        val duration = System.currentTimeMillis() - startTime
        
        val isRateLimitHit = request.getAttribute("rateLimitHit") == true
        
        val log = ApiLog(
            serviceName = serviceName,
            endpoint = request.requestURI,
            method = request.method,
            requestSize = request.contentLengthLong, // This might be -1 if not set
            responseSize = 0, // Servlet response doesn't easily expose size unless wrapped
            statusCode = response.status,
            timestamp = Instant.now(),
            latencyMs = duration,
            tags = if (isRateLimitHit) mapOf("event" to "rate-limit-hit") else emptyMap()
        )
        
        // TODO: Send to collector asynchronously
        logger.info("Captured API Log: $log")
    }
}
