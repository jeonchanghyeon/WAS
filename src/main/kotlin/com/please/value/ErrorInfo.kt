package com.please.value

class ErrorInfo(resultCode: Int) {
    private val errorCodeMap = mapOf(
            101 to "SQL 내부 오류입니다",
            600 to "SQL 응답 시간이 초과되었습니다",
            601 to "유저 소속을 확인할 수 없습니다",
            602 to "유저를 확인할 수 없습니다",
            777 to "알 수 없는 에러입니다"
    )
    var resultCode: Int
    var description: String?

    init {
        this.resultCode = resultCode
        this.description = errorCodeMap[resultCode]
    }

    constructor(resultCode: Int, description: String) : this(resultCode) {
        this.resultCode = resultCode
        this.description = description
    }
}
