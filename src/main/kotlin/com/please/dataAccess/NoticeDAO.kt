package com.please.dataAccess

import com.please.persistence.queryForJSONObject
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class NoticeDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    fun getNoticeList(authKey: String, noticeInfo: JSONObject): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getSearchedNotices2(?, ?)", authKey, noticeInfo.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

//    fun update(authKey: String, ): JSONObject? {
//        try {
//            return template.queryForJSONObject("CALL setNotice(?, ?)", authKey, noticeInfo.toString())
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }
//        return null
//    }

    fun getNotice(authKey: String, noticeId: Int): JSONObject? {
        try {
            return template.queryForJSONObject("CALL getNotice(?, ?)", authKey, noticeId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun insert(authKey: String, addedNotice: String): JSONObject? {
        try {
            return template.queryForJSONObject("CALL addNotice(?, ?)", authKey, addedNotice)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}