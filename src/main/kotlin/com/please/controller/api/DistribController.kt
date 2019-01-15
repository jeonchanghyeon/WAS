package com.please.controller.api

import com.please.persistence.getAuthInfo
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
    fun getDistribList(@RequestParam(required = false) id: Long?,
                     @RequestParam(required = false) group: Int?): MutableList<Map<String, Any?>>? {
        val distribs: MutableList<Map<String, Any?>>?
        if (id == null || group == null) {
            val authInfo = getAuthInfo()!!
            distribs = distribService.getDistributors(authInfo.id, authInfo.group) ?: mutableListOf()
        } else {
            distribs = distribService.getDistributors(id, group) ?: mutableListOf()
        }
        if (distribs.size != 1) {
            distribs.add(0, mapOf("id" to -1, "name" to "--"))
        }
        return distribs
    }
}