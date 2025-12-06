package com.assignment.collector.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@org.springframework.web.bind.annotation.CrossOrigin(origins = ["*"])
class HomeController {

    @GetMapping("/")
    fun home(): Map<String, String> {
        return mapOf(
            "status" to "online",
            "service" to "Collector Service",
            "version" to "1.0.0"
        )
    }
}
