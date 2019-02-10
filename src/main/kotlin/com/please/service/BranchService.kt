package com.please.service

import com.please.dataAccess.BranchDAO
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BranchService {
    @Autowired
    private lateinit var branchDAO: BranchDAO

    fun searchList(authKey: String, branchName: String?, metro: String?, pageIndex: Int?): String {
        val info = JSONObject()
        info.put("branchName", branchName)
        info.put("metro", metro)
        info.put("pageIndex", pageIndex)
        return branchDAO.searchBranchList(authKey, info.toString())
    }

    fun getBranches(id: Long): MutableList<Map<String, Any?>> {
        return branchDAO.getBranches(id)
    }

    fun getBranchSettings(authKey: String, branchId: Long): String {
        return branchDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: Long): String {
        val settings = branchDAO.getBranchSettings(authKey, id)

        val branchSetting = JSONObject(settings).get("branchSettings") as JSONObject
        val newSettings = JSONObject()
        val names = arrayOf("basicStartTime", "delayTime", "extraCharge", "extraChargePercent", "enableOrderAccept")

        newSettings.put("id", id)
        for (name in names) {
            newSettings.put(name, data[name] ?: branchSetting.get(name))
        }
        return branchDAO.setBranchSettings(authKey, newSettings.toString())
    }
}