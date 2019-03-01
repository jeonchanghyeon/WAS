import {$} from "./element.js";
import {numberWithCommas, YYYYmmdd} from "./format.js";
import {getJSON} from "./ajax.js";
import {addCloseModalEvent} from "./modal.js";

export const loadPoint = () =>
    getJSON("/api/point").then(
        (obj) => {
            const point = obj["point"]["point"].toString();
            $("point").innerText = point;
            $("mileage").innerText = numberWithCommas(point) + "원";
        }
    );

const displayWithdrawalSection = () => {
    $("withdraw-section").style.display = "flex";
    $("withdraw-submit-section").style.display = "flex";

    $("transfer-section").style.display = "none";
    $("deposit-submit-section").style.display = "none";
};

const displayDepositSection = () => {
    $("withdraw-section").style.display = "none";
    $("withdraw-submit-section").style.display = "none";

    $("transfer-section").style.display = "flex";
    $("deposit-submit-section").style.display = "flex";
};

$("btn-withdraw").onclick = displayWithdrawalSection;
$("btn-deposit").onclick = displayDepositSection;

const mileageModal = $('mileage_modal');

$("point-area").onclick = () => {
    const date = YYYYmmdd(new Date());

    loadPoint();
    $("mileage-description").innerHTML = `${date} 현재 마일리지`;

    mileageModal.style.display = 'initial';
    displayWithdrawalSection();
};

addCloseModalEvent("mileage_modal", "close-button");
