package com.assignment.collector.repository.logs

import com.assignment.tracking.ApiLog
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface LogRepository : MongoRepository<ApiLog, String> {
    // Add custom queries if needed
}
