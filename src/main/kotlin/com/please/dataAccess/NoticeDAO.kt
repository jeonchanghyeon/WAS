package com.please.dataAccess

import com.please.exception.SqlAbnormalResultException
import com.please.persistence.queryForJSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class NoticeDAO {
    @Autowired
    @Qualifier("jdbcMain")
    private lateinit var template: JdbcTemplate

    @Throws(SqlAbnormalResultException::class)
    fun getNoticeList(authKey: String, noticeInfo: String): String {
        return template.queryForJSONObject("CALL getSearchedNotices2(?, ?)", authKey, noticeInfo)
    }

    @Throws(SqlAbnormalResultException::class)
    fun update(authKey: String, noticeInfo: String): String {
        return template.queryForJSONObject("CALL setNotice(?, ?)", authKey, noticeInfo)
    }

    @Throws(SqlAbnormalResultException::class)
    fun getNotice(authKey: String, noticeId: Int): String {
        return template.queryForJSONObject("CALL getNotice(?, ?)", authKey, noticeId)
    }

    @Throws(SqlAbnormalResultException::class)
    fun insert(authKey: String, addedNotice: String): String {
        return template.queryForJSONObject("CALL addNotice(?, ?)", authKey, addedNotice)
    }

    @Throws(SqlAbnormalResultException::class)
    fun delete(authKey: String, deletedNotice: String): String {
        return template.queryForJSONObject("CALL removeNotice(?, ?)", authKey, deletedNotice)
    }
}