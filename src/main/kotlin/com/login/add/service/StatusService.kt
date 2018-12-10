package com.login.add.service

import com.login.add.dataAccess.StatusDAO
import com.login.add.value.AuthInfo
import com.login.add.value.Condition
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

    fun getBranchs(authInfo: AuthInfo, distributeId: Int): MutableList<Map<String, Any?>>? {
        return statusDAO.getBranchs(authInfo, distributeId)
    }

    fun searchOrders(authInfo: AuthInfo, data: MutableMap<String, Any>, paymentType: Array<Boolean>, serviceType: Array<Boolean>): Map<String, Any>? {
        val condition = Condition(
                data["branchId"] as String? ?: "",
                if (data["start_date"] != "-1") Timestamp.valueOf(data["start_date"] as String) else Timestamp(0),
                if (data["end_date"] != "-1") Timestamp.valueOf(data["end_date"] as String) else Timestamp(23123123123123), // TODO INT 최대
                paymentType,
                serviceType,
                data["default_start"] as Int? ?: 0, // TODO INT 최대
                data["delay_time"] as Int? ?: 1232342342, // TODO INT 최대
                data["additional_cost_percent"] as Int? ?: 100,
                data["additional_cost_won"] as Int? ?: 0
        )

        return statusDAO.searchOrders(authInfo, condition)
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