package com.assignment.tracking

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong

@Component
class RateLimiter(
    @Value("\${monitoring.rateLimit.limit:100}") private val limit: Int
) {
    private val requestCounts = ConcurrentHashMap<Long, AtomicInteger>()
    
    // Simple windowing: key is current second epoch
    
    fun isRateLimited(): Boolean {
        val currentSecond = System.currentTimeMillis() / 1000
        requestCounts.entries.removeIf { it.key < currentSecond } // Clean up old entries
        
        val counter = requestCounts.computeIfAbsent(currentSecond) { AtomicInteger(0) }
        val count = counter.incrementAndGet()
        
        return count > limit
    }
}
