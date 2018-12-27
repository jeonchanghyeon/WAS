package com.please.service

import com.please.dataAccess.StatusDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.util.*

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

    fun searchOrders(authInfo: AuthInfo, data: MutableMap<String, Any>, paymentType: MutableList<Int>?, orderStatusIds: MutableList<Int>?): JSONObject? {
        val condition = Condition(
                data["branch-id"] as String,
                data["id"] as String?,
                data["shop-name"] as String?,
                data["rider-name"] as String?,
                orderStatusIds,
                paymentType,
                data["is-shared"] as Boolean?,
                Timestamp.valueOf(data["start-date"] as String? ?: "1000-01-01 00:00:00"),
                Timestamp.valueOf(data["end-date"] as String? ?: "9999-12-31 23:59:59")
        )

        val conditionJSONObject = JSONObject()
        conditionJSONObject.put("branchId", condition.branchId)
        conditionJSONObject.put("id", condition.id)
        conditionJSONObject.put("shopName", condition.shopName)
        conditionJSONObject.put("riderName", condition.riderName)
        conditionJSONObject.put("orderStatusIds", condition.orderStatusIds)
        conditionJSONObject.put("paymentTypes", condition.paymentTypes)
        conditionJSONObject.put("isShared", condition.isShared)
        conditionJSONObject.put("dateType", "create")
        conditionJSONObject.put("startDate", condition.startDate)
        conditionJSONObject.put("endDate", condition.endDate)

        println(conditionJSONObject.toString())
        val result = statusDAO.searchOrders(authInfo, conditionJSONObject)
        println("result : $result")
        return result
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