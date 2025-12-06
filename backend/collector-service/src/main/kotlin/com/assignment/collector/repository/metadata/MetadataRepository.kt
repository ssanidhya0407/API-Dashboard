package com.assignment.collector.repository.metadata

import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Document(collection = "api_issues")
data class ApiIssue(
    @Id val id: String? = null,
    val endpoint: String,
    val serviceName: String,
    val type: IssueType, // SLOW, BROKEN, RATE_LIMIT
    val status: IssueStatus = IssueStatus.OPEN,
    val firstSeen: Instant = Instant.now(),
    val lastSeen: Instant = Instant.now(),
    val count: Long = 1,
    @Version val version: Long? = null // Optimistic Locking
)

enum class IssueType { SLOW, BROKEN, RATE_LIMIT }
enum class IssueStatus { OPEN, RESOLVED, IGNORED }

@Repository
interface MetadataRepository : MongoRepository<ApiIssue, String> {
    fun findByEndpointAndServiceNameAndType(endpoint: String, serviceName: String, type: IssueType): ApiIssue?
}
