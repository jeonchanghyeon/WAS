package com.please.controller.api

import com.please.persistence.getAuthInfo
import com.please.service.ShopService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/shops")
class ShopController {
    @Autowired
    private lateinit var shopService: ShopService

    /* result -> {resultCode: 0, shops: {id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping
    fun searchShops(@RequestParam(value = "branch-id") branchId: Long,
                    @RequestParam data: MutableMap<String, Any>): Any {
        /* shop-name, page-index */
        return shopService.searchList(branchId, data)
    }

    /* result -> [{id1, name1}, {id2, name2}, ....{id11, name11}]*/
    @GetMapping(value = ["list"])
    fun getShopList(@RequestParam id: Long,
                    @RequestParam(required = false) name: String?): Any {
        return shopService.getShops(id, name)
    }

    /*
    * result -> {"resultCode", "description",
    *            "menu": [  {"price":500,"label":"메뉴1"},
    *                       {"price":5000,"label":"메뉴2"},
    *                       {"price":50000,"label":"메뉴3"}  ]
    *            }
    * */
    @GetMapping(value = ["{id}/menu-list"])
    fun getMenuList(@PathVariable id: Long): Any {
        val authInfo = getAuthInfo()
        return shopService.getMenuList(authInfo.authKey, id)
    }

    // { "resultCode", "deliveryCostBaseType": (거리별: 1, 동별: 2), "description", "deliveryCost", "extraCharge": [{"label,"cost"}, {"label,"cost"} ..], "deliveryCostSum" }
    @GetMapping(value = ["{id}/delivery-cost"])
    fun getDeliveryCost(@PathVariable id: Long,
                        @RequestParam(required = false) distance: Double?,
                        @RequestParam jibun: String): Any {   //jibun = 시도 시건구 읍면동 ex)부산 금정구 온천동
        val authInfo = getAuthInfo()

        return shopService.getDeliveryChargeSet(authInfo.authKey, id, distance, jibun)
    }
}