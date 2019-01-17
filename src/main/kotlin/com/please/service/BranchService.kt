package com.please.service

import com.please.dataAccess.BranchDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BranchService {
    @Autowired
    private lateinit var branchDAO: BranchDAO

    fun searchList(authKey: String, branchName: String?, metro: String?, pageIndex: Int?): JSONObject? {
        val info = JSONObject()
        info.put("branchName", branchName)
        info.put("metro", metro)
        info.put("pageIndex", pageIndex)
        return branchDAO.searchBranchList(authKey, info);
    }

    fun getBranches(id: Long): MutableList<Map<String, Any?>>? {
        return branchDAO.getBranches(id)
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        return branchDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: String): JSONObject? {
        println(data)
        val settings = branchDAO.getBranchSettings(authKey, id)

        println(settings.toString())
        if (settings != null) {
            val branchSetting = settings.get("branchSettings") as JSONObject
            val newSettings = JSONObject()

            val names = arrayOf("basicStartTime", "delayTime", "extraCharge", "extraChargePercent", "enableOrderAccept")

            newSettings.put("id", id)
            for (name in names) {
                newSettings.put(name, data[name] ?: branchSetting.get(name))
            }

            println(newSettings.toString())

            return branchDAO.setBranchSettings(authKey, newSettings.toString())
        }

        return null
    }
}