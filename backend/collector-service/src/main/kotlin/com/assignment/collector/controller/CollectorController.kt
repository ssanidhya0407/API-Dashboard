package com.assignment.collector.controller

import com.assignment.collector.service.CollectorService
import com.assignment.tracking.ApiLog
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/logs")
@org.springframework.web.bind.annotation.CrossOrigin(origins = ["*"]) // Allow all for dev
class CollectorController(
    private val collectorService: CollectorService
) {

    @GetMapping("/dashboard/stats")
    fun getStats(): com.assignment.collector.dto.DashboardStats {
        return collectorService.getDashboardStats()
    }

    @GetMapping("/issues")
    fun getIssues(): List<com.assignment.collector.repository.metadata.ApiIssue> {
        return collectorService.getIssues()
    }

    @GetMapping
    fun getLogs(): List<ApiLog> {
        return collectorService.getLogs()
    }


    @PostMapping
    fun ingestLog(@RequestBody log: ApiLog) {
        collectorService.ingestLog(log)
    }

    @PostMapping("/issues/{id}/resolve")
    fun resolveIssue(@org.springframework.web.bind.annotation.PathVariable id: String) {
        collectorService.resolveIssue(id)
    }
}
