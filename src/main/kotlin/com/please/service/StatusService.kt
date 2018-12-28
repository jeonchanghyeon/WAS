package com.please.service

import com.please.dataAccess.StatusDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.Timestamp

@Service
class StatusService {
    @Autowired
    private lateinit var statusDAO: StatusDAO

    fun getDistributors(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        return statusDAO.getDistributor(authInfo)
    }

    fun getBranchs(authInfo: AuthInfo, distributeId: Long): MutableList<Map<String, Any?>>? {
        return statusDAO.getBranchs(authInfo, distributeId)
    }

    fun searchOrdersInfo(authInfo: AuthInfo, data: MutableMap<String, Any>, paymentTypes: MutableList<Int>, orderStatusIds: MutableList<Int>): JSONArray? {
        val condition = Condition(
                data["branch-id"] as String,
                data["id"] as String?,
                data["shop-name"] as String?,
                data["rider-name"] as String?,
                orderStatusIds,
                paymentTypes,
                data["is-shared"] as Boolean?,
                Timestamp.valueOf(data["start-date"] as String? ?: "1000-01-01 00:00:00"),
                Timestamp.valueOf(data["end-data"] as String? ?: "9999-12-31 23:59:59"),
                data["page-Index"] as Long?
        )

        val id = if (condition.id != null) condition.id.toLongOrNull() ?: -1 else null
        val orderSet = if(orderStatusIds.isNotEmpty()) orderStatusIds else mutableListOf(-1)
        val paymentSet = if(paymentTypes.isNotEmpty()) paymentTypes else mutableListOf(-1)

        val conditionJSONObject = JSONObject()
        conditionJSONObject.put("id", id)
        conditionJSONObject.put("shopName", condition.shopName)
        conditionJSONObject.put("riderName", condition.riderName)
        conditionJSONObject.put("orderStatusIds", orderSet)
        conditionJSONObject.put("paymentTypes", paymentSet)
        conditionJSONObject.put("isShared", condition.isShared)
        conditionJSONObject.put("dateType", "create")
        conditionJSONObject.put("startDate", condition.startDate)
        conditionJSONObject.put("endDate", condition.endDate)
        conditionJSONObject.put("pageIndex", condition.pageIndex)

        try {
            val ordersResult = statusDAO.searchOrders(condition.branchId, conditionJSONObject)
            val countsResult = statusDAO.getOrderStatusCounts(condition.branchId, condition.startDate, condition.endDate)

            val result = JSONArray()
            result.put(0, ordersResult)
            result.put(1, countsResult)

            return result
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        return statusDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: String): JSONObject? {
        println(data)
        val settings = statusDAO.getBranchSettings(authKey, id)

        println(settings.toString())
        if (settings != null) {
            var branchSetting = settings.get("branchSettings") as JSONObject
            val newSettings = JSONObject()

            val names = arrayOf("basicStartTime", "delayTime", "extraCharge", "extraChargePercent", "enableOrderAccept")

            newSettings.put("id", id)
            for (name in names) {
                newSettings.put(name, data[name] ?: branchSetting.get(name))
            }

            println(newSettings.toString())

            return statusDAO.setBranchSettings(authKey, newSettings.toString())
        }

        return null
    }
}