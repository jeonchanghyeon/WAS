package com.please.controller.api

import com.please.service.DistribService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/distribs")
class DistribController {
    @Autowired
    private lateinit var distribService: DistribService

    /* result -> [{id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping
    fun getDistribList(@RequestParam id: Long): Any {
        return distribService.getDistributors(id)
    }
}