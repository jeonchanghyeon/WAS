package com.please.value

class ErrorInfo(resultCode: Int) {
    private val errorCodeMap = mapOf(
            101 to "SQL 내부 오류입니다",
            600 to "SQL 응답 시간이 초과되었습니다",
            601 to "유저 소속을 확인할 수 없습니다",
            602 to "유저를 확인할 수 없습니다",
            603 to "포인트가 부족합니다",
            604 to "계좌를 확인할 수 없습니다",
            605 to "유효하지 않은 값이 사용되었습니다",
            606 to "패스워드가 일치하지 않습니다.",
            607 to "패스워드가 등록되지 않은 계정입니다.",
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
