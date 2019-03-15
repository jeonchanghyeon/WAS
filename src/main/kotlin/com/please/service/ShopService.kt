package com.please.service

import com.please.dataAccess.ShopDAO
import com.please.exception.InvalidValueException
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class ShopService {
    @Autowired
    private lateinit var shopDAO: ShopDAO
    @Autowired
    private lateinit var branchService: BranchService
    @Autowired
    private lateinit var userService: UserService

    fun searchList(branchId: Long, data: MutableMap<String, Any>): String {
        val shopName: String? = data["shop-name"] as? String
        val pageIndex: Int? = (data["page-index"] as? String)?.toInt()

        val info = JSONObject()
        info.put("shopName", shopName)
        info.put("pageIndex", pageIndex)

        return shopDAO.searchShopList(branchId, info)
    }

    fun getShops(id: Long, name: String?): MutableList<Map<String, Any?>> {
        val info = JSONObject()
        info.put("id", id)
        info.put("name", name)
        return shopDAO.getShops(info.toString())
    }

    fun getMenuList(authKey: String, shopId: Long): String {
        val menuInfo = JSONObject(shopDAO.getMenuItems(authKey, shopId))
        val result = JSONObject()
        val menuList = JSONArray()

        var tmp = menuInfo["menu"] as JSONArray
        val queue = ArrayDeque<JSONArray>()
        queue.add(tmp)

        while (queue.isNotEmpty()) {
            tmp = queue.poll()

            for (i in 0 until tmp.length()) {
                val json = tmp[i] as JSONObject

                if (!json.has("lowItems")) {
                    menuList.put(json)
                } else {
                    queue.add(json["lowItems"] as JSONArray)
                }
            }
        }

        result.put("resultCode", menuInfo["resultCode"])
        result.put("description", menuInfo["description"])
        result.put("menu", menuList)

        return result.toString()
    }

    @Throws(InvalidValueException::class)
    fun getDeliveryCostByDistance(authKey: String, id: Long, distance: Double): Int {
        var cost: Int
        val jsonData = JSONObject(shopDAO.getDeliveryCostByDistance(authKey, id))
        val costByDistance = jsonData["costByDistance"] as JSONArray
        var distanceFactor = jsonData["distanceFactor"]
        when (distanceFactor) {
            is Double -> {
            }
            is Int -> {
                distanceFactor = distanceFactor.toDouble()
            }
            is String -> {
                distanceFactor = distanceFactor.toDouble()
            }
            else -> throw InvalidValueException("distanceFactor type mismatch (distanceFactor: $distanceFactor)")
        }
        var old = 0.0
        var top = 0
        val target = distance * distanceFactor

        val size = costByDistance.length()
        for (i in 0 until size) {
            val json = costByDistance[i] as JSONObject
            if (json.has("cost") && json.has("distance")) {
                val dist = json["distance"] as Double
                cost = json["cost"] as Int

                if (target >= old && target < dist) return cost
                if (top < cost) top = cost
                old = dist
            }
        }
        return top
    }

    fun getDeliveryCostByDong(authKey: String, id: Long, jibun: String): Int {
        val jsonData = JSONObject(shopDAO.getDeliveryCostByDong(authKey, id))
        val costByDong = jsonData["costByDong"] as JSONArray
        var cost: Int = 0

        val jibunList = jibun.split(" ")
        val size = costByDong.length()
        for (i in 0 until size) {
            val json = costByDong[i] as JSONObject
            val siDo = json["siDo"] as String
            val siGunGu = json["siGunGu"] as String
            val eubMyeonDong = json["eubMyeonDong"] as String

            if (siDo.contains(jibunList[0]) && siGunGu.contains(jibunList[1]) && eubMyeonDong.contains(jibunList[2])) {
                cost = json["cost"] as Int
                break
            }
        }

        return cost
    }

    @Throws(InvalidValueException::class)
    fun getDeliveryChargeSet(authKey: String, shopId: Long, distance: Double?, jibun: String): String {
        val result = JSONObject()
        var cost = 0

        val branchId = branchService.getBranches(shopId, null)[0]["id"] as Long
        val branchSettings = JSONObject(branchService.getBranchSettings(authKey, branchId))["branchSettings"] as JSONObject
        val userInfo = JSONObject(userService.getUserInfo(authKey, shopId))["user"] as JSONObject
        val shopExtraCharge = (userInfo["additional"] as JSONObject)["extraCharge"] as JSONObject
        val deliveryCostBaseType = (userInfo["additional"] as JSONObject)["deliveryCostBaseType"] as Int

        cost = when (deliveryCostBaseType) {
            1 -> {
                getDeliveryCostByDistance(authKey, shopId, distance!!)
            }
            2 -> {
                getDeliveryCostByDong(authKey, shopId, jibun)
            }
            else -> throw InvalidValueException("deliveryCostBaseType value problem (deliveryCostBaseType: $deliveryCostBaseType)")
        }

        val deliveryAdditionalCost = (cost * (branchSettings["extraChargePercent"] as Double)).toInt()
        val branchExtraCharge = branchSettings["extraCharge"] as Int

        val isUseDayOfWeek = shopExtraCharge["isUseDayOfWeek"] as Boolean
        val isUseTime = shopExtraCharge["isUseTime"] as Boolean
        val isUseDong = (userInfo["additional"] as JSONObject)["isUseDong"] as Boolean

        var weekDayExtraCharge = 0
        var timeExtraCharge = 0
        var dongExtraCharge = 0

        val cal = Calendar.getInstance()
        val curDayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - 1
        val dayOfWeekArray = arrayListOf("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")

        if (isUseDayOfWeek) {
            val byDayOfWeek = shopExtraCharge["byDayOfWeek"] as JSONObject
            val dayOfWeek = byDayOfWeek["dayOfWeek"] as JSONArray
            val size = dayOfWeek.length()
            for (i in 0 until size) {
                if (dayOfWeekArray[curDayOfWeek].compareTo(dayOfWeek[i] as String) == 0) {
                    weekDayExtraCharge = byDayOfWeek["cost"] as Int
                    break
                }
            }
        }
        if (isUseTime) {
            val byTime = shopExtraCharge["byTime"] as JSONObject
            val startTimeStr = byTime["startTime"] as String
            val endTimeStr = byTime["endTime"] as String
            val startTime = startTimeStr.substring(0..1).toInt() * 60 + startTimeStr.substring(3..4).toInt()
            val endTime = endTimeStr.substring(0..1).toInt() * 60 + endTimeStr.substring(3..4).toInt()
            val curTime = cal.get(Calendar.HOUR) * 60 + cal.get(Calendar.HOUR)

            if (curTime in startTime until endTime) {
                timeExtraCharge = byTime["cost"] as Int
            }
        }
        if (deliveryCostBaseType == 1 && isUseDong) {
            dongExtraCharge = getDeliveryCostByDong(authKey, shopId, jibun)
        }
        val sum = cost + deliveryAdditionalCost + branchExtraCharge + weekDayExtraCharge + timeExtraCharge

        val extraCharge: MutableList<Map<String, Any>> = mutableListOf()
        if (isUseDayOfWeek) extraCharge.add(mapOf("cost" to weekDayExtraCharge, "label" to "요일할증"))
        if (isUseTime) extraCharge.add(mapOf("cost" to timeExtraCharge, "label" to "시간할증"))
        if (branchExtraCharge != 0) extraCharge.add(mapOf("cost" to branchExtraCharge, "label" to "지사할증"))
        if (deliveryAdditionalCost != 0) extraCharge.add(mapOf("cost" to deliveryAdditionalCost, "label" to "지사할증(%)"))
        if (deliveryCostBaseType == 1 && isUseDong) extraCharge.add(mapOf("cost" to dongExtraCharge, "label" to "동별할증"))

        result.put("resultCode", 0)
        result.put("description", "성공적으로 수행했습니다.")
        result.put("deliveryCostBaseType", deliveryCostBaseType)
        result.put("deliveryCost", cost)
        result.put("extraCharge", extraCharge)
        result.put("deliveryCostSum", sum)
        return result.toString()
    }
}
