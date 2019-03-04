import {$} from "./element.js";
import {numberWithCommas, YYYYmmdd} from "./format.js";
import {getJSON} from "./ajax.js";
import {addCloseModalEvent} from "./modal.js";

let point_ = null;
export const loadPoint = () =>
    getJSON("/api/point").then(
        (obj) => {
            point_ = parseInt(obj["point"]["point"]);
            const point = obj["point"]["point"].toString();
            $("point").innerText = numberWithCommas(point);
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
    const id = $("userId").value;

    getJSON('api/users/' + id + '/account').then(
        obj => {
            const owner = obj["owner"];
            const account = obj["account"];
            const bank = obj["bank"];

            $("bank-account").innerHTML = `${owner} ${account} ${bank}`;
        }
    ).catch(() => {
        $("bank-account").innerHTML = '-';
    });

    mileageModal.style.display = 'initial';
    displayWithdrawalSection();
};

addCloseModalEvent("mileage_modal", "close-button");

$("btn-full-withdraw").onclick = () => {
    $("amount").value = parseInt($("point").innerText);
};

$("amount").onchange = () => {
    const fee = parseInt($("withdraw-fees").value);
    const amount = parseInt($("amount").value);
    const point = point_;

    $("deducted-amount").value = numberWithCommas(point - amount - fee) + "원";
};